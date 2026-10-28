"""Genera el favicon (estrella del logo) en SVG, PNG e ICO. Uso: python -I tools/favicon.py"""
import math
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / 'assets' / 'img'
# puntas de la estrella medidas sobre el logo original (1920x1080)
TIPS = [(402, 235), (797, 330), (822, 712), (446, 850), (185, 558)]
C = (sum(p[0] for p in TIPS) / 5, sum(p[1] for p in TIPS) / 5)
R = sum(math.dist(C, p) for p in TIPS) / 5
INNER = 0.40


def estrella():
    pts = []
    for i, t in enumerate(TIPS):
        n = TIPS[(i + 1) % 5]
        pts.append(t)
        mx, my = (t[0] + n[0]) / 2 - C[0], (t[1] + n[1]) / 2 - C[1]
        k = INNER * R / math.hypot(mx, my)
        pts.append((C[0] + mx * k, C[1] + my * k))
    return pts


def norm(pts, size, pad):
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    x0, y0, w, h = min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys)
    s = (size - 2 * pad) / max(w, h)
    ox, oy = (size - w * s) / 2, (size - h * s) / 2
    return [((x - x0) * s + ox, (y - y0) * s + oy) for x, y in pts]


YEL = '#fdf113'
P = norm(estrella(), 64, 5)
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
       f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in P)}" fill="{YEL}" stroke="#000" stroke-width="5" stroke-linejoin="miter" stroke-miterlimit="6"/>'
       '</svg>\n')
(OUT / 'favicon.svg').write_text(svg, encoding='utf8')


def raster(size):
    s = 8
    big = size * s
    im = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pts = norm(estrella(), big, big * 0.09)
    # contorno negro: polígono agrandado desde el centro + relleno amarillo
    cx, cy = big / 2, big / 2
    d.polygon([(cx + (x - cx) * 1.0, cy + (y - cy) * 1.0) for x, y in pts], fill=(0, 0, 0, 255))
    inner = norm(estrella(), big, big * 0.09 + big * 0.075)
    d.polygon(inner, fill=(253, 241, 19, 255))
    return im.resize((size, size), Image.LANCZOS)


for n in (32, 180, 512):
    raster(n).save(OUT / (f'favicon-{n}.png' if n != 180 else 'apple-touch-icon.png'))
raster(256).save(OUT / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
print('ok')
