// Header y footer compartidos. Cada página define <div id="site-header" data-active="..."> y <div id="site-footer">.
(function () {
  const links = [
    ['inicio', 'Inicio', 'index.html'],
    ['calzado', 'Calzados', 'catalogo.html?cat=calzado'],
    ['remera', 'Indumentaria', 'catalogo.html?cat=remera,abrigo,pantalon'],
    ['marcas', 'Marcas', 'index.html#marcas'],
    ['sale', 'Ofertas / Sale', 'catalogo.html?tag=sale'],
    ['tiendas', 'Tiendas', 'index.html#tiendas'],
  ];
  const h = document.getElementById('site-header');
  if (h) {
    const active = h.dataset.active;
    const nav = links.map(([k, t, href]) =>
      `<a href="${href}" class="uppercase font-label-action text-label-action px-space-xs py-space-xs transition-colors ${k === active ? 'text-primary-container' : 'text-on-surface-variant hover:text-primary-container'}">${t}</a>`).join('');
    const navM = links.map(([k, t, href]) =>
      `<a href="${href}" class="block uppercase font-headline-sm text-headline-sm py-3 border-b border-zinc-800 ${k === active ? 'text-primary-container' : 'text-primary'}">${t}</a>`).join('');
    h.outerHTML = `<header class="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div class="h-20 w-full px-margin md:px-gutter-desktop max-w-7xl mx-auto flex items-center justify-between gap-space-md">
        <a href="index.html" class="shrink-0" aria-label="Rock Sport - inicio"><img src="assets/img/logo.svg" alt="Rock Sport" class="h-8 sm:h-9 md:h-10 w-auto"></a>
        <nav class="hidden xl:flex items-center gap-space-md" aria-label="Principal">${nav}</nav>
        <div class="flex items-center gap-space-sm">
          <form action="catalogo.html" class="hidden md:flex items-center bg-surface-container px-space-sm py-space-xs rounded gap-space-xs border border-transparent focus-within:border-primary-container">
            <span class="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input name="q" type="search" aria-label="Buscar" class="bg-transparent font-label-code text-label-code uppercase tracking-wider text-on-surface placeholder:text-on-surface-variant focus:outline-none w-40 lg:w-56" placeholder="BUSCAR PRODUCTO, REF...">
          </form>
          <button type="button" aria-label="Favoritos" class="p-space-xs text-on-surface-variant hover:text-primary-container relative"><span class="material-symbols-outlined text-[22px]">favorite</span><span class="absolute -top-1 -right-1 bg-primary-container text-on-primary-container font-label-code text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span></button>
          <button type="button" aria-label="Carrito" class="p-space-xs text-on-surface-variant hover:text-primary-container relative"><span class="material-symbols-outlined text-[22px]">shopping_bag</span><span class="absolute -top-1 -right-1 bg-primary-container text-on-primary-container font-label-code text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span></button>
          <button id="menu-btn" type="button" aria-label="Abrir menú" aria-expanded="false" class="xl:hidden p-space-xs text-primary"><span class="material-symbols-outlined text-[28px]">menu</span></button>
        </div>
      </div>
      <div id="menu-m" class="hidden xl:hidden bg-surface border-t border-zinc-800 px-margin pb-space-md">
        <form action="catalogo.html" class="flex items-center bg-surface-container px-space-sm py-space-sm rounded gap-space-xs my-space-md"><span class="material-symbols-outlined text-on-surface-variant text-[18px]">search</span><input name="q" type="search" aria-label="Buscar" class="bg-transparent font-label-code text-label-code uppercase text-on-surface placeholder:text-on-surface-variant focus:outline-none w-full" placeholder="BUSCAR PRODUCTO, REF..."></form>
        ${navM}
      </div>
    </header>`;
    const btn = document.getElementById('menu-btn'), m = document.getElementById('menu-m');
    btn.addEventListener('click', () => {
      const open = m.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', open);
      btn.firstElementChild.textContent = open ? 'close' : 'menu';
    });
  }

  const wa = document.createElement('a');
  wa.href = 'https://wa.me/595984105482'; wa.target = '_blank'; wa.rel = 'noopener'; wa.setAttribute('aria-label', 'Escribir por WhatsApp');
  wa.className = 'fixed bottom-4 right-4 z-40 bg-primary-container text-on-primary-container rounded-full w-14 h-14 flex items-center justify-center shadow-lg glow hover:scale-105 transition-transform';
  wa.innerHTML = '<span class="material-symbols-outlined text-[28px]">chat</span>';
  document.body.appendChild(wa);

  const f = document.getElementById('site-footer');
  if (f) {
    f.outerHTML = `<footer id="contacto" class="bg-surface-container-lowest border-t border-zinc-800">
      <div class="h-3 hazard"></div>
      <div class="max-w-7xl mx-auto px-margin md:px-gutter-desktop py-space-2xl grid grid-cols-2 md:grid-cols-4 gap-space-xl">
        <div class="col-span-2 md:col-span-1 flex flex-col gap-space-md">
          <img src="assets/img/logo.svg" alt="Rock Sport" class="h-10 w-auto self-start">
          <p class="font-body-sm text-body-sm text-on-surface-variant">Calzados e indumentaria con actitud roquera y alma deportiva. Ciudad del Este, con envíos a todo el país.</p>
        </div>
        <div><h4 class="font-label-action text-label-action uppercase text-primary-container mb-space-md">Tienda</h4>
          <ul class="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
            <li><a class="hover:text-primary" href="catalogo.html?cat=calzado">Calzados</a></li>
            <li><a class="hover:text-primary" href="catalogo.html?cat=remera,abrigo,pantalon">Indumentaria</a></li>
            <li><a class="hover:text-primary" href="catalogo.html?marca=Rainha">Rainha</a></li>
            <li><a class="hover:text-primary" href="catalogo.html?marca=Eck%C5%8D%20Unltd">Eckō Unltd</a></li>
            <li><a class="hover:text-primary" href="catalogo.html?tag=sale">Ofertas</a></li></ul></div>
        <div><h4 class="font-label-action text-label-action uppercase text-primary-container mb-space-md">Tiendas</h4>
          <ul class="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
            <li><b class="text-primary">Casa Matriz</b><br>Av. Adrián Jara esq. Pampliega<br>0983 934 044</li>
            <li><b class="text-primary">Km 7</b><br>Julio César Riquelme esq.<br>0986 768 869</li></ul></div>
        <div class="col-span-2 md:col-span-1"><h4 class="font-label-action text-label-action uppercase text-primary-container mb-space-md">Contacto</h4>
          <ul class="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
            <li class="flex gap-2"><span class="material-symbols-outlined text-[18px]">chat</span><a class="hover:text-primary" href="https://wa.me/595984105482" target="_blank" rel="noopener">Ventas online: 0984 105 482</a></li>
            <li class="flex gap-2"><span class="material-symbols-outlined text-[18px]">mail</span><a class="hover:text-primary" href="mailto:sport@patachoca.com.py">sport@patachoca.com.py</a></li>
            <li class="flex gap-2"><span class="material-symbols-outlined text-[18px]">language</span><a class="hover:text-primary" href="https://patachoca.com.py" target="_blank" rel="noopener">patachoca.com.py</a></li></ul>
          <div class="flex gap-3 mt-space-md font-label-code text-label-code uppercase">
            <a class="hover:text-primary-container underline" href="https://www.instagram.com/rocksportpy/" target="_blank" rel="noopener">Instagram</a>
            <a class="hover:text-primary-container underline" href="https://www.facebook.com/RockSportPy" target="_blank" rel="noopener">Facebook</a>
            <a class="hover:text-primary-container underline" href="https://www.tiktok.com/@rocksport.py" target="_blank" rel="noopener">TikTok</a></div></div>
      </div>
      <div class="border-t border-zinc-800 py-space-md text-center font-label-code text-label-code uppercase text-zinc-500">© 2026 Rock Sport · Diseño de ejemplo · Catálogo con datos de muestra</div>
    </footer>`;
  }
})();
