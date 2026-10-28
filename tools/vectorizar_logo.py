"""Vectoriza el logo (texto) en dos capas: silueta negra + relleno amarillo.
Uso: PYTHONPATH=<carpeta con vtracer> python tools/vectorizar_logo.py <logo.png> <salida.svg>"""
import re, sys, io
from PIL import Image, ImageChops
import vtracer

src, dst = sys.argv[1], sys.argv[2]
K = 2
im = Image.open(src).convert('RGBA')
bg = Image.new('RGBA', im.size, 'white')
bg.alpha_composite(im)
rgb = bg.convert('RGB').resize((im.width * K, im.height * K), Image.LANCZOS)
px = rgb.load()
W, H = rgb.size

sil = Image.new('L', (W, H), 255)   # 0 = tinta
yel = Image.new('L', (W, H), 255)
ps, py = sil.load(), yel.load()
ys = []
for y in range(H):
    for x in range(W):
        r, g, b = px[x, y]
        if min(r, g, b) < 170 or (r > 200 and g > 190 and b < 150):
            ps[x, y] = 0
        if r > 215 and g > 200 and b < 110:
            py[x, y] = 0
            ys.append((r, g, b))
amarillo = '#%02x%02x%02x' % tuple(sorted(c[i] for c in ys)[len(ys) // 2] if False else sum(c[i] for c in ys) // len(ys) for i in range(3))


def trazar(mask):
    buf = io.BytesIO(); mask.save(buf, 'PNG')
    svg = vtracer.convert_raw_image_to_svg(buf.getvalue(), img_format='png', colormode='binary', hierarchical='stacked',
                                          mode='spline', filter_speckle=6, corner_threshold=55, length_threshold=3.5,
                                          splice_threshold=45, path_precision=2)
    return re.findall(r'<path d="([^"]+)"[^>]*?(?:transform="([^"]+)")?[^>]*/>', svg), svg


pn, raw_n = trazar(sil)
py_, raw_y = trazar(yel)


def paths(raw, fill):
    out = []
    for m in re.finditer(r'<path ([^>]*?)/>', raw):
        a = m.group(1)
        d = re.search(r'd="([^"]+)"', a).group(1)
        t = re.search(r'transform="([^"]+)"', a)
        f = re.search(r'fill="([^"]+)"', a).group(1).lower()
        if f in ('#ffffff', '#fff'):
            continue
        out.append(f'<path d="{d}" fill="{fill}"' + (f' transform="{t.group(1)}"' if t else '') + '/>')
    return '\n  '.join(out)


x0, y0, x1, y1 = ImageChops.invert(sil).getbbox()
m = 6
vb = f'{x0 - m} {y0 - m} {x1 - x0 + 2 * m} {y1 - y0 + 2 * m}'
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Rock Sport">\n'
       f'  <g>\n  {paths(raw_n, "#000000")}\n  </g>\n  <g>\n  {paths(raw_y, amarillo)}\n  </g>\n</svg>\n')
open(dst, 'w', encoding='utf8').write(svg)
print('ok', amarillo, len(svg))
