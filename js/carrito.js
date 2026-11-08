/* Carrito de Nexa Store Perú: se guarda en el navegador y se comparte entre las páginas */
(function () {
  var C = window.NEXA;
  if (!C) return;

  var P = C.PRODUCTOS, M = C.MONEDA, KEY = 'nexa_carrito';
  var FONDOS = ["#2dd4f5,#1a3a7a", "#a56bff,#2a1670", "#7fe3f7,#2b5fb8", "#c79bff,#4a1f9a", "#5cc8ff,#3b2b9a", "#8a6bff,#1d4f9c"];
  var items = [];          // [{ id, qty }]
  var ultimoFoco = null;
  var cierre, toastT;
  var oyentes = [];

  function dinero(n) { return M + " " + n.toFixed(2); }
  function prod(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }
  function fondo(p) { return FONDOS[P.indexOf(p) % FONDOS.length]; }
  // Una línea del carrito se identifica por producto + periodo (plan)
  function clave(id, plan) { return id + (plan ? '|' + plan : ''); }
  function buscar(key) { for (var i = 0; i < items.length; i++) if (clave(items[i].id, items[i].plan) === key) return items[i]; return null; }
  function precioLinea(x) { return C.precioDe(prod(x.id), x.plan); }
  function nombreLinea(x) { var p = prod(x.id); return p.nombre + (x.plan ? ' · ' + C.etiquetaMeses(x.plan) : ''); }
  function enCarrito(id) { return items.reduce(function (s, x) { return s + (x.id === id ? x.qty : 0); }, 0); }

  // ---- Guardar y cargar ----
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function cargar() {
    var crudo = [];
    try { crudo = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
    items = [];
    (Array.isArray(crudo) ? crudo : []).forEach(function (x) {
      var p = x && prod(x.id);
      if (p && p.stock > 0) items.push({ id: p.id, plan: p.planes ? C.planDe(p, x.plan).meses : 0, qty: Math.max(1, Math.min(parseInt(x.qty, 10) || 1, p.stock)) });
    });
  }

  function cantidad() { return items.reduce(function (s, x) { return s + x.qty; }, 0); }
  function total() { return items.reduce(function (s, x) { return s + precioLinea(x) * x.qty; }, 0); }
  function ahorro() {
    return items.reduce(function (s, x) { var o = C.oldDe(prod(x.id), x.plan); return s + (o ? (o - precioLinea(x)) * x.qty : 0); }, 0);
  }

  // ---- Estructura del panel ----
  var CERRAR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var BASURA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
  var BOLSA = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 7H5.5"/></svg>';
  var WA = '<img class="wa-ico" src="logos/icon-whatsapp-blanco.png" alt="" width="24" height="24" onerror="this.remove()">';

  var overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.hidden = true;
  var drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.hidden = true;
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-labelledby', 'cart-title');
  drawer.innerHTML =
    '<div class="cd-head"><h2 id="cart-title">Tu carrito</h2><button type="button" class="cd-close" aria-label="Cerrar carrito">' + CERRAR + '</button></div>' +
    '<div class="cd-body" id="cd-body"></div>' +
    '<div class="cd-foot" id="cd-foot"></div>';
  var toastEl = document.createElement('div');
  toastEl.className = 'toast cart-toast';
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.body.appendChild(toastEl);

  var body = drawer.querySelector('#cd-body');
  var foot = drawer.querySelector('#cd-foot');

  // ---- Mensaje de WhatsApp ----
  function mensaje() {
    var lineas = items.map(function (x, i) {
      var p = prod(x.id);
      return (i + 1) + ". " + nombreLinea(x) + " (" + p.tipo + ") x" + x.qty + " - " + dinero(precioLinea(x) * x.qty);
    });
    var cod = foot.querySelector('#cd-codigo');
    cod = cod ? cod.value.trim() : '';
    return "Hola, quiero hacer este pedido en Nexa Store Perú:\n\n" + lineas.join("\n") +
      "\n\nTotal: " + dinero(total()) + (cod ? "\nCódigo de descuento: " + cod : "");
  }
  function actualizarEnlace() {
    var a = foot.querySelector('#cd-enviar');
    if (a) a.href = "https://wa.me/" + C.WHATSAPP + "?text=" + encodeURIComponent(mensaje());
  }

  // Al redibujar el panel el botón enfocado desaparece: se anota cuál era para devolverle el foco
  function anotarFoco() {
    var a = document.activeElement;
    if (!a || drawer.hidden || !drawer.contains(a)) return null;
    var li = a.closest && a.closest('.ci');
    if (!li) return null;
    return { key: li.dataset.key, q: a.getAttribute('data-q'), del: a.hasAttribute('data-del') };
  }
  function devolverFoco(m) {
    if (!m) return;
    var lis = body.querySelectorAll('.ci'), li = null, t = null;
    for (var i = 0; i < lis.length; i++) if (lis[i].dataset.key === m.key) li = lis[i];
    if (li) t = m.q ? li.querySelector('[data-q="' + m.q + '"]') : (m.del ? li.querySelector('[data-del]') : null);
    if (!t) t = body.querySelector('.ci-del') || drawer.querySelector('.cd-close');
    if (t) t.focus();
  }

  // ---- Dibujar ----
  function pintar() {
    var n = cantidad();
    var foco = anotarFoco();
    oyentes.forEach(function (fn) { try { fn(); } catch (e) {} });

    document.querySelectorAll('[data-carrito] .cart-count').forEach(function (b) {
      b.textContent = n > 99 ? '99+' : n;
      b.hidden = n === 0;
    });
    document.querySelectorAll('[data-carrito]').forEach(function (b) {
      b.setAttribute('aria-label', n ? 'Abrir carrito, ' + n + (n === 1 ? ' producto' : ' productos') : 'Abrir carrito');
    });
    drawer.querySelector('#cart-title').textContent = n ? 'Tu carrito (' + n + ')' : 'Tu carrito';

    if (!items.length) {
      body.innerHTML = '<div class="cd-empty">' + BOLSA + '<strong>Tu carrito está vacío</strong><p>Agrega los productos que quieras y envía todo en un solo mensaje por WhatsApp.</p><a class="btn primary" href="index.html#catalogo" data-cerrar>Ver catálogo</a></div>';
      foot.innerHTML = '';
      foot.hidden = true;
      devolverFoco(foco);
      return;
    }

    body.innerHTML = '<ul class="cd-list">' + items.map(function (x) {
      var p = prod(x.id);
      return '<li class="ci" data-key="' + clave(x.id, x.plan) + '">' +
        '<a class="ci-thumb" href="producto.html?p=' + encodeURIComponent(p.id) + '" style="background:linear-gradient(150deg,' + fondo(p) + ')"><img src="logos/' + p.img + '" alt="" onerror="this.remove()"></a>' +
        '<div class="ci-info"><strong>' + p.nombre + '</strong><small>' + p.tipo + ' · ' + C.duracionDe(p, x.plan) + '</small>' +
          '<div class="ci-row"><div class="ci-qty">' +
            '<button type="button" data-q="-1" aria-label="Quitar una unidad de ' + p.nombre + '">−</button>' +
            '<span aria-label="Cantidad">' + x.qty + '</span>' +
            '<button type="button" data-q="1" aria-label="Agregar una unidad de ' + p.nombre + '">+</button>' +
          '</div><b>' + dinero(precioLinea(x) * x.qty) + '</b></div></div>' +
        '<button type="button" class="ci-del" data-del aria-label="Eliminar ' + p.nombre + ' del carrito">' + BASURA + '</button>' +
      '</li>';
    }).join('') + '</ul>';

    var chips = C.chipsPago ? C.chipsPago() : '';
    var ah = ahorro();
    var codigoPrevio = foot.querySelector('#cd-codigo') ? foot.querySelector('#cd-codigo').value : '';
    foot.hidden = false;
    foot.innerHTML =
      '<details class="bc-code"' + (codigoPrevio ? ' open' : '') + '><summary><span>Código de descuento o regalo</span></summary>' +
        '<input type="text" id="cd-codigo" placeholder="Escribe tu código" autocomplete="off" aria-label="Código de descuento o regalo">' +
        '<small>Lo validamos por WhatsApp al confirmar tu pedido.</small></details>' +
      '<div class="cd-total"><div><span>Total</span>' + (ah > 0 ? '<em>Ahorras ' + dinero(ah) + '</em>' : '') + '</div><strong>' + dinero(total()) + '</strong></div>' +
      '<a id="cd-pagar" class="btn primary big" href="pago.html">Continuar al pago</a>' +
      '<a id="cd-enviar" class="btn ghost big" href="#" target="_blank" rel="noopener">' + WA + 'Pedir por WhatsApp</a>' +
      (chips ? '<div class="cd-pay"><small>Medios de pago</small><div class="pay-list">' + chips + '</div></div>' : '') +
      '<button type="button" class="cd-clear" data-vaciar>Vaciar carrito</button>';
    foot.querySelector('#cd-codigo').value = codigoPrevio;
    foot.querySelector('#cd-codigo').addEventListener('input', actualizarEnlace);
    actualizarEnlace();
    devolverFoco(foco);
  }

  // ---- Aviso ----
  function aviso(texto, conVer) {
    toastEl.innerHTML = '<span></span>' + (conVer ? '<button type="button" data-ver>Ver carrito</button>' : '');
    toastEl.firstChild.textContent = texto;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }
  toastEl.addEventListener('click', function (e) {
    if (e.target.closest('[data-ver]')) { toastEl.classList.remove('show'); abrir(); }
  });

  // ---- Acciones ----
  function agregar(id, qty, plan) {
    var p = prod(id);
    if (!p) return;
    if (p.stock <= 0) { aviso(p.nombre + ' está agotado por ahora', false); return; }
    plan = p.planes ? C.planDe(p, plan).meses : 0;
    var libre = p.stock - enCarrito(id);
    if (libre <= 0) { aviso('Ya agregaste todo el stock disponible de ' + p.nombre, true); return; }
    qty = Math.min(qty || 1, libre);
    var x = buscar(clave(id, plan));
    if (x) x.qty += qty; else items.push({ id: id, plan: plan, qty: qty });
    guardar(); pintar();
    aviso(p.nombre + (plan ? ' (' + C.etiquetaMeses(plan) + ')' : '') + ' agregado al carrito', true);
    if (window.nexaTrack) window.nexaTrack('add_to_cart', { currency: 'PEN', value: C.precioDe(p, plan), items: [{ item_id: p.id, item_name: p.nombre, item_category: p.cat, price: C.precioDe(p, plan), quantity: 1 }] });
    document.querySelectorAll('[data-carrito]').forEach(function (b) {
      b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    });
  }
  function cambiar(key, delta) {
    var x = buscar(key);
    if (!x) return;
    var p = prod(x.id), nueva = x.qty + delta;
    if (nueva < 1) return quitar(key);
    if (delta > 0 && enCarrito(x.id) + delta > p.stock) { aviso('Solo hay ' + p.stock + ' disponibles de ' + p.nombre, false); return; }
    x.qty = nueva;
    guardar(); pintar();
  }
  function quitar(key) {
    items = items.filter(function (i) { return clave(i.id, i.plan) !== key; });
    guardar(); pintar();
  }
  function vaciar() { items = []; guardar(); pintar(); }

  // ---- Abrir y cerrar ----
  function abrir() {
    clearTimeout(cierre);
    ultimoFoco = document.activeElement;
    overlay.hidden = false;
    drawer.hidden = false;
    document.documentElement.classList.add('cart-open');
    void drawer.offsetWidth;   // fuerza el cálculo para que la animación se vea
    overlay.classList.add('open');
    drawer.classList.add('open');
    drawer.querySelector('.cd-close').focus();
  }
  function cerrar() {
    if (drawer.hidden) return;
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.documentElement.classList.remove('cart-open');
    cierre = setTimeout(function () { overlay.hidden = true; drawer.hidden = true; }, 300);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  drawer.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('.cd-close') || t.closest('[data-cerrar]')) return cerrar();
    var li = t.closest('.ci');
    var q = t.closest('[data-q]');
    if (q && li) return cambiar(li.dataset.key, parseInt(q.dataset.q, 10));
    if (t.closest('[data-del]') && li) return quitar(li.dataset.key);
    if (t.closest('[data-vaciar]')) return vaciar();
    if (t.closest('#cd-pagar')) {
      var cd = foot.querySelector('#cd-codigo');
      try { sessionStorage.setItem('nexa_codigo', cd ? cd.value.trim() : ''); } catch (er) {}
    }
    if (t.closest('a.ci-thumb')) return cerrar();
  });
  overlay.addEventListener('click', cerrar);
  document.addEventListener('keydown', function (e) {
    if (drawer.hidden) return;
    if (e.key === 'Escape') return cerrar();
    if (e.key === 'Tab') {
      var f = drawer.querySelectorAll('button, a[href], input, summary');
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  document.querySelectorAll('[data-carrito]').forEach(function (b) { b.addEventListener('click', abrir); });

  // Si se cambia el carrito en otra pestaña, se actualiza aquí
  window.addEventListener('storage', function (e) { if (e.key === KEY) { cargar(); pintar(); } });

  cargar();
  pintar();
  window.CARRITO = {
    add: agregar, open: abrir, close: cerrar, count: cantidad,
    items: function () { return items.map(function (x) { return { id: x.id, plan: x.plan, qty: x.qty }; }); },
    onChange: function (fn) { oyentes.push(fn); }
  };
})();