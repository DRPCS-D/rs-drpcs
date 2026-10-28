# Rock Sport — landing y catálogo (demo)

Sitio estático (HTML + Tailwind por CDN + JS vanilla). Sin build.

- `index.html` — landing
- `catalogo.html` — catálogo con filtros
- `assets/js/productos.data.js` — datos de ejemplo (generado desde el PDF de stock)
- `tools/` — scripts para regenerar fotos y datos (`extraer_pdf.py`, `curacion.py`), el logo vectorizado y el favicon

Probar en local: `python -m http.server 5500` y abrir http://localhost:5500

Deploy en Vercel: importar el repositorio. Framework preset "Other", sin build command, output en la raíz.
El sitio está marcado `noindex` (meta, `robots.txt` y cabecera `X-Robots-Tag`) hasta que se decida publicarlo.
