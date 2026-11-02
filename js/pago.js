/* Página de pago de Nexa Store Perú */
(function () {
  var C = window.NEXA;
  var cont = document.getElementById('pago');
  if (!C || !cont) return;

  var P = C.PRODUCTOS, M = C.MONEDA, PG = C.PAGO || {};
  var METODOS = C.METODOS_PAGO || [];
  var FONDOS = ["#2dd4f5,#1a3a7a", "#a56bff,#2a1670", "#7fe3f7,#2b5fb8", "#c79bff,#4a1f9a", "#5cc8ff,#3b2b9a", "#8a6bff,#1d4f9c"];
  var qs = new URLSearchParams(location.search);
  var soloId = qs.get('p');   // pago directo de un solo producto
  var soloPlan = qs.get('plan');
  var metodoId = METODOS.length ? METODOS[0].id : null;
  var toastEl, toastT;
  var trackeado = false;

  // Registrar un evento de analítica con los productos del pedido
  function track(ev, extra) {
    if (!window.nexaTrack) return;
    var ls = lineas();
    var datos = {
      currency: 'PEN', value: Number(total(ls).toFixed(2)),
      items: ls.map(function (x) { var p = prod(x.id); return { item_id: p.id, item_name: p.nombre, item_category: p.cat, price: C.precioDe(p, x.plan), quantity: x.qty }; })
    };
    for (var k in (extra || {})) datos[k] = extra[k];
    window.nexaTrack(ev, datos);
  }

  function dinero(n) { return M + " " + n.toFixed(2); }
  function nombreLinea(x) { var p = prod(x.id); return p.nombre + (x.plan ? ' · ' + C.etiquetaMeses(x.plan) : ''); }
  function prod(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }
  function wa(texto) { return "https://wa.me/" + C.WHATSAPP + "?text=" + encodeURIComponent(texto); }
  function ico(path, size) {
    return '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }
  var COPIAR = ico('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>', 16);

  document.title = "Pago – Nexa Store Perú";

  // ---- Datos del pedido ----
  function lineas() {
    if (soloId) { var p = prod(soloId); return p && p.stock > 0 ? [{ id: p.id, plan: p.planes ? C.planDe(p, soloPlan).meses : 0, qty: 1 }] : []; }
    return window.CARRITO ? window.CARRITO.items() : [];
  }
  function total(ls) { return ls.reduce(function (s, x) { return s + C.precioDe(prod(x.id), x.plan) * x.qty; }, 0); }
  function ahorro(ls) {
    return ls.reduce(function (s, x) { var o = C.oldDe(prod(x.id), x.plan); return s + (o ? (o - C.precioDe(prod(x.id), x.plan)) * x.qty : 0); }, 0);
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function codigoPedido(ls) {
    var firma = ls.map(function (x) { return x.id + ':' + (x.plan || 0) + ':' + x.qty; }).join('|');
    try {
      var g = JSON.parse(sessionStorage.getItem('nexa_pedido') || 'null');
      if (g && g.firma === firma) return g.codigo;
    } catch (e) {}
    var hoy = new Date();
    var cod = 'NX-' + pad2(hoy.getDate()) + pad2(hoy.getMonth() + 1) + '-' + (1000 + Math.floor(Math.random() * 9000));
    try { sessionStorage.setItem('nexa_pedido', JSON.stringify({ firma: firma, codigo: cod })); } catch (e) {}
    return cod;
  }
  function codigoDescuento() {
    try { return sessionStorage.getItem('nexa_codigo') || ''; } catch (e) { return ''; }
  }

  function metodo(id) { for (var i = 0; i < METODOS.length; i++) if (METODOS[i].id === id) return METODOS[i]; return METODOS[0]; }
  function formatoNumero(n) { return /^\d{9}$/.test(n) ? n.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : n; }

  // ---- Panel del método elegido ----
  function pasos(m, cfg, cod, monto) {
    var lista;
    if (m.id === 'qr') {
      lista = ['Abre Yape, Plin o la app de tu banco y elige <strong>Escanear QR</strong>.',
        'Escanea el código de arriba.',
        'Ingresa el monto exacto: <strong>' + monto + '</strong>.',
        'En el mensaje escribe tu código <strong>' + cod + '</strong>.',
        'Toma una captura del pago y envíala por WhatsApp.'];
    } else if (m.id === 'yape') {
      lista = ['Abre la app de <strong>Yape</strong> y toca <strong>Yapear</strong>.',
        'Ingresa el número de abajo' + (cfg.qr ? ' o escanea el QR.' : '.'),
        'Yapea el monto exacto: <strong>' + monto + '</strong>.',
        'En el mensaje escribe tu código <strong>' + cod + '</strong>.',
        'Toma una captura del pago y envíala por WhatsApp.'];
    } else {
      lista = ['Abre la app de tu banco que tenga <strong>Plin</strong>.',
        'Elige <strong>Plinear</strong> e ingresa el número de abajo' + (cfg.qr ? ' o escanea el QR.' : '.'),
        'Envía el monto exacto: <strong>' + monto + '</strong>.',
        'En el mensaje escribe tu código <strong>' + cod + '</strong>.',
        'Toma una captura del pago y envíala por WhatsApp.'];
    }
    return '<ol class="pg-steps">' + lista.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol>';
  }

  function fila(k, v, copia, grande) {
    return '<div class="pg-row"><span class="k">' + k + '</span><strong class="v' + (grande ? ' big' : '') + '">' + v + '</strong>' +
      (copia ? '<button type="button" class="copy" data-copy="' + copia + '">' + COPIAR + '<span>Copiar</span></button>' : '') + '</div>';
  }

  function panel(m, ls) {
    var cfg = PG[m.id] || {};
    var cod = codigoPedido(ls);
    var t = total(ls);
    var monto = dinero(t);
    var titular = cfg.titular || PG.titular || '';
    var imgQr = m.id === 'qr' ? cfg.img : cfg.qr;
    var tieneNumero = m.id !== 'qr' && cfg.numero;
    var hayDatos = (m.id === 'qr') ? !!imgQr : !!(cfg.numero || imgQr);

    if (!hayDatos) {
      var ask = wa('Hola, quiero pagar mi pedido ' + cod + ' por ' + m.nombre + ' (' + monto + '). ¿Me pasas los datos de pago?');
      return '<h2>Paga con ' + m.nombre + '</h2>' +
        '<div class="pay-missing"><p>Te enviamos los datos de pago por WhatsApp para que pagues con ' + m.nombre + '.</p>' +
        '<a class="btn primary" href="' + ask + '" target="_blank" rel="noopener">Pedir datos de pago</a></div>';
    }

    var qrHtml = '';
    if (imgQr) {
      var alFallar = m.id === 'qr'
        ? "this.parentNode.innerHTML='<p class=&quot;qr-falta&quot;>No pudimos cargar el QR. Pídelo por WhatsApp.</p>'"
        : "this.parentNode.remove()";
      qrHtml = '<div class="qr-box"><img src="logos/' + imgQr + '" alt="Código QR para pagar con ' + m.nombre + '" onerror="' + alFallar + '"></div>';
    }
    var datos = '<div class="pg-data">' +
      (titular ? fila('Titular', titular, '', false) : '') +
      (tieneNumero ? fila('Número de ' + m.nombre, formatoNumero(cfg.numero), cfg.numero, true) : '') +
      fila('Monto exacto', monto, t.toFixed(2), true) +
      '</div>';

    var intro = m.id === 'qr'
      ? 'Escanea el código con Yape, Plin o la app de tu banco.'
      : 'Sigue estos pasos para pagar con ' + m.nombre + '.';
    return '<h2>Paga con ' + m.nombre + '</h2><p class="pg-intro">' + intro + '</p>' +
      (m.id === 'qr' ? qrHtml + datos : datos + qrHtml) +
      pasos(m, cfg, cod, monto);
  }

  function mensajeComprobante(m, ls) {
    var lin = ls.map(function (x, i) {
      var p = prod(x.id);
      return (i + 1) + ". " + nombreLinea(x) + " (" + p.tipo + ") x" + x.qty + " - " + dinero(C.precioDe(p, x.plan) * x.qty);
    }).join("\n");
    var d = codigoDescuento();
    var ahora = new Date();
    var fecha = pad2(ahora.getDate()) + "/" + pad2(ahora.getMonth() + 1) + "/" + ahora.getFullYear() + " " + pad2(ahora.getHours()) + ":" + pad2(ahora.getMinutes());
    return "Hola, ya realicé mi pago. Te envío el comprobante.\n\nPedido: " + codigoPedido(ls) +
      "\nFecha: " + fecha +
      "\nMétodo: " + m.nombre + "\n\n" + lin + "\n\nTotal pagado: " + dinero(total(ls)) +
      (up.estado === 'ok' && up.url ? (CL.incluirEnlace === false ? "\nComprobante: ya lo subí a la web (búscalo con el código del pedido)" : "\nComprobante: " + up.url) : "") +
      (d ? "\nCódigo de descuento: " + d : "");
  }

  // ---- Subida del comprobante (Cloudinary) ----
  var CL = C.CLOUDINARY || {};
  var MAX_MB = 10;
  function subidaActiva() { return !!(CL.cloudName && CL.preset); }
  function nuevoUp() { return { estado: 'idle', codigo: '', nombre: '', url: '', pct: 0, archivo: null, vista: '', error: '' }; }
  var up = nuevoUp();
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var ICO_SUBIR = ico('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"/>', 20);
  var ICO_ARCH = ico('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>', 22);

  function upHtml() {
    var input = '<input type="file" id="pg-file" accept="image/*,application/pdf" hidden>';
    if (up.estado === 'idle') {
      return input + '<button type="button" class="pg-pick" data-pick>' + ICO_SUBIR + 'Subir captura de mi pago</button>' +
        '<small class="pg-hint">Imagen o PDF · máximo ' + MAX_MB + ' MB' + (subidaActiva() ? '' : ' · luego la adjuntas en WhatsApp') + '</small>';
    }
    var thumb = up.vista ? '<img src="' + up.vista + '" alt="">' : ICO_ARCH;
    var estado;
    if (up.estado === 'subiendo') {
      estado = '<span class="st">Subiendo… ' + up.pct + '%</span><div class="bar"><i style="width:' + up.pct + '%"></i></div>';
    } else if (up.estado === 'ok') {
      estado = '<span class="st ok">' + (subidaActiva() ? '✓ Comprobante subido' : '✓ Captura lista. Adjúntala en WhatsApp') + '</span>';
    } else {
      estado = '<span class="st err">' + esc(up.error) + '</span>';
    }
    var acciones = up.estado === 'error'
      ? '<button type="button" class="lnk" data-reintentar>Reintentar</button><button type="button" class="lnk" data-quitar>Quitar</button>'
      : (up.estado === 'ok' ? '<button type="button" class="lnk" data-quitar>Cambiar</button>' : '');
    return input + '<div class="pg-file"><span class="th">' + thumb + '</span><div class="tx"><span class="nm">' + esc(up.nombre) + '</span>' + estado + '</div>' +
      (acciones ? '<div class="ac">' + acciones + '</div>' : '') + '</div>';
  }
  function pintarUp() {
    var box = document.getElementById('pg-up');
    if (box) box.innerHTML = upHtml();
  }
  function reiniciarUp() {
    if (up.vista) { try { URL.revokeObjectURL(up.vista); } catch (e) {} }
    up = nuevoUp();
  }

  // Arma el nombre de la carpeta reemplazando {metodo}, {producto}, {anio}, {mes}, {dia} y {pedido}
  function carpetaDe(ls) {
    var ahora = new Date();
    var ids = ls.map(function (x) { return x.id; });
    var datos = {
      metodo: metodoId,
      producto: ids.length === 1 ? ids[0] : 'varios',
      pedido: codigoPedido(ls).toLowerCase(),
      anio: String(ahora.getFullYear()),
      mes: pad2(ahora.getMonth() + 1),
      dia: pad2(ahora.getDate())
    };
    return String(CL.carpeta || '')
      .replace(/\{(\w+)\}/g, function (m, k) { return datos[k] !== undefined ? datos[k] : ''; })
      .replace(/\/{2,}/g, '/').replace(/^\/|\/$/g, '');
  }

  function subir(file) {
    var ls = lineas(), cod = codigoPedido(ls);
    if (up.vista) { try { URL.revokeObjectURL(up.vista); } catch (e) {} }
    var mio = up = { estado: 'subiendo', codigo: cod, nombre: file.name, url: '', pct: 0, archivo: file,
      vista: /^image\//.test(file.type) ? URL.createObjectURL(file) : '', error: '' };
    var refrescar = function () { if (up === mio) { pintarUp(); actualizarEnvio(); } };
    if (!subidaActiva()) {
      // Sin Cloudinary: no se sube nada; basta con elegir la captura para activar el botón
      mio.estado = 'ok';
      track('comprobante_seleccionado', {});
      refrescar();
      return;
    }
    refrescar();

    var fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CL.preset);
    var carpeta = carpetaDe(ls);
    if (carpeta) fd.append('folder', carpeta);
    fd.append('tags', cod);
    fd.append('context', 'pedido=' + cod + '|metodo=' + metodo(metodoId).nombre + '|total=' + total(ls).toFixed(2) + '|productos=' + ls.map(function (x) { return x.id + (x.plan ? '-' + x.plan + 'm' : '') + 'x' + x.qty; }).join('+'));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + encodeURIComponent(CL.cloudName) + '/auto/upload');
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) { mio.pct = Math.round(e.loaded / e.total * 100); refrescar(); }
    };
    xhr.onload = function () {
      var r = {};
      try { r = JSON.parse(xhr.responseText); } catch (e) {}
      if (xhr.status >= 200 && xhr.status < 300 && r.secure_url) {
        mio.estado = 'ok'; mio.url = r.secure_url;
        track('comprobante_subido', {});
      } else {
        mio.estado = 'error';
        mio.error = (r.error && r.error.message) ? 'No se pudo subir: ' + r.error.message : 'No se pudo subir el archivo. Inténtalo otra vez.';
      }
      refrescar();
    };
    xhr.onerror = function () {
      mio.estado = 'error';
      mio.error = 'Sin conexión. Revisa tu internet e inténtalo otra vez.';
      refrescar();
    };
    xhr.send(fd);
  }

  // ---- Dibujar la página ----
  function render() {
    var ls = lineas();
    if (!ls.length || !METODOS.length) {
      cont.innerHTML = '<section class="pd-missing"><h1>' + (ls.length ? 'Pagos no disponibles' : 'No hay nada para pagar') + '</h1>' +
        '<p>' + (ls.length ? 'Escríbenos por WhatsApp y te ayudamos con tu pedido.' : 'Agrega productos a tu carrito para continuar con el pago.') + '</p>' +
        '<a class="btn primary big" href="index.html#catalogo">Ver catálogo</a></section>';
      return;
    }
    if (!metodo(metodoId) || METODOS.every(function (m) { return m.id !== metodoId; })) metodoId = METODOS[0].id;
    var m = metodo(metodoId);
    var cod = codigoPedido(ls);
    if (up.estado !== 'idle' && up.codigo !== cod) reiniciarUp();
    var ah = ahorro(ls);

    var items = ls.map(function (x) {
      var p = prod(x.id), k = P.indexOf(p);
      return '<li class="ps-item"><span class="ps-thumb" style="background:linear-gradient(150deg,' + FONDOS[k % FONDOS.length] + ')"><img src="logos/' + p.img + '" alt="" onerror="nexaImg(this)"></span>' +
        '<span class="ps-info"><strong>' + p.nombre + '</strong><small>' + p.tipo + ' · ' + C.duracionDe(p, x.plan) + ' · x' + x.qty + '</small></span><b>' + dinero(C.precioDe(p, x.plan) * x.qty) + '</b></li>';
    }).join('');

    cont.innerHTML =
      '<div class="pg-head"><nav class="crumbs" aria-label="Ruta"><a href="index.html">Inicio</a><span>/</span><a href="index.html#catalogo">Catálogo</a><span>/</span><span aria-current="page">Pago</span></nav>' +
      '<h1>Finaliza tu pago</h1><p>Elige cómo quieres pagar, sigue los pasos y envíanos tu comprobante por WhatsApp.</p></div>' +
      '<div class="pg-grid">' +
        '<section class="pg-main">' +
          '<div class="pg-card"><h3 class="pg-t"><b>1</b>Elige tu método de pago</h3>' +
            '<div class="pg-methods" role="group" aria-label="Método de pago">' +
              METODOS.map(function (x) {
                return '<button type="button" class="pg-m" data-m="' + x.id + '" aria-pressed="' + (x.id === m.id) + '">' + C.marcaPago(x) + '<span>' + x.nombre + '</span></button>';
              }).join('') +
            '</div></div>' +
          '<div class="pg-card"><h3 class="pg-t"><b>2</b>Realiza el pago</h3><div id="pg-panel">' + panel(m, ls) + '</div></div>' +
        '</section>' +
        '<aside class="pg-side" aria-label="Resumen del pedido"><div class="pg-card pg-sum">' +
          '<h3 class="pg-t">Resumen del pedido</h3>' +
          '<ul class="ps-list">' + items + '</ul>' +
          '<div class="ps-total"><div><span>Total a pagar</span>' + (ah > 0 ? '<em>Ahorras ' + dinero(ah) + '</em>' : '') + '</div><strong>' + dinero(total(ls)) + '</strong></div>' +
          '<div class="ps-code"><span>Código de tu pedido</span><div><strong>' + cod + '</strong><button type="button" class="copy" data-copy="' + cod + '">' + COPIAR + '<span>Copiar</span></button></div><small>Escríbelo en el mensaje de tu pago.</small></div>' +
          (soloId ? '' : '<button type="button" class="ps-edit" data-editar>Editar carrito</button>') +
        '</div>' +
          '<div class="pg-card pg-send-card"><h3 class="pg-t"><b>3</b>Envía tu comprobante</h3>' +
            '<p class="pg-intro">' + (subidaActiva() ? 'Sube la captura de tu pago y luego envíala por WhatsApp. Confirmamos y te enviamos tu acceso.' : 'Selecciona la captura de tu pago para activar el botón. Luego adjúntala en el chat de WhatsApp. Confirmamos y te enviamos tu acceso.') + '</p>' +
            '<div id="pg-up">' + upHtml() + '</div>' +
            '<a id="pg-enviar" class="btn primary big pg-send" href="#" target="_blank" rel="noopener"><img class="wa-ico" src="logos/icon-whatsapp.png" alt="" width="24" height="24" onerror="this.remove()">Ya pagué, enviar comprobante</a></div>' +
        '</aside>' +
      '</div>' +
      '<div class="toast" id="pg-toast" role="status" aria-live="polite"></div>';

    toastEl = document.getElementById('pg-toast');
    actualizarEnvio();
    if (!trackeado) { trackeado = true; track('begin_checkout', { payment_type: m.nombre }); }
  }

  // El botón de WhatsApp solo funciona cuando ya hay una captura (subida a Cloudinary, o seleccionada si no está configurado)
  function listoParaEnviar() { return up.estado === 'ok'; }
  function actualizarEnvio() {
    var a = document.getElementById('pg-enviar');
    if (!a) return;
    var ok = listoParaEnviar();
    a.href = ok ? wa(mensajeComprobante(metodo(metodoId), lineas())) : '#';
    if (ok) a.target = '_blank'; else a.removeAttribute('target');
    a.setAttribute('aria-disabled', String(!ok));
    a.classList.toggle('is-off', !ok);
  }

  // ---- Avisos y copiar ----
  function aviso(txt) {
    if (!toastEl) return;
    toastEl.textContent = txt;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2000);
  }
  function copiar(texto, btn) {
    function listo() {
      aviso('Copiado: ' + texto);
      var s = btn.querySelector('span');
      if (s) { s.textContent = '¡Copiado!'; setTimeout(function () { s.textContent = 'Copiar'; }, 1800); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(listo, function () { aviso('No se pudo copiar'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); listo(); } catch (e) { aviso('No se pudo copiar'); }
      document.body.removeChild(ta);
    }
  }

  cont.addEventListener('click', function (e) {
    if (e.target.closest('#pg-enviar')) {
      if (!listoParaEnviar()) {
        e.preventDefault();
        aviso(up.estado === 'subiendo' ? 'Espera a que termine de subir tu captura' : 'Primero sube la captura de tu pago');
        if (up.estado === 'idle') { var fi0 = document.getElementById('pg-file'); if (fi0) fi0.click(); }
        return;
      }
      track('generate_lead', { payment_type: metodo(metodoId).nombre });
    }
    var cp = e.target.closest('[data-copy]');
    if (cp) return copiar(cp.dataset.copy, cp);
    var mb = e.target.closest('[data-m]');
    if (mb) {
      metodoId = mb.dataset.m;
      track('add_payment_info', { payment_type: metodo(metodoId).nombre });
      cont.querySelectorAll('[data-m]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === mb)); });
      document.getElementById('pg-panel').innerHTML = panel(metodo(metodoId), lineas());
      actualizarEnvio();
      return;
    }
    if (e.target.closest('[data-pick]')) { var fi = document.getElementById('pg-file'); if (fi) fi.click(); return; }
    if (e.target.closest('[data-quitar]')) { reiniciarUp(); pintarUp(); actualizarEnvio(); return; }
    if (e.target.closest('[data-reintentar]') && up.archivo) { subir(up.archivo); return; }
    if (e.target.closest('[data-editar]') && window.CARRITO) window.CARRITO.open();
  });

  cont.addEventListener('change', function (e) {
    if (!e.target || e.target.id !== 'pg-file') return;
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!/^(image\/|application\/pdf)/.test(f.type)) { aviso('Sube una imagen o un PDF'); return; }
    if (f.size > MAX_MB * 1024 * 1024) { aviso('El archivo pesa más de ' + MAX_MB + ' MB'); return; }
    subir(f);
  });

  render();
  if (!soloId && window.CARRITO) window.CARRITO.onChange(render);
})();