/* Extras de Nexa Store Perú: modo claro/oscuro y analítica de visitas.
   Se carga en el <head> de cada página, DESPUÉS de config.js. */
(function () {
  var raiz = document.documentElement;
  var C = window.NEXA || {};
  var CLAVE = 'nexa_tema';

  // ================= Tema claro / oscuro =================
  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function aplicar(tema, guardar) {
    raiz.setAttribute('data-tema', tema);
    if (guardar) { try { localStorage.setItem(CLAVE, tema); } catch (e) {} }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', tema === 'claro' ? '#f4f2ff' : '#080818');
    var etiqueta = tema === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
    var botones = document.querySelectorAll('.tema-btn');
    for (var i = 0; i < botones.length; i++) {
      botones[i].setAttribute('aria-label', etiqueta);
      botones[i].setAttribute('title', etiqueta);
    }
  }
  function actual() { return raiz.getAttribute('data-tema') === 'claro' ? 'claro' : 'oscuro'; }

  var inicial = leer();
  if (inicial !== 'claro' && inicial !== 'oscuro') inicial = C.TEMA_INICIAL === 'claro' ? 'claro' : 'oscuro';
  aplicar(inicial, false);   // antes de que se dibuje la página, así no parpadea

  var SOL = '<svg class="sol" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var LUNA = '<svg class="luna" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function crearBoton() {
    var barra = document.querySelector('header .actions');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cart-btn tema-btn' + (barra ? '' : ' flotante');
    b.innerHTML = SOL + LUNA;
    b.addEventListener('click', function () {
      raiz.classList.add('cambiando');
      aplicar(actual() === 'claro' ? 'oscuro' : 'claro', true);
      setTimeout(function () { raiz.classList.remove('cambiando'); }, 400);
      if (window.nexaTrack) window.nexaTrack('cambio_tema', { tema: actual() });
    });
    if (barra) barra.insertBefore(b, barra.firstChild); else document.body.appendChild(b);
    aplicar(actual(), false);   // pone el texto correcto al botón
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', crearBoton);
  else crearBoton();

  // Si cambia el tema en otra pestaña, se actualiza aquí
  window.addEventListener('storage', function (e) {
    if (e.key === CLAVE && (e.newValue === 'claro' || e.newValue === 'oscuro')) aplicar(e.newValue, false);
  });

  // ================= Analítica de visitas =================
  var A = C.ANALITICA || {};
  var enLocal = /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
  var respetarDNT = navigator.doNotTrack === '1' || window.doNotTrack === '1';
  var activa = (A.ga4 || A.plausible) && (!enLocal || A.enLocal) && !respetarDNT;

  function cargar(src, extra) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    for (var k in (extra || {})) s.setAttribute(k, extra[k]);
    document.head.appendChild(s);
  }

  if (activa && A.ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', A.ga4);
    cargar('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(A.ga4));
  }
  if (activa && A.plausible) {
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    cargar('https://plausible.io/js/script.js', { 'data-domain': A.plausible });
  }

  // Registrar un evento (ver producto, agregar al carrito, ir a pagar...). Si no hay analítica, no hace nada.
  window.nexaTrack = function (evento, datos) {
    if (!activa) return;
    datos = datos || {};
    try {
      if (A.ga4 && window.gtag) window.gtag('event', evento, datos);
      if (A.plausible && window.plausible) {
        var props = {};
        for (var k in datos) if (datos[k] !== null && typeof datos[k] !== 'object') props[k] = String(datos[k]);
        if (datos.items && datos.items[0]) props.producto = datos.items[0].item_name;
        window.plausible(evento, { props: props });
      }
    } catch (e) {}
  };
})();