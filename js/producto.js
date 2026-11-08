(function () {
  var C = window.NEXA;
  var cont = document.getElementById('detalle');
  if (!C || !cont) return;

  var P = C.PRODUCTOS, M = C.MONEDA;
  var FONDOS = ["#2dd4f5,#1a3a7a", "#a56bff,#2a1670", "#7fe3f7,#2b5fb8", "#c79bff,#4a1f9a", "#5cc8ff,#3b2b9a", "#8a6bff,#1d4f9c"];
  var CATS = { streaming: "Streaming", ia: "Inteligencia artificial", otros: "Otros" };

  var PATHS = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="2"/><rect x="17" y="14" width="4" height="6" rx="2"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2"/>',
    ticket: '<path d="M3 9V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a3 3 0 0 0 0 6v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a3 3 0 0 0 0-6z"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    wa: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>',
    bag: '<circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 7H5.5"/><path d="M13.5 9v4M11.5 11h4"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01"/>'
  };
  function ico(name, size) {
    size = size || 20;
    var st = name === 'wa'
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" ' + st + ' aria-hidden="true">' + PATHS[name] + '</svg>';
  }
  function dinero(n) { return M + " " + n.toFixed(2); }
  function wa(texto) { return "https://wa.me/" + C.WHATSAPP + "?text=" + encodeURIComponent(texto); }
  function $(id) { return document.getElementById(id); }

  // ---- Buscar el producto por la dirección ?p=... ----
  var id = new URLSearchParams(location.search).get('p');
  var idx = -1;
  P.forEach(function (p, i) { if (p.id === id) idx = i; });

  if (idx < 0) {
    document.title = "Producto no encontrado – Nexa Store Perú";
    var rb = document.createElement('meta'); rb.name = 'robots'; rb.content = 'noindex'; document.head.appendChild(rb);
    cont.innerHTML = '<section class="pd-missing"><h1>No encontramos ese producto</h1>' +
      '<p>Puede que el enlace esté incompleto o que ya no esté disponible.</p>' +
      '<a class="btn primary big" href="index.html#catalogo">Volver al catálogo</a></section>';
    return;
  }

  var p = P[idx];
  var fondo = FONDOS[idx % FONDOS.length];
  var esPerfil = /perfil/i.test(p.tipo);
  var esCompleta = /cuenta completa/i.test(p.tipo);
  var esClave = /clave/i.test(p.tipo);
  var planes = p.planes || null;
  var planSel = planes ? planes[0] : null;
  function precioSel() { return planSel ? planSel.precio : p.precio; }
  function oldSel() { return planSel ? (planSel.old || 0) : (p.old || 0); }
  function durSel() { return planSel ? C.etiquetaMeses(planSel.meses) : (p.duracion || C.DURACION); }
  function periodoTxt() { return (esClave ? 'Licencia' : esCompleta ? 'Cuenta completa' : esPerfil ? 'Perfil' : 'Acceso') + ' · ' + durSel(); }
  function totalHtml() {
    var pr = precioSel(), od = oldSel(), ah = od ? od - pr : 0, ds = od ? Math.round((1 - pr / od) * 100) : 0;
    return '<div><span class="tot-l">Total del producto</span>' + (ah > 0 ? '<span class="save">Ahorras ' + dinero(ah) + '</span>' : '') + '</div>' +
      '<div class="tot-r"><span class="tot-v">' + dinero(pr) + '</span>' + (od ? '<span class="tot-old">' + dinero(od) + '</span>' : '') +
      (ds > 0 ? '<span class="off">-' + ds + '%</span>' : '') + '</div>';
  }
  var planesHtml = planes
    ? '<div class="bc-plans" role="group" aria-label="Elige tu periodo">' + planes.map(function (pl) {
        var ref = planes[0].precio * pl.meses, pct = ref > pl.precio ? Math.round((1 - pl.precio / ref) * 100) : 0;
        return '<button type="button" class="bc-plan" data-plan="' + pl.meses + '" aria-pressed="' + (pl === planSel) + '"><strong>' + C.etiquetaMeses(pl.meses) + '</strong><span>' + dinero(pl.precio) + '</span>' + (pct > 0 ? '<em>-' + pct + '%</em>' : '') + '</button>';
      }).join('') + '</div>'
    : '';
  var agotado = p.stock <= 0;
  var bajo = !agotado && p.stock <= C.STOCK_BAJO;

  document.title = p.nombre + " – Nexa Store Perú";

  // ---- SEO: cada producto con su dirección canónica, descripción y datos estructurados ----
  var sitio = (C.SITIO || location.origin).replace(/\/$/, '');
  var canon = sitio + '/producto.html?p=' + encodeURIComponent(p.id);
  var descSeo = p.nombre + ' (' + p.tipo + ') ' + (planes ? 'desde ' : 'a ') + dinero(p.precio) + ' en Nexa Store Perú. ' +
    (agotado ? 'Agotado por ahora. ' : '') + 'Paga con Yape o Plin y recibe tu acceso por WhatsApp.';
  function metaSet(sel, attr, val) { var m = document.head.querySelector(sel); if (m) m.setAttribute(attr, val); }
  metaSet('link[rel="canonical"]', 'href', canon);
  metaSet('meta[name="description"]', 'content', descSeo);
  metaSet('meta[property="og:title"]', 'content', p.nombre + ' – Nexa Store Perú');
  metaSet('meta[property="og:description"]', 'content', descSeo);
  metaSet('meta[property="og:url"]', 'content', canon);
  metaSet('meta[name="twitter:title"]', 'content', p.nombre + ' – Nexa Store Perú');
  metaSet('meta[name="twitter:description"]', 'content', descSeo);
  try {
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: descSeo,
      image: sitio + '/logos/' + p.img, category: CATS[p.cat], url: canon,
      offers: { '@type': 'Offer', priceCurrency: 'PEN', price: p.precio.toFixed(2), url: canon,
        availability: agotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'Nexa Store Perú' } }
    });
    document.head.appendChild(ld);
  } catch (e) {}
  if (window.nexaTrack) window.nexaTrack('view_item', { currency: 'PEN', value: p.precio, items: [{ item_id: p.id, item_name: p.nombre, item_category: p.cat, price: p.precio, quantity: 1 }] });

  var intro = esClave
    ? "Clave digital de activación, lista para usar."
    : esCompleta
    ? "Cuenta completa de uso exclusivo para ti, con todos sus perfiles."
    : esPerfil
    ? "Perfil asignado dentro de una cuenta compartida administrada por Nexa Store Perú."
    : "Acceso a " + p.nombre + " administrado por Nexa Store Perú.";
  var descripcion = esClave
    ? "Recibes una clave digital para activar " + p.nombre + " en tu equipo. Te enviamos la clave y las indicaciones de activación por WhatsApp."
    : esCompleta
    ? "Recibes una cuenta completa de " + p.nombre + ", sin compartirla con otros clientes, para que uses los perfiles que necesites. Te acompañamos por WhatsApp con las indicaciones de uso durante todo el periodo contratado."
    : esPerfil
    ? "Recibes un perfil asignado dentro de una cuenta compartida administrada por Nexa Store Perú. Te acompañamos por WhatsApp con las indicaciones de uso durante todo el periodo contratado."
    : "Recibes acceso a " + p.nombre + " mediante una cuenta compartida administrada por Nexa Store Perú. Te acompañamos por WhatsApp con las indicaciones de uso durante todo el periodo contratado.";

  // ---- Características (opcional, vienen de "caract" en config.js) ----
  var statsHtml = (p.caract && p.caract.length)
    ? '<div class="pd-stats" aria-label="Características">' + p.caract.map(function (c) {
        return '<div><b>' + c[0] + '</b><span>' + c[1] + '</span></div>';
      }).join('') + '</div>'
    : '';

  // ---- Productos relacionados ----
  var rel = P.filter(function (x) { return x !== p && x.cat === p.cat; });
  P.forEach(function (x) { if (x !== p && rel.length < 4 && rel.indexOf(x) === -1) rel.push(x); });
  rel = rel.slice(0, 4);
  var relHtml = rel.map(function (x) {
    var k = P.indexOf(x);
    return '<a class="rel-card" href="producto.html?p=' + encodeURIComponent(x.id) + '">' +
      '<span class="rel-thumb" style="background:linear-gradient(150deg,' + FONDOS[k % FONDOS.length] + ')"><img src="logos/' + x.img + '" alt="" loading="lazy" onerror="this.remove()"></span>' +
      '<span class="rel-info"><strong>' + x.nombre + '</strong><small>' + x.tipo + '</small>' + (x.stock <= 0 ? '<b class="rel-sold">Agotado</b>' : '<b>' + dinero(x.precio) + '</b>') + '</span></a>';
  }).join('');

  cont.innerHTML =
    '<div class="pd-grid">' +

    // Banner
    '<section class="pd-hero" style="background:linear-gradient(150deg,' + fondo + ')">' +
      '<img src="logos/' + p.img + '" alt="" onerror="this.remove()">' +
      '<div class="pd-hero-in">' +
        '<nav class="crumbs" aria-label="Ruta"><a href="index.html">Inicio</a><span>/</span><a href="index.html#catalogo">Catálogo</a><span>/</span><span aria-current="page">' + p.nombre + '</span></nav>' +
        (agotado ? '<span class="pd-top pd-sold">Agotado</span>' : (p.top ? '<span class="pd-top">★ TOP</span>' : '')) +
        '<h1>' + p.nombre + '</h1>' +
        '<p class="pd-lead">' + intro + '</p>' +
        '<ul class="pd-feats">' +
          '<li><span>' + ico('user') + '</span>' + p.tipo + '</li>' +
          '<li><span>' + ico('bolt') + '</span>' + C.ENTREGA + '</li>' +
          '<li><span>' + ico('clock') + '</span><em id="hero-dur" class="dur">' + durSel() + '</em></li>' +
          '<li><span>' + ico('headset') + '</span>Soporte por WhatsApp</li>' +
        '</ul>' +
      '</div>' +
    '</section>' +

    // Cómo comprar
    '<section class="pd-steps" aria-label="Cómo comprar">' +
      '<div><b>1</b><span><strong>Elige tu producto</strong><small>Revisa el detalle y el precio.</small></span></div>' +
      '<div><b>2</b><span><strong>Paga y envía tu comprobante</strong><small>Con Yape o Plin, por WhatsApp.</small></span></div>' +
      '<div><b>3</b><span><strong>Recibe tu acceso</strong><small>Confirmamos tu pago y te enviamos tus datos.</small></span></div>' +
    '</section>' +

    // Pestañas
    '<section class="pd-tabs">' +
      '<div class="pd-tablist" role="tablist">' +
        '<button type="button" role="tab" id="t-desc" aria-selected="true" aria-controls="p-desc">Descripción</button>' +
        '<button type="button" role="tab" id="t-info" aria-selected="false" aria-controls="p-info" tabindex="-1">Información importante</button>' +
      '</div>' +
      '<div class="pd-panel" role="tabpanel" id="p-desc" aria-labelledby="t-desc">' +
        '<span class="kick">Información del servicio</span>' +
        '<h2>' + p.nombre + ' · ' + p.tipo + '</h2>' +
        '<p>' + descripcion + '</p>' +
        statsHtml +
        '<div class="pd-cards">' +
          '<div><span>' + ico('user') + '</span><strong>' + (esClave ? 'Clave digital' : esCompleta ? 'Cuenta completa' : esPerfil ? 'Perfil asignado' : 'Acceso incluido') + '</strong><p>' + (esClave ? 'Recibes una clave lista para activar en tu equipo.' : esCompleta ? 'La cuenta es solo para ti: no se vende a otros clientes durante tu periodo.' : esPerfil ? 'Obtienes un perfil preparado para tu uso personal dentro de la cuenta.' : 'Obtienes acceso al servicio listo para usar, con tus indicaciones.') + '</p></div>' +
          '<div><span>' + ico('smile') + '</span><strong>Fácil de usar</strong><p>Te enviamos los datos y las indicaciones para que empieces a usarlo sin complicaciones.</p></div>' +
          '<div><span>' + ico('headset') + '</span><strong>Soporte por WhatsApp</strong><p>Si tienes algún inconveniente durante tu servicio, escríbenos y te ayudamos.</p></div>' +
        '</div>' +
      '</div>' +
      '<div class="pd-panel" role="tabpanel" id="p-info" aria-labelledby="t-info" hidden>' +
        '<span class="kick">Antes de comprar</span>' +
        '<h2>Información importante</h2>' +
        '<ul class="pd-list">' +
          '<li>' + ico('check', 18) + '<span><strong>Uso personal.</strong> ' + (esClave ? 'La clave es para un solo equipo; no la compartas ni la revendas.' : esCompleta ? 'Puedes usar los perfiles de la cuenta, pero no la compartas ni la revendas.' : 'El acceso es solo para ti; no lo compartas con otras personas.') + '</span></li>' +
          (esClave ? '<li>' + ico('check', 18) + '<span><strong>Activación.</strong> Activa la clave cuando vayas a usarla; te enviamos las indicaciones.</span></li>' : '<li>' + ico('check', 18) + '<span><strong>No modifiques la cuenta.</strong> No cambies correo, contraseña, PIN ni la configuración del acceso.</span></li>') +
          '<li>' + ico('check', 18) + '<span><strong>Duración.</strong> El servicio incluye <span id="info-dur">' + durSel() + '</span>.</span></li>' +
          '<li>' + ico('check', 18) + '<span><strong>Soporte.</strong> Ante cualquier incidencia, escríbenos por WhatsApp antes de hacer cambios.</span></li>' +
          '<li>' + ico('check', 18) + '<span><strong>Disponibilidad.</strong> El stock puede variar; confirmamos tu pedido por WhatsApp.</span></li>' +
        '</ul>' +
      '</div>' +
    '</section>' +

    // Tarjeta de compra
    '<aside class="buy-card" aria-label="Comprar ' + p.nombre + '">' +
      '<div class="bc-head">' +
        '<div class="bc-logo" style="background:linear-gradient(150deg,' + fondo + ')"><img src="logos/' + p.img + '" alt="" onerror="this.remove()"></div>' +
        '<div><div class="bc-name">' + p.nombre + '</div><div class="bc-sub">' + CATS[p.cat] + ' · ' + p.tipo + '</div></div>' +
      '</div>' +
      '<div class="bc-label">Tu plan</div>' + planesHtml +
      '<div class="bc-period"><span>' + ico('cal') + '</span><div><small>Periodo elegido</small><strong id="bc-per">' + periodoTxt() + '</strong></div></div>' +
      (agotado ? '' : '<details class="bc-code">' +
        '<summary><span>' + ico('ticket', 18) + 'Código de descuento o regalo</span>' + ico('chev', 18) + '</summary>' +
        '<input type="text" id="codigo" placeholder="Escribe tu código" autocomplete="off" aria-label="Código de descuento o regalo">' +
        '<small>Lo validamos por WhatsApp al confirmar tu pedido.</small>' +
      '</details>') +
      '<div class="bc-total" id="bc-total">' + totalHtml() + '</div>' +
      '<div class="stock' + (agotado ? ' out' : bajo ? ' low' : '') + '"><i></i>' + (agotado ? 'Agotado por ahora' : bajo ? 'Quedan solo ' + p.stock + (esCompleta ? ' cuentas' : ' accesos') : p.stock + (esCompleta ? ' cuentas disponibles' : ' accesos disponibles')) + '</div>' +
      (agotado
        ? '<div class="bc-actions"><a id="avisar" class="btn primary big" href="' + wa('Hola, quiero que me avisen cuando haya stock de ' + p.nombre + ' (' + p.tipo + ').') + '" target="_blank" rel="noopener"><img class="wa-ico" src="logos/icon-whatsapp.png" alt="" width="24" height="24" onerror="this.remove()">Avisarme cuando haya stock</a>' +
          '<button type="button" id="compartir" class="bc-share" aria-label="Compartir este producto">' + ico('share', 20) + '</button></div>' +
          '<p class="bc-note">Escríbenos y te avisamos cuando vuelva a haber stock.</p>'
        :       '<a id="pagar" class="btn primary big bc-main" href="pago.html?p=' + encodeURIComponent(p.id) + (planSel ? '&plan=' + planSel.meses : '') + '">' + ico('bolt', 20) + 'Pagar ahora</a>' +
      '<button type="button" id="agregar" class="btn ghost bc-add">' + ico('bag', 20) + 'Agregar al carrito</button>' +
      '<div class="bc-actions">' +
        '<a id="comprar" class="btn ghost big" href="#" target="_blank" rel="noopener"><img class="wa-ico" src="logos/icon-whatsapp-blanco.png" alt="" width="24" height="24" onerror="this.remove()">Consultar por WhatsApp</a>' +
        '<button type="button" id="compartir" class="bc-share" aria-label="Compartir este producto">' + ico('share', 20) + '</button>' +
      '</div>' +
      '<p class="bc-note">¿Tienes dudas? Escríbenos antes de pagar y te ayudamos.</p>') +
      (C.chipsPago && C.chipsPago() ? '<div class="bc-pay"><span class="bc-label">Medios de pago</span><div class="pay-list">' + C.chipsPago() + '</div><small>Verás los datos de pago al pulsar «Pagar ahora».</small></div>' : '') +
    '</aside>' +

    '</div>' +

    '<section class="pd-rel"><h2>También te puede interesar</h2><div class="rel-grid">' + relHtml + '</div></section>' +
    '<div class="toast" id="toast" role="status" aria-live="polite"></div>';

  var alCambiarPlan = function () {};
  if (planes) {
    cont.addEventListener('click', function (e) {
      var b = e.target.closest('[data-plan]');
      if (!b) return;
      planSel = planes.filter(function (pl) { return pl.meses === parseInt(b.dataset.plan, 10); })[0] || planSel;
      cont.querySelectorAll('[data-plan]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $('bc-total').innerHTML = totalHtml();
      $('bc-per').textContent = periodoTxt();
      var hd = $('hero-dur'); if (hd) hd.textContent = durSel();
      var inf = $('info-dur'); if (inf) inf.textContent = durSel();
      alCambiarPlan();
    });
  }

  if (!agotado) {
    // ---- Comprar: el mensaje incluye el código si lo escribe ----
    var comprar = $('comprar'), codigo = $('codigo');
    function actualizar() {
      var cod = codigo.value.trim();
      var msg = "Hola, tengo una consulta sobre " + p.nombre + (planSel ? " – " + C.etiquetaMeses(planSel.meses) : "") + " (" + p.tipo + ") de " + dinero(precioSel()) + "." +
        (cod ? " Código de descuento: " + cod + "." : "");
      comprar.href = wa(msg);
    }
    codigo.addEventListener('input', actualizar);
    actualizar();
    alCambiarPlan = function () {
      $('pagar').href = 'pago.html?p=' + encodeURIComponent(p.id) + (planSel ? '&plan=' + planSel.meses : '');
      actualizar();
    };

    // ---- Pagar ahora: lleva el código escrito a la página de pago ----
    $('pagar').addEventListener('click', function () {
      try { sessionStorage.setItem('nexa_codigo', codigo.value.trim()); } catch (e) {}
    });

    // ---- Agregar al carrito ----
    $('agregar').addEventListener('click', function () {
      if (window.CARRITO) window.CARRITO.add(p.id, 1, planSel ? planSel.meses : 0);
    });
  }

  // ---- Pestañas ----
  var tabs = [$('t-desc'), $('t-info')], panels = [$('p-desc'), $('p-info')];
  function abrir(n) {
    tabs.forEach(function (t, i) {
      t.setAttribute('aria-selected', String(i === n));
      t.tabIndex = i === n ? 0 : -1;
      panels[i].hidden = i !== n;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { abrir(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var n = (i + 1) % 2;
        abrir(n); tabs[n].focus();
      }
    });
  });

  // ---- Compartir ----
  var toastEl = $('toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }
  $('compartir').addEventListener('click', function () {
    var url = location.href;
    if (navigator.share) {
      navigator.share({ title: p.nombre + " – Nexa Store Perú", url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { toast('Enlace copiado'); }, function () { toast('No se pudo copiar el enlace'); });
    } else {
      toast('Copia el enlace desde la barra del navegador');
    }
  });
})();