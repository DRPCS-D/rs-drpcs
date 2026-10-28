"""Recorta productos de los flyers y prepara logo/campañas. Uso: python -I tools/recortar.py"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "archivos"
OUT = ROOT / "assets" / "img"
PROD = OUT / "productos"
PROD.mkdir(parents=True, exist_ok=True)

COLS = [(140, 410), (495, 765)]
SHOES_ROWS = [(435, 600), (770, 935), (1130, 1290)]
TEES_ROWS = [(335, 605), (680, 945), (1040, 1300)]

SHOES = ["rainha-knit-coral", "rainha-pro-silver", "rainha-stealth-black",
         "rainha-speed-cyan", "rainha-ultra-burgundy", "rainha-flash-neon"]
TEES = ["ecko-logo-negra", "ecko-logo-gris", "ecko-drip-azul",
        "ecko-drip-negra", "ecko-basica-azul", "ecko-basica-negra"]


def cut(img, names, rows, size, fill=0.82):
    from PIL import ImageChops
    i = 0
    for r in rows:
        for c in COLS:
            tile = img.crop((c[0], r[0], c[1], r[1]))
            diff = ImageChops.difference(tile, Image.new("RGB", tile.size, "white")).convert("L").point(lambda v: 255 if v > 18 else 0)
            tile = tile.crop(diff.getbbox())
            k = min(size[0] * fill / tile.width, size[1] * fill / tile.height)
            tile = tile.resize((round(tile.width * k), round(tile.height * k)), Image.LANCZOS)
            canvas = Image.new("RGB", size, "white")
            canvas.paste(tile, ((size[0] - tile.width) // 2, (size[1] - tile.height) // 2))
            canvas.save(PROD / f"{names[i]}.webp", quality=88)
            i += 1


cut(Image.open(SRC / "IMG-20261027-WA0022.jpg").convert("RGB"), SHOES, SHOES_ROWS, (640, 480))
cut(Image.open(SRC / "IMG-20261027-WA0023.jpg").convert("RGB"), TEES, TEES_ROWS, (640, 640), 0.9)

for src, dst in [("IMG-20261027-WA0020.jpg", "campana-ecko.jpg"), ("IMG-20261027-WA0021.jpg", "campana-rainha.jpg")]:
    Image.open(SRC / src).convert("RGB").save(OUT / dst, quality=90)

# logo: quitar fondo blanco -> transparente
logo = Image.open(SRC / "logo.png").convert("RGBA")
px = logo.load()
for y in range(logo.height):
    for x in range(logo.width):
        r, g, b, a = px[x, y]
        m = min(r, g, b)
        if m > 235:
            px[x, y] = (r, g, b, 0)
        elif m > 200:
            px[x, y] = (r, g, b, int((235 - m) / 35 * 255))
logo = logo.crop(logo.getbbox())
logo.save(OUT / "logo.png")
print("ok", logo.size)
