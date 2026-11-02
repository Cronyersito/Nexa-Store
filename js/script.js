(function () {
  // La configuración (productos, precios, WhatsApp, etc.) está en config.js
  var C = window.NEXA;
  var WHATSAPP = C.WHATSAPP, MONEDA = C.MONEDA, CORREO = C.CORREO, REDES = C.REDES;
  var PRODUCTOS = C.PRODUCTOS, ENTREGA = C.ENTREGA, DURACION = C.DURACION, STOCK_BAJO = C.STOCK_BAJO;

  var NOMBRES_REDES = { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook" };
  var SOC = {
    instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    tiktok: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3v2a4 4 0 0 0 4 4v3a7 7 0 0 1-4-1.3V15a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V3h3z"/></svg>',
    facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>'
  };
  var CATEGORIAS = { streaming: "Streaming", ia: "IA", otros: "Otros" };
  var FONDOS = ["#2dd4f5,#1a3a7a", "#a56bff,#2a1670", "#7fe3f7,#2b5fb8", "#c79bff,#4a1f9a", "#5cc8ff,#3b2b9a", "#8a6bff,#1d4f9c"];
  var I = {
    star: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 7 7 .6-5.4 4.6 1.7 7.1L12 17.7 5.7 21.3l1.7-7.1L2 9.6 9 9z"/></svg>',
    bolt: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
    clock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    bagplus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 7H5.5"/><path d="M13.5 9v4M11.5 11h4"/></svg>',
    chat: '<img class="wa-ico" src="logos/icon-whatsapp.png" alt="" width="24" height="24">'
  };

  function dinero(n) { return MONEDA + " " + n.toFixed(2); }
  function waLink(texto) {
    return "https://wa.me/" + WHATSAPP + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }

  function tarjeta(p, i) {
    var descuento = p.old ? Math.round((1 - p.precio / p.old) * 100) : 0;
    var agotado = p.stock <= 0;
    var bajo = !agotado && p.stock <= STOCK_BAJO;
    var url = "producto.html?p=" + encodeURIComponent(p.id);
    return '<article class="product' + (agotado ? ' agotado' : '') + '" data-cat="' + p.cat + '">' +
      '<div class="p-media" style="background:linear-gradient(150deg,' + FONDOS[i % FONDOS.length] + ')">' +
        '<img src="logos/' + p.img + '" alt="' + p.nombre + '" loading="lazy" onerror="nexaImg(this)">' +
        (p.top ? '<span class="badge top">' + I.star + 'TOP</span>' : '') +
        '<span class="badge cat">' + CATEGORIAS[p.cat] + '</span>' +
        (agotado ? '<span class="badge sold">Agotado</span>' : '') +
      '</div>' +
      '<div class="p-body">' +
        '<div><h3 class="p-name">' + p.nombre + '</h3><div class="p-type">' + p.tipo + '</div></div>' +
        '<div class="chips"><span class="chip">' + I.bolt + ENTREGA + '</span><span class="chip">' + I.clock + (p.planes ? 'Desde ' + C.etiquetaMeses(p.planes[0].meses) : (p.duracion || DURACION)) + '</span></div>' +
        '<div class="price-row">' + (p.planes ? '<span class="desde">Desde</span>' : '') + '<span class="price">' + dinero(p.precio) + '</span>' +
          (p.old ? '<span class="old">' + dinero(p.old) + '</span>' : '') +
          (descuento > 0 ? '<span class="off">-' + descuento + '%</span>' : '') + '</div>' +
        '<div class="stock' + (agotado ? ' out' : bajo ? ' low' : '') + '"><i></i>' + (agotado ? 'Agotado' : bajo ? 'Quedan ' + p.stock : 'En stock') + '</div>' +
        '<div class="p-actions"><a class="buy" href="' + url + '" aria-label="Ver detalles de ' + p.nombre + '">Ver detalles' + I.arrow + '</a>' +
          '<button type="button" class="add" data-add="' + p.id + '"' + (agotado ? ' disabled' : '') + ' aria-label="' + (agotado ? p.nombre + ' agotado' : 'Agregar ' + p.nombre + ' al carrito') + '">' + I.bagplus + '</button></div>' +
      '</div></article>';
  }

  // ---- Catálogo: filtros y búsqueda ----
  var lista = document.getElementById('productos');
  var vacio = document.getElementById('vacio');
  var buscar = document.getElementById('buscar');
  var tabs = document.querySelectorAll('.tab');
  var filtro = 'all';

  var orden = document.getElementById('orden');
  function descuentoDe(p) { return p.old ? 1 - p.precio / p.old : 0; }
  var ORDENES = {
    recomendado: function (a, b) { return a.i - b.i; },
    menor: function (a, b) { return a.p.precio - b.p.precio || a.i - b.i; },
    mayor: function (a, b) { return b.p.precio - a.p.precio || a.i - b.i; },
    descuento: function (a, b) { return descuentoDe(b.p) - descuentoDe(a.p) || a.i - b.i; }
  };

  function pintar() {
    var q = buscar.value.trim().toLowerCase();
    var modo = orden && ORDENES[orden.value] ? orden.value : 'recomendado';
    var html = PRODUCTOS.map(function (p, i) { return { p: p, i: i }; })
      .filter(function (x) {
        return (filtro === 'all' || x.p.cat === filtro) && x.p.nombre.toLowerCase().indexOf(q) !== -1;
      })
      // los agotados siempre van al final
      .sort(function (a, b) {
        return ((a.p.stock <= 0 ? 1 : 0) - (b.p.stock <= 0 ? 1 : 0)) || ORDENES[modo](a, b);
      })
      .map(function (x) { return tarjeta(x.p, x.i); }).join('');
    lista.innerHTML = html;
    vacio.hidden = html !== '';
  }
  if (lista && buscar) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filtro = tab.dataset.filter;
        tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === tab)); });
        pintar();
      });
    });
    buscar.addEventListener('input', pintar);
    if (orden) orden.addEventListener('change', pintar);
    lista.addEventListener('click', function (e) {
      var b = e.target.closest('[data-add]');
      if (b && window.CARRITO) window.CARRITO.add(b.dataset.add);
    });
    pintar();
  }

  // Enlaces generales de WhatsApp (hero y pie)
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink("Hola, quiero información sobre sus productos.");
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', function () {
      if (window.nexaTrack) window.nexaTrack('whatsapp_click', { lugar: a.closest('footer') ? 'pie' : (a.closest('.hero') ? 'inicio' : 'pagina') });
    });
  });

  // ---- Pie de página ----
  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  var fWa = document.getElementById('f-wa-num');
  if (fWa && /^\d{8,15}$/.test(WHATSAPP)) {
    fWa.parentNode.hidden = false;
  }
  var fCorreo = document.getElementById('f-correo');
  if (fCorreo && CORREO) {
    var ca = fCorreo.querySelector('a');
    ca.href = 'mailto:' + CORREO;
    ca.textContent = CORREO;
    fCorreo.hidden = false;
  }
  var redes = document.getElementById('redes');
  if (redes) {
    var rh = '';
    Object.keys(REDES).forEach(function (k) {
      if (REDES[k]) rh += '<a href="' + REDES[k] + '" target="_blank" rel="noopener" aria-label="' + NOMBRES_REDES[k] + '">' + SOC[k] + '</a>';
    });
    redes.innerHTML = rh;
    redes.hidden = rh === '';
  }

  document.querySelectorAll('[data-pagos]').forEach(function (el) {
    var chips = C.chipsPago ? C.chipsPago() : '';
    el.innerHTML = chips;
    el.parentNode.hidden = chips === '';
  });

  // ---- Banner de oferta de la semana ----
  function fechaLimite(txt) {
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?$/.exec(String(txt || '').trim());
    if (!m) return null;
    return m[4] ? new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5], 0)
                : new Date(+m[1], m[2] - 1, +m[3], 23, 59, 59);
  }
  // ---- Carrusel de banners (config.js → BANNERS) ----
  function construirBanners(el) {
    var lista = (C.BANNERS || []).map(function (b) {
      var ps = (b.productos || []).map(function (id) {
        for (var i = 0; i < PRODUCTOS.length; i++) if (PRODUCTOS[i].id === id) return PRODUCTOS[i];
        return null;
      }).filter(function (p) { return p && p.stock > 0; });
      var fin = fechaLimite(b.hasta);
      if (fin && fin.getTime() <= Date.now()) return null;
      if (b.productos && b.productos.length && !ps.length) return null;
      var desde = ps.length ? Math.min.apply(null, ps.map(function (p) { return p.precio; })) : 0;
      return { b: b, desde: desde };
    }).filter(Boolean);
    if (!lista.length) return false;

    var total = lista.length, slides = '', puntos = '';
    // posición de cada banner respecto al activo (-2..2), para que el carrusel avance deslizando y dé la vuelta sin saltos
    function pos(i, act) { var m = Math.floor(total / 2); return ((i - act + total + m) % total) - m; }
    lista.forEach(function (x, i) {
      var b = x.b;
      slides += '<div class="bn' + (i === 0 ? ' on' : '') + '" role="group" aria-roledescription="diapositiva" aria-label="' + (i + 1) + ' de ' + total + '" style="transform:translateX(' + (pos(i, 0) * 100) + '%)"' + (i === 0 ? '' : ' aria-hidden="true" inert') + '>' +
        '<img class="bn-img" src="logos/' + b.img + '" alt="" ' + (i === 0 ? '' : 'loading="lazy" ') + 'onerror="nexaImg(this)">' +
        '<div class="bn-copy">' +
          '<span class="offer-kick">' + (b.etiqueta || '') + '</span>' +
          '<h2>' + (b.titulo || '') + '</h2>' +
          (b.texto ? '<p>' + b.texto + '</p>' : '') +
          (x.desde ? '<div class="bn-price">Desde <b>' + dinero(x.desde) + '</b></div>' : '') +
          '<a class="btn primary big" href="#catalogo" data-bn="' + i + '">' + (b.boton || 'Ver catálogo') + I.arrow + '</a>' +
        '</div></div>';
      puntos += '<button type="button" class="bn-dot" data-i="' + i + '" aria-label="Ir al banner ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>';
    });
    var FLECHA = function (d) { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    el.innerHTML = '<div class="bnr" role="region" aria-roledescription="carrusel" aria-label="Destacados de Nexa Store Perú">' +
      '<div class="bn-track">' + slides + '</div>' +
      (total > 1 ? '<button type="button" class="bn-nav prev" aria-label="Banner anterior">' + FLECHA('M15 5l-7 7 7 7') + '</button>' +
        '<button type="button" class="bn-nav next" aria-label="Banner siguiente">' + FLECHA('M9 5l7 7-7 7') + '</button>' +
        '<div class="bn-dots">' + puntos + '</div>' : '') +
      '</div>';
    el.hidden = false;

    var cont = el.querySelector('.bnr');
    var hojas = el.querySelectorAll('.bn');
    var dots = el.querySelectorAll('.bn-dot');
    var idx = 0, reloj = null;
    var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function ir(n) {
      idx = (n + total) % total;
      hojas.forEach(function (h, i) {
        var o = pos(i, idx), antes = h._o === undefined ? o : h._o;
        h.style.transition = Math.abs(o - antes) > 1 ? 'none' : '';   // los que dan la vuelta por detrás no se ven cruzar
        h.style.transform = 'translateX(' + (o * 100) + '%)';
        h._o = o;
        h.classList.toggle('on', i === idx);
        h.inert = i !== idx;
        if (i === idx) h.removeAttribute('aria-hidden'); else h.setAttribute('aria-hidden', 'true');
      });
      dots.forEach(function (d, i) { if (i === idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    }
    function parar() { clearInterval(reloj); reloj = null; }
    function auto() { parar(); if (total > 1 && !document.hidden) reloj = setInterval(function () { ir(idx + 1); }, (parseFloat(C.BANNERS_SEGUNDOS) || 5) * 1000); }

    if (total > 1) {
      cont.addEventListener('mouseenter', parar);
      cont.addEventListener('mouseleave', auto);
      // solo se pausa si alguien navega con el teclado; tocar un punto o una flecha con el mouse o el dedo no lo detiene
      cont.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches(':focus-visible')) parar(); });
      cont.addEventListener('focusout', auto);
      document.addEventListener('visibilitychange', function () { if (document.hidden) parar(); else auto(); });
      var x0 = null;
      cont.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; parar(); }, { passive: true });
      cont.addEventListener('touchend', function (e) {
        if (x0 !== null) { var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) ir(idx + (dx < 0 ? 1 : -1)); }
        x0 = null; auto();
      });
      cont.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') ir(idx - 1);
        else if (e.key === 'ArrowRight') ir(idx + 1);
      });
      auto();
    }

    el.addEventListener('click', function (e) {
      var n = e.target.closest('.bn-nav'), d = e.target.closest('.bn-dot'), a = e.target.closest('[data-bn]');
      if (n) ir(idx + (n.classList.contains('next') ? 1 : -1));
      else if (d) ir(parseInt(d.dataset.i, 10));
      else if (a) {
        var b = lista[parseInt(a.dataset.bn, 10)].b;
        var f = b.filtro || 'all';
        tabs.forEach(function (t) { if (t.dataset.filter === f) t.click(); });
        if (buscar) { buscar.value = b.buscar || ''; buscar.dispatchEvent(new Event('input')); }
        if (window.nexaTrack) window.nexaTrack('banner_click', { banner: b.titulo });
      }
    });
    return true;
  }

  var banner = document.getElementById('oferta');
  var OF = C.OFERTA;
  var hayBanners = banner ? construirBanners(banner) : false;
  if (banner && !hayBanners && OF && OF.activa) {
    var po = null;
    PRODUCTOS.forEach(function (x) { if (x.id === OF.producto) po = x; });
    var fin = fechaLimite(OF.hasta);
    var vigente = !fin || fin.getTime() > Date.now();
    if (po && po.stock > 0 && vigente) {
      var pd = descuentoDe(po) > 0 ? Math.round(descuentoDe(po) * 100) : 0;
      var texto = OF.texto || (po.tipo + ' · ' + DURACION + (po.old ? '. Antes ' + dinero(po.old) + ': ahorras ' + dinero(po.old - po.precio) + '.' : '.'));
      var k = PRODUCTOS.indexOf(po);
      banner.innerHTML =
        '<div class="offer-card">' +
          '<div class="offer-copy">' +
            '<span class="offer-kick">' + I.star + (OF.titulo || 'Oferta de la semana') + '</span>' +
            '<h2>' + po.nombre + ' a ' + dinero(po.precio) + '</h2>' +
            '<p>' + texto + '</p>' +
            (fin ? '<div class="offer-count" aria-hidden="true"><span class="oc-label">Termina en</span>' +
              '<div><b data-oc="d">00</b><small>días</small></div><div><b data-oc="h">00</b><small>horas</small></div>' +
              '<div><b data-oc="m">00</b><small>min</small></div><div><b data-oc="s">00</b><small>seg</small></div></div>' +
              '<span class="sr-only">La oferta termina el ' + fin.toLocaleDateString('es-PE') + '.</span>' : '') +
            '<a class="btn primary big" href="producto.html?p=' + encodeURIComponent(po.id) + '">Ver oferta' + I.arrow + '</a>' +
          '</div>' +
          '<div class="offer-media" style="background:linear-gradient(150deg,' + FONDOS[k % FONDOS.length] + ')">' +
            '<img src="logos/' + po.img + '" alt="" onerror="nexaImg(this)">' +
            (pd > 0 ? '<span class="offer-off">-' + pd + '%</span>' : '') +
          '</div>' +
        '</div>';
      banner.hidden = false;

      if (fin) {
        var cuenta = {};
        ['d', 'h', 'm', 's'].forEach(function (u) { cuenta[u] = banner.querySelector('[data-oc="' + u + '"]'); });
        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        var tic = function () {
          var ms = fin.getTime() - Date.now();
          if (ms <= 0) { banner.hidden = true; clearInterval(reloj); return; }
          var t = Math.floor(ms / 1000);
          cuenta.d.textContent = pad(Math.floor(t / 86400));
          cuenta.h.textContent = pad(Math.floor(t % 86400 / 3600));
          cuenta.m.textContent = pad(Math.floor(t % 3600 / 60));
          cuenta.s.textContent = pad(t % 60);
        };
        var reloj = setInterval(tic, 1000);
        tic();
      }
    }
  }

  // ---- Galería del hero: se mueve un poco con el mouse ----
  var hero = document.querySelector('.hero');
  var gallery = document.querySelector('.gallery');
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && gallery && !quieto) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      gallery.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      gallery.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    hero.addEventListener('mouseleave', function () {
      gallery.style.setProperty('--mx', 0);
      gallery.style.setProperty('--my', 0);
    });
  }

  // ---- Menú y encabezado ----
  var header = document.querySelector('header');
  var nav = document.getElementById('menu');
  var btn = document.querySelector('.menu-btn');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    setMenu(false);
    nav.querySelectorAll('a').forEach(function (a) { a.classList.remove('active'); });
    link.classList.add('active');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();