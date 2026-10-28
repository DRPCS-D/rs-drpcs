(function () {
  const WA = '595984105482';
  const $ = id => document.getElementById(id);
  const id = Number(new URLSearchParams(location.search).get('id'));
  const p = PRODUCTOS.find(x => x.id === id);
  const root = $('detalle');

  if (!p) {
    root.innerHTML = `<div class="text-center py-space-2xl border border-dashed border-zinc-700 rounded-lg">
      <span class="material-symbols-outlined text-primary-container text-[48px]">search_off</span>
      <h1 class="font-headline-md text-headline-md uppercase mt-2">Producto no encontrado</h1>
      <a href="catalogo.html" class="inline-block mt-space-md bg-primary-container text-on-primary-container font-label-action text-label-action uppercase px-space-lg py-space-sm rounded">Volver al catálogo</a></div>`;
    return;
  }

  document.title = p.nombre + ' — ROCK SPORT';
  const cat = CATEGORIAS[p.categoria];
  const esCalzado = p.categoria === 'calzado';
  const tag = p.tags[0] ? `<span class="${p.tags[0] === 'sale' ? 'bg-primary-container text-on-primary-container' : 'bg-surface text-primary border border-zinc-700'} font-label-code text-label-code font-bold uppercase px-2 py-1 rounded">${TAG_LABEL[p.tags[0]]}</span>` : '';
  const off = p.precioAnterior ? Math.round((1 - p.precio / p.precioAnterior) * 100) : 0;
  const poco = p.stock <= 5;
  const filas = [['Marca', p.marca], ['Referencia', p.ref], ['Categoría', cat], ['Género', p.genero], ['Colores', p.colores.join(', ')]];

  let talle = null;
  const waUrl = () => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(
    `Hola Rock Sport, me interesa: ${p.nombre} (REF ${p.ref})` + (talle ? `, talle ${talle}` : '') + '. ¿Está disponible?');

  root.innerHTML = `
    <nav class="font-label-code text-label-code uppercase text-zinc-500 flex flex-wrap gap-2" aria-label="Migas de pan">
      <a href="index.html" class="hover:text-primary-container">Inicio</a><span>/</span>
      <a href="catalogo.html" class="hover:text-primary-container">Catálogo</a><span>/</span>
      <a href="catalogo.html?cat=${p.categoria}" class="hover:text-primary-container">${cat}</a><span>/</span>
      <span class="text-primary">${p.nombre}</span>
    </nav>
    <div class="grid lg:grid-cols-2 gap-space-lg mt-space-md">
      <div class="relative bg-white rounded-xl aspect-square overflow-hidden border border-zinc-800">
        <div class="absolute top-3 left-3 z-10 flex gap-2">${tag}${off ? `<span class="bg-primary-container text-on-primary-container font-label-code text-label-code font-bold px-2 py-1 rounded">-${off}%</span>` : ''}</div>
        <img src="${p.imagen}" alt="${p.nombre}" class="w-full h-full object-contain">
      </div>
      <div class="flex flex-col gap-space-md">
        <div>
          <a href="catalogo.html?marca=${encodeURIComponent(p.marca)}" class="font-label-code text-label-code uppercase text-primary-container hover:underline">${p.marca}</a>
          <h1 class="text-[32px] md:text-[44px] leading-none font-bold uppercase tracking-tighter text-primary font-headline-lg mt-1">${p.nombre}</h1>
          <p class="font-label-code text-label-code uppercase text-zinc-500 mt-space-xs">REF: ${p.ref}</p>
        </div>
        <div>
          <p class="font-price-lg text-[36px] leading-none text-primary">${gs(p.precio)}</p>
          ${p.precioAnterior ? `<p class="font-label-code text-label-code text-zinc-500 line-through mt-1">${gs(p.precioAnterior)}</p>` : ''}
          <p class="font-label-code text-label-code uppercase text-on-surface-variant mt-1 flex items-center gap-2"><span class="w-2 h-2 rounded-full ${poco ? 'bg-orange-500' : 'bg-lime-400'}"></span>${poco ? '¡Últimas unidades!' : 'En stock'}</p>
        </div>
        <div>
          <div class="flex items-center justify-between mb-space-xs"><h2 class="font-label-action text-label-action uppercase text-primary-container">Talle</h2><span id="talle-sel" class="font-label-code text-label-code uppercase text-on-surface-variant">Elegí un talle</span></div>
          <div id="talles" class="flex flex-wrap gap-2"></div>
        </div>
        <div>
          <h2 class="font-label-action text-label-action uppercase text-primary-container mb-space-xs">Color</h2>
          <div class="flex gap-2">${p.colores.map(c => `<span title="${c}" class="w-8 h-8 rounded-full border-2 border-zinc-600" style="background:${COLORES[c]}"></span>`).join('')}</div>
        </div>
        <div class="flex flex-col sm:flex-row gap-space-sm">
          <a id="comprar" href="#" target="_blank" rel="noopener" class="flex-1 bg-primary-container text-on-primary-container font-label-action text-label-action uppercase px-space-lg py-space-md rounded flex items-center justify-center gap-2 glow hover:brightness-110"><span class="material-symbols-outlined">chat</span>Consultar por WhatsApp</a>
          <button type="button" class="bg-surface-container border border-zinc-700 hover:border-primary-container font-label-action text-label-action uppercase px-space-lg py-space-md rounded flex items-center justify-center gap-2"><span class="material-symbols-outlined">shopping_bag</span>Agregar</button>
        </div>
        <ul class="grid sm:grid-cols-3 gap-space-sm font-label-code text-label-code uppercase text-on-surface-variant">
          <li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary-container">local_shipping</span>Envíos a todo el país</li>
          <li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary-container">storefront</span>Retiro en tienda</li>
          <li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary-container">loyalty</span>Fidelity Card</li>
        </ul>
        <div class="border border-zinc-800 rounded-lg bg-surface-container-lowest">
          <h2 class="font-label-action text-label-action uppercase text-primary-container px-space-md pt-space-md">Detalles</h2>
          <dl class="p-space-md pt-space-sm font-body-sm text-body-sm">${filas.map(([k, v]) => `<div class="flex justify-between gap-4 py-2 border-b border-zinc-800 last:border-0"><dt class="text-on-surface-variant">${k}</dt><dd class="text-primary text-right capitalize">${v}</dd></div>`).join('')}</dl>
        </div>
        <p class="font-label-code text-label-code uppercase text-zinc-500">Ficha de ejemplo · precio y stock tomados del listado interno.</p>
      </div>
    </div>`;

  const cont = $('talles'), btn = $('comprar');
  cont.innerHTML = p.talles.map(t => `<button type="button" data-t="${t}" class="size-btn min-w-[48px] px-3 py-2 border border-zinc-700 hover:border-primary-container rounded font-label-code text-label-code">${t}</button>`).join('');
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    talle = talle === b.dataset.t ? null : b.dataset.t;
    cont.querySelectorAll('.size-btn').forEach(x => x.classList.toggle('on', x.dataset.t === talle));
    $('talle-sel').textContent = talle ? (esCalzado ? 'Talle ' : 'Talle ') + talle : 'Elegí un talle';
    btn.href = waUrl();
  });
  btn.href = waUrl();

  const rel = PRODUCTOS.filter(x => x.id !== p.id).sort((a, b) =>
    (b.categoria === p.categoria) - (a.categoria === p.categoria) || (b.marca === p.marca) - (a.marca === p.marca)).slice(0, 4);
  $('relacionados').innerHTML = rel.map(cardProducto).join('');
  $('ver-mas').href = 'catalogo.html?cat=' + p.categoria;
  $('relacionados-wrap').classList.remove('hidden');
})();
