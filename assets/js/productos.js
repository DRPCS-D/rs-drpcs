// Helpers de producto. Los datos están en productos.data.js (generado por tools/extraer_pdf.py).
const COLORES = { negro: '#0a0a0a', blanco: '#ffffff', gris: '#9ca3af', crema: '#e8dcc2', azul: '#4b6a9b', celeste: '#22d3ee', verde: '#84cc16', rojo: '#dc2626', rosa: '#f472b6', naranja: '#f97316', amarillo: '#fee400', marron: '#8b5a2b' };
const CATEGORIAS = { calzado: 'Calzados', remera: 'Remeras', abrigo: 'Buzos y camperas', pantalon: 'Pantalones y shorts', accesorio: 'Accesorios', fitness: 'Fitness' };
const gs = n => 'Gs. ' + new Intl.NumberFormat('es-PY').format(n);
const TAG_LABEL = { nuevo: 'NUEVO', top: 'TOP VENTAS', sale: 'SALE' };

function cardProducto(p) {
  const tag = p.tags[0] ? `<span class="absolute top-2 left-2 z-10 ${p.tags[0] === 'sale' ? 'bg-primary-container text-on-primary-container' : 'bg-surface text-primary'} font-label-code text-label-code font-bold uppercase px-2 py-1 rounded">${TAG_LABEL[p.tags[0]]}</span>` : '';
  const talles = p.talles.map(t => `<span class="px-1.5 py-0.5 border border-zinc-300 text-zinc-800 text-[10px] font-label-code">${t}</span>`).join('');
  return `<article class="group bg-surface-container-lowest border border-zinc-800 hover:border-primary-container rounded-lg overflow-hidden flex flex-col transition-colors">
    <div class="relative bg-white aspect-square overflow-hidden m-2 rounded-xl">
      ${tag}
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300">
      <div class="absolute inset-x-0 bottom-0 bg-white/95 p-2 translate-y-full group-hover:translate-y-0 transition-transform flex flex-wrap gap-1 justify-center">${talles}</div>
    </div>
    <div class="p-space-md pt-space-xs flex flex-col gap-1 flex-1">
      <p class="font-label-code text-label-code uppercase text-primary-container">${p.marca}</p>
      <h3 class="font-headline-sm text-headline-sm uppercase text-primary leading-tight">${p.nombre}</h3>
      <div class="mt-auto pt-space-sm flex items-end justify-between gap-2">
        <div>
          <p class="font-price-lg text-price-lg text-primary">${gs(p.precio)}</p>
          ${p.precioAnterior ? `<p class="font-label-code text-label-code text-zinc-500 line-through">${gs(p.precioAnterior)}</p>` : ''}
          <p class="font-label-code text-label-code uppercase text-zinc-500">REF: ${p.ref}</p>
        </div>
        <button type="button" aria-label="Agregar ${p.nombre}" class="bg-primary-container text-on-primary-container p-2 rounded hover:brightness-110 glow"><span class="material-symbols-outlined text-[20px]">shopping_bag</span></button>
      </div>
    </div>
  </article>`;
}
