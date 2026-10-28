(function () {
  const PAGE = 12, MAXP = 1200000;
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const S = {
    q: params.get('q') || '',
    cat: params.get('cat') ? params.get('cat').split(',') : [],
    marca: params.get('marca') ? [params.get('marca')] : [],
    sale: params.get('tag') === 'sale',
    precio: MAXP, talles: [], colores: [], orden: 'destacados', pag: 1,
  };
  const CATS = CATEGORIAS;
  const MARCAS = [...new Set(PRODUCTOS.map(p => p.marca))].sort();
  const num = t => parseFloat(t);
  const esCalzado = p => p.categoria === 'calzado';
  const TC = [...new Set(PRODUCTOS.filter(esCalzado).flatMap(p => p.talles).map(t => Math.floor(num(t))).filter(n => n >= 35 && n <= 47))].sort((x, y) => x - y).map(String);
  const ORDEN_ROPA = ['XP', 'P', 'S', 'M', 'G', 'L', 'XL', 'GG', '2XL', '3XL', 'TU', '28', '30', '32', '34'];
  const TR = ORDEN_ROPA.filter(t => PRODUCTOS.some(p => !esCalzado(p) && p.talles.includes(t)));
  const COLS = [...new Set(PRODUCTOS.flatMap(p => p.colores))];
  const tieneTalle = (p, t) => esCalzado(p) ? p.talles.some(x => String(Math.floor(num(x))) === t) : p.talles.includes(t);
  const toggle = (arr, v) => { const i = arr.indexOf(v); i < 0 ? arr.push(v) : arr.splice(i, 1); S.pag = 1; };

  const check = (name, val, label, on) => `<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" data-k="${name}" value="${val}" ${on ? 'checked' : ''}> ${label}</label>`;
  const sizeBtn = (t, on) => `<button type="button" data-k="talles" data-v="${t}" class="size-btn ${on ? 'on' : ''} min-w-[36px] px-2 py-1 border border-zinc-700 hover:border-primary-container rounded font-label-code text-label-code">${t}</button>`;

  function renderFiltros() {
    $('f-cat').innerHTML = Object.entries(CATS).map(([k, l]) => check('cat', k, l, S.cat.includes(k))).join('');
    $('f-marca').innerHTML = MARCAS.map(m => check('marca', m, m, S.marca.includes(m))).join('');
    $('f-tc').innerHTML = TC.map(t => sizeBtn(t, S.talles.includes(t))).join('');
    $('f-tr').innerHTML = TR.map(t => sizeBtn(t, S.talles.includes(t))).join('');
    $('f-color').innerHTML = COLS.map(c => `<button type="button" data-k="colores" data-v="${c}" title="${c}" aria-label="${c}" aria-pressed="${S.colores.includes(c)}" class="w-7 h-7 rounded-full border-2 ${S.colores.includes(c) ? 'border-primary-container scale-110' : 'border-zinc-600'}" style="background:${COLORES[c]}"></button>`).join('');
    $('f-precio').value = S.precio; $('f-precio-v').textContent = gs(S.precio);
    $('f-sale').checked = S.sale; $('q').value = S.q; $('orden').value = S.orden;
  }

  function filtrar() {
    const q = S.q.trim().toLowerCase();
    let r = PRODUCTOS.filter(p =>
      (!q || (p.nombre + ' ' + p.marca + ' ' + p.ref).toLowerCase().includes(q)) &&
      (!S.cat.length || S.cat.includes(p.categoria)) &&
      (!S.marca.length || S.marca.includes(p.marca)) &&
      (!S.sale || p.tags.includes('sale')) &&
      p.precio <= S.precio &&
      (!S.talles.length || S.talles.some(t => tieneTalle(p, t))) &&
      (!S.colores.length || S.colores.some(c => p.colores.includes(c))));
    const o = S.orden;
    if (o === 'precio-asc') r.sort((a, b) => a.precio - b.precio);
    else if (o === 'precio-desc') r.sort((a, b) => b.precio - a.precio);
    else if (o === 'nombre') r.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else r.sort((a, b) => b.tags.includes('top') - a.tags.includes('top'));
    return r;
  }

  function chips() {
    const c = [];
    if (S.q) c.push(['q', '', `“${S.q}”`]);
    S.cat.forEach(v => c.push(['cat', v, CATS[v]]));
    S.marca.forEach(v => c.push(['marca', v, v]));
    S.talles.forEach(v => c.push(['talles', v, 'Talle ' + v]));
    S.colores.forEach(v => c.push(['colores', v, v]));
    if (S.sale) c.push(['sale', '', 'Ofertas']);
    if (S.precio < MAXP) c.push(['precio', '', 'Hasta ' + gs(S.precio)]);
    $('chips').innerHTML = c.map(([k, v, l]) => `<button type="button" data-chip="${k}" data-v="${v}" class="chip-on flex items-center gap-1 px-2 py-1 rounded font-label-code text-label-code uppercase font-bold">${l}<span class="material-symbols-outlined text-[14px]">close</span></button>`).join('');
  }

  function render() {
    const r = filtrar(), pages = Math.max(1, Math.ceil(r.length / PAGE));
    S.pag = Math.min(S.pag, pages);
    const slice = r.slice((S.pag - 1) * PAGE, S.pag * PAGE);
    $('count').textContent = `${r.length} producto${r.length === 1 ? '' : 's'} encontrado${r.length === 1 ? '' : 's'}`;
    $('grid').innerHTML = slice.map(cardProducto).join('');
    $('vacio').classList.toggle('hidden', r.length > 0);
    $('pag').innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) => `<button type="button" data-p="${i + 1}" ${i + 1 === S.pag ? 'aria-current="page"' : ''} class="w-10 h-10 rounded border ${i + 1 === S.pag ? 'chip-on' : 'border-zinc-700 hover:border-primary-container'}">${i + 1}</button>`).join('') : '';
    chips();
  }

  function reset() { Object.assign(S, { q: '', cat: [], marca: [], sale: false, precio: MAXP, talles: [], colores: [], pag: 1 }); renderFiltros(); render(); }

  $('filtros').addEventListener('change', e => {
    const k = e.target.dataset.k;
    if (k) { toggle(S[k], e.target.value); render(); }
    if (e.target.id === 'f-sale') { S.sale = e.target.checked; S.pag = 1; render(); }
  });
  $('filtros').addEventListener('click', e => {
    const b = e.target.closest('button[data-k]'); if (!b) return;
    toggle(S[b.dataset.k], b.dataset.v); renderFiltros(); render();
  });
  $('f-precio').addEventListener('input', e => { S.precio = +e.target.value; S.pag = 1; $('f-precio-v').textContent = gs(S.precio); render(); });
  $('q').addEventListener('input', e => { S.q = e.target.value; S.pag = 1; render(); });
  $('orden').addEventListener('change', e => { S.orden = e.target.value; render(); });
  $('limpiar').addEventListener('click', reset);
  $('limpiar2').addEventListener('click', reset);
  $('pag').addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (b) { S.pag = +b.dataset.p; render(); scrollTo({ top: 0, behavior: 'smooth' }); } });
  $('chips').addEventListener('click', e => {
    const b = e.target.closest('[data-chip]'); if (!b) return;
    const k = b.dataset.chip, v = b.dataset.v;
    if (k === 'q') S.q = ''; else if (k === 'sale') S.sale = false; else if (k === 'precio') S.precio = MAXP; else toggle(S[k], v);
    renderFiltros(); render();
  });

  const f = $('filtros'), ov = $('overlay');
  const drawer = open => { f.classList.toggle('hidden', !open); ov.classList.toggle('hidden', !open); };
  $('open-filtros').addEventListener('click', () => drawer(true));
  $('close-filtros').addEventListener('click', () => drawer(false));
  ov.addEventListener('click', () => drawer(false));

  renderFiltros(); render();
})();
