"""Extrae de catalogo.pdf las fotos y datos de los productos elegidos en curacion.py.
Uso: python -I tools/extraer_pdf.py <catalogo.pdf> [carpeta_salida_hoja_de_contacto]
Genera assets/img/productos/<slug>.webp y assets/js/productos.js"""
import sys, re, json, colorsys
from pathlib import Path
import fitz
from PIL import Image, ImageChops, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from curacion import SEL

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'img' / 'productos'
PDF = sys.argv[1]
SHEET = sys.argv[2] if len(sys.argv) > 2 else None
doc = fitz.open(PDF)
NB = ' '
LETTER = {'PQ': 'P', 'MD': 'M', 'GD': 'G'}


def find(cod, page):
    """Devuelve (bbox_imagen, texto_bloque) del producto en la página."""
    p = doc[page - 1]
    imgs = [i['bbox'] for i in p.get_image_info()]
    for b in p.get_text('blocks'):
        if b[4].startswith('Cód: ' + cod + ' ·'):
            cx = (b[0] + b[2]) / 2
            cand = [i for i in imgs if i[0] - 15 <= b[0] <= i[2] and i[3] <= b[1] + 2]
            cand.sort(key=lambda i: b[1] - i[3])
            if cand:
                return cand[0], b[4]
    return None, None


def data_producto(cod, page):
    t = doc[page - 1].get_text()
    i = t.index('Cód: ' + cod + ' ·')
    nxt = t.find('Cód: ', i + 5)
    blk = t[i: nxt if nxt > 0 else len(t)]
    m = re.search(r'₲\s([\d\.]+)', blk)
    precio = int(m.group(1).replace('.', ''))
    total = int(re.search(r'Total: (\d+) uds', blk).group(1))
    talles = []
    for ln in blk.split('\n'):
        mm = re.match(r'(.+?): (\d+)$', ln.strip())
        if mm and int(mm.group(2)) > 0:
            s = mm.group(1).strip().replace(',', '.')
            talles.append(LETTER.get(s, s))
    return precio, total, talles


def color_de(im):
    px = [p for p in im.convert('RGB').resize((48, 48)).getdata() if min(p) < 225]
    if not px:
        return ['blanco']
    # color dominante por votación en categorías
    votos = {}
    for r, g, b in px:
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        if v < 0.28: c = 'negro'
        elif s < 0.14: c = 'gris' if v < 0.82 else 'blanco'
        elif h < 0.04 or h > 0.94: c = 'rojo'
        elif h < 0.11: c = 'marron' if v < 0.6 else 'naranja'
        elif h < 0.19: c = 'amarillo'
        elif h < 0.45: c = 'verde'
        elif h < 0.55: c = 'celeste'
        elif h < 0.72: c = 'azul'
        else: c = 'rosa'
        votos[c] = votos.get(c, 0) + 1
    tot = sum(votos.values())
    orden = sorted(votos.items(), key=lambda kv: -kv[1])
    res = [orden[0][0]] + [c for c, n in orden[1:3] if n / tot > 0.18]
    return res


def foto(cod, page, slug, fill=0.9, size=(560, 560)):
    bbox, _ = find(cod, page)
    if not bbox:
        return None
    r = fitz.Rect(*bbox)
    r = fitz.Rect(r.x0 + 1.5, r.y0 + 1.5, r.x1 - 1.5, r.y1 - 1.5)  # quita el borde casi blanco del recorte
    pix = doc[page - 1].get_pixmap(clip=r, dpi=230)
    im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    diff = ImageChops.difference(im, Image.new('RGB', im.size, 'white')).convert('L').point(lambda v: 255 if v > 28 else 0)
    bb = diff.getbbox()
    if bb:
        im = im.crop(bb)
    k = min(size[0] * fill / im.width, size[1] * fill / im.height)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    c = Image.new('RGB', size, 'white')
    c.paste(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
    c.save(OUT / (slug + '.webp'), quality=86)
    return c


filas, tiles = [], []
for n, (cod, page, slug, nombre, cat, gen, tags) in enumerate(SEL):
    img = foto(cod, page, slug)
    if img is None:
        print('SIN IMAGEN', cod, page); continue
    precio, total, talles = data_producto(cod, page)
    colores = color_de(img)
    filas.append(dict(id=n + 1, nombre=nombre, marca=None, categoria=cat, genero=gen, precio=precio,
                      ref=cod, colores=colores, talles=talles, tags=tags, imagen=slug + '.webp', stock=total))
    tiles.append((n + 1, slug, img))

MARCAS = [('ONEPRO', 'ONEPRO'), ('Live Up', 'LIVEUP'), ('Rainha', 'RAINHA'), ('Eckō Unltd', 'ECK'), ('Gangster', 'GANGSTER'), ('Vans', 'VANS'), ('Puma', 'PUMA'),
          ('Nike', 'NIKE'), ('Adidas', 'ADIDAS'), ('Patrick', 'PATRICK'), ('Kelme', 'KELME'), ('Mitchell & Ness', 'MITCHELL')]
for f in filas:
    s = f['imagen'].upper()
    f['marca'] = next((m for m, k in MARCAS if s.startswith(k) or (k == 'MITCHELL' and s.startswith('MN-'))
                       or (k == 'ECK' and s.startswith('ECKO'))), 'Rock Sport')

# precios de muestra para los productos en liquidación (la liquidación real se define en tienda)
for f in filas:
    if 'sale' in f['tags']:
        f['precioAnterior'] = int(round(f['precio'] / 0.8 / 1000) * 1000)

js = ['// Datos de ejemplo tomados del stock real (catalogo.pdf, 28/10/2026). Precios en Gs.',
      '// Los precios anteriores de los productos SALE son de muestra.',
      "const IMG = 'assets/img/productos/';", 'const PRODUCTOS = [']
for f in filas:
    d = dict(f); d['imagen'] = 'IMG + ' + json.dumps(d['imagen'])
    campos = ', '.join(f'{k}: ' + (v if k == 'imagen' else json.dumps(v, ensure_ascii=False)) for k, v in d.items())
    js.append('  { ' + campos + ' },')
js.append('];')
(ROOT / 'assets' / 'js' / 'productos.data.js').write_text('\n'.join(js) + '\n', encoding='utf8')
print(len(filas), 'productos')

if SHEET:
    cols = 8
    rows = (len(tiles) + cols - 1) // cols
    S = Image.new('RGB', (cols * 200, rows * 200), '#777')
    d = ImageDraw.Draw(S)
    for i, (n, slug, im) in enumerate(tiles):
        t = im.resize((196, 196)); x, y = (i % cols) * 200, (i // cols) * 200
        S.paste(t, (x + 2, y + 2)); d.rectangle([x + 2, y + 2, x + 60, y + 16], fill='black')
        d.text((x + 5, y + 4), f'{n} {filas[i]["colores"][0]}', fill='yellow')
    S.save(Path(SHEET) / 'sheet2.png')
