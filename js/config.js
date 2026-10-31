/* ====== CONFIGURACIÓN DE NEXA STORE: edita solo este archivo ====== */
window.NEXA = {
  WHATSAPP: "51987177574",          // con código de país y sin signos
  MONEDA: "S/",
  CORREO: "semmir09@gmail.com",     // déjalo vacío ("") para ocultarlo
  // Redes sociales: pega el enlace completo. Las que dejes vacías no se muestran.
  REDES: { instagram: "", tiktok: "", facebook: "" },

  ENTREGA: "Entrega automática",
  DURACION: "30 días",
  STOCK_BAJO: 5,                    // desde este número se muestra "Quedan X"

  // Métodos de pago que se muestran en la web (página del producto, pie, carrito y página de pago).
  // Borra una línea para quitarla; deja la lista vacía ([]) para ocultar todo.
  // id: "yape" o "plin" (une el método con sus datos de abajo, en PAGO)
  // img: imagen dentro de la carpeta "logos" (si no existe, se usa la primera letra)
  // icono: "qr" o "banco" para usar un ícono dibujado
  METODOS_PAGO: [
    { id: "yape", nombre: "Yape", color: "#742284", img: "icon-yape.png" },
    { id: "plin", nombre: "Plin", color: "#00b4e6", img: "icon-plin.png" }
  ],

  // Datos que ve el cliente en la página de pago (pago.html).
  // Lo que dejes vacío no se muestra; si faltan los datos, se le ofrece pedirlos por WhatsApp.
  PAGO: {
    titular: "Cronyer Alama Bereche",           // nombre tal como sale en la app
    // numero: solo dígitos · qr: nombre de la imagen dentro de la carpeta "logos"
    yape: { numero: "963752265", titular: "", qr: "qr-yape.png" },
    plin: { numero: "963752265", titular: "", qr: "qr-plin.png" }
  },

  // Banner de oferta de la semana (aparece encima del catálogo en la página principal).
  // activa: false lo oculta · producto: id del producto, como "netflix", "disney", "chatgpt-plus"
  // hasta: fecha límite, ej. "2026-10-31" o "2026-10-31 20:00". Muestra una cuenta regresiva y el banner
  //        se oculta solo al terminar. Déjalo vacío ("") para no mostrar cuenta regresiva.
  // titulo y texto son opcionales (si dejas texto vacío se arma solo con el precio)
  OFERTA: { activa: true, producto: "netflix", titulo: "Oferta de la semana", texto: "", hasta: "" },

  // Analítica de visitas: elige una (o ninguna). Vacío = desactivada.
  // ga4: tu ID de medición de Google Analytics 4, ej. "G-ABC123XYZ" (Admin → Flujos de datos → tu sitio web)
  // plausible: tu dominio tal como lo registraste en Plausible, ej. "nexastore.pe"
  // enLocal: false evita contar tus propias pruebas en 127.0.0.1 o localhost
  ANALITICA: { ga4: "", plausible: "", enLocal: false },

  // Tema que ve alguien la primera vez que entra: "oscuro" o "claro" (después se acuerda de su elección)
  TEMA_INICIAL: "oscuro",

  // Subida del comprobante de pago a Cloudinary (el cliente sube su captura desde la página de pago).
  // cloudName: el "Cloud name" de tu cuenta (Cloudinary → Settings o Dashboard)
  // preset: nombre de un "Upload preset" con Signing mode = Unsigned
  // carpeta: carpeta donde se guardan los comprobantes. Puede cambiar sola según el pago usando estas palabras:
  //   {metodo} = yape o plin · {producto} = id del producto (o "varios") · {anio} {mes} {dia} · {pedido} = código del pedido
  //   Ejemplos: "comprobantes/{metodo}"  ->  comprobantes/yape
  //             "comprobantes/{metodo}/{anio}-{mes}"  ->  comprobantes/plin/2026-10
  //             "comprobantes/{producto}"  ->  comprobantes/netflix
  // Si dejas cloudName o preset vacío, el botón de subir no aparece. NUNCA pongas aquí tu API secret.
  // incluirEnlace: true agrega el enlace de la imagen al mensaje de WhatsApp. Ponlo en false si tus
  // comprobantes son privados (el enlace no se abriría); en ese caso los buscas por el código del pedido.
  CLOUDINARY: { cloudName: "", preset: "", carpeta: "comprobantes/{metodo}", incluirEnlace: true },

  // img: nombre del archivo dentro de la carpeta "logos"
  // top: true muestra la etiqueta TOP · old: precio anterior (opcional)
  // stock: unidades disponibles. Cuando llegue a 0, el producto se muestra "Agotado" automáticamente
  // en todas partes (catálogo, carrito, pago) y ya no se puede comprar.
  // id: se genera solo a partir del nombre (se usa en la dirección de la página del producto)
  PRODUCTOS: [
    { nombre: "Netflix",         cat: "streaming", tipo: "Perfil individual", img: "netflix.png",         precio: 11.90, old: 16.90, stock: 3,  top: true },
    { nombre: "Disney+",         cat: "streaming", tipo: "Perfil individual", img: "disney.png",          precio: 8.90,  old: 13.90, stock: 7,  top: true },
    { nombre: "Prime Video",     cat: "streaming", tipo: "Perfil individual", img: "prime-video.png",     precio: 7.90,  old: 11.90, stock: 12 },
    { nombre: "HBO Max Estándar", cat: "streaming", tipo: "Perfil individual", img: "hbo-max-estandar.png", precio: 8.50,  old: 12.90, stock: 9 },
    { nombre: "HBO Max Platino",  cat: "streaming", tipo: "Perfil individual", img: "hbo-max-platino.png",  precio: 11.90, old: 16.90, stock: 5 },
    { nombre: "Crunchyroll",     cat: "streaming", tipo: "Perfil individual", img: "crunchyroll.png",     precio: 7.50,  old: 11.90, stock: 11 },
    { nombre: "Paramount+",      cat: "streaming", tipo: "Perfil individual", img: "paramount.png",       precio: 7.90,  old: 12.90, stock: 9 },
    { nombre: "Apple TV+",       cat: "streaming", tipo: "Perfil individual", img: "apple-tv.png",        precio: 8.90,  old: 13.90, stock: 8 },
    { nombre: "YouTube Premium", cat: "streaming", tipo: "Acceso compartido", img: "youtube-premium.png", precio: 6.90,  old: 10.90, stock: 15 },
    { nombre: "ChatGPT Plus",    cat: "ia",        tipo: "Acceso compartido", img: "chatgpt.png",         precio: 9.90,  old: 14.90, stock: 23, top: true },
    { nombre: "Claude Pro",      cat: "ia",        tipo: "Acceso compartido", img: "claude.png",          precio: 29.90, old: 39.90, stock: 4 },
    { nombre: "Gemini",          cat: "ia",        tipo: "Acceso compartido", img: "gemini.png",          precio: 14.90, old: 19.90, stock: 10 },
    { nombre: "Spotify Premium", cat: "otros",     tipo: "Acceso compartido", img: "spotify.png",         precio: 6.90,  old: 9.90,  stock: 18 },
    { nombre: "Canva Pro",       cat: "otros",     tipo: "Acceso compartido", img: "canva.png",           precio: 5.90,  old: 9.90,  stock: 20 },
    { nombre: "CapCut Pro",      cat: "otros",     tipo: "Acceso compartido", img: "capcut.png",          precio: 8.90,  old: 14.90, stock: 13 },
    { nombre: "Microsoft 365",   cat: "otros",     tipo: "Acceso compartido", img: "microsoft-365.png",   precio: 12.90, old: 19.90, stock: 10 }
  ]
};

/* ====== FIN DE LA CONFIGURACIÓN ====== */
(function () {
  var ICONOS = {
    banco: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18"/></svg>',
    qr: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="5.5" y="5.5" width="2" height="2" fill="currentColor" stroke="none"/><rect x="16.5" y="5.5" width="2" height="2" fill="currentColor" stroke="none"/><rect x="5.5" y="16.5" width="2" height="2" fill="currentColor" stroke="none"/><path d="M14 14h3v3h-3zM20 14v.01M14 20v.01M17 20h4v-3"/></svg>'
  };
  // Devuelve el HTML de los métodos de pago (lo usan el pie, el carrito y la página del producto)
  // Dibuja el círculo/ícono de un método
  window.NEXA.marcaPago = function (m) {
    var letra = m.nombre.charAt(0).toUpperCase();
    if (m.img) {
      return '<i class="pay-img"><img src="logos/' + m.img + '" alt="" onerror="this.parentNode.style.background=\'' + m.color + '\';this.replaceWith(document.createTextNode(\'' + letra + '\'))"></i>';
    }
    return '<i style="background:' + m.color + '">' + (ICONOS[m.icono] || letra) + '</i>';
  };
  window.NEXA.chipsPago = function () {
    return (window.NEXA.METODOS_PAGO || []).map(function (m) {
      return '<span class="pay">' + window.NEXA.marcaPago(m) + m.nombre + '</span>';
    }).join('');
  };

  window.NEXA.PRODUCTOS.forEach(function (p) {
    if (!p.id) {
      p.id = p.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
  });
})();