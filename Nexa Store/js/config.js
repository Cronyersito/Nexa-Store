/* ====== CONFIGURACIÓN DE NEXA STORE: edita solo este archivo ====== */
window.NEXA = {
  WHATSAPP: "51987177574",          // con código de país y sin signos
  MONEDA: "S/",
  SITIO: "https://nexastore-peru.netlify.app",   // dirección de tu web, sin "/" al final (para enlaces canónicos y SEO)
  CORREO: "semmir09@gmail.com",     // déjalo vacío ("") para ocultarlo
  // Redes sociales: pega el enlace completo. Las que dejes vacías no se muestran.
  REDES: { instagram: "", tiktok: "https://www.tiktok.com/@crovex_oficial.pe", facebook: "https://www.facebook.com/share/1Dw6aG4N48/" },

  ENTREGA: "Entrega por WhatsApp",
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

  // Carrusel de banners de la página principal (reemplaza al banner de OFERTA mientras tenga elementos).
  // img: archivo dentro de "logos" · productos: ids de los productos del grupo (el "desde S/ X" sale del más barato con stock)
  // filtro: categoría que se abre al pulsar el botón ("streaming", "ia", "otros" o "all") · buscar: texto opcional para filtrar el catálogo
  // hasta: (opcional) fecha límite, ej. "2026-11-30"; después de esa fecha el banner se oculta solo
  // Deja la lista vacía ([]) para volver al banner de OFERTA de arriba.
  BANNERS: [
    { img: "banner-cine.webp", etiqueta: "Nexa Store Perú · Cine y series", titulo: "Todo tu streaming en un solo lugar",
      texto: "Netflix, Disney+, Prime Video, HBO Max y más.", boton: "Ver streaming", filtro: "streaming",
      productos: ["netflix", "disney", "prime-video", "hbo-max-estandar", "hbo-max-platino", "paramount", "apple-tv", "crunchyroll"] },
    { img: "banner-ia.webp", etiqueta: "Nexa Store Perú · Inteligencia artificial", titulo: "La IA que usan todos, al mejor precio",
      texto: "ChatGPT Plus.", boton: "Ver IA", filtro: "ia",
      productos: ["chatgpt-plus"] },
    { img: "banner-futbol.webp", etiqueta: "Nexa Store Perú · Fútbol", titulo: "Vive la Liga 1 Max",
      texto: "DirecTV Go, Claro video y Movistar TV.", boton: "Ver fútbol", filtro: "streaming", buscar: "Liga 1 Max",
      productos: ["directv-go-liga-1-max", "claro-video-liga-1-max", "movistar-tv-liga-1-max"] },
    { img: "banner-seguridad.webp", etiqueta: "Nexa Store Perú · Seguridad", titulo: "Navega y protege tu equipo",
      texto: "NordVPN, HolaVPN, ESET y McAfee.", boton: "Ver seguridad", filtro: "otros",
      productos: ["nordvpn", "holavpn", "eset-security-essential", "mcafee-antivirus"] },
    { img: "banner-creativos.webp", etiqueta: "Nexa Store Perú · Creativos y música", titulo: "Crea, edita y disfruta",
      texto: "Canva Pro, CapCut Pro y Spotify.", boton: "Ver más productos", filtro: "otros",
      productos: ["canva-pro", "capcut-pro", "spotify-premium-1-mes"] }
  ],

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
  CLOUDINARY: { cloudName: "cr-recargas-pe", preset: "comprobantes", carpeta: "nexa/comprobantes/{metodo}", incluirEnlace: true },

  // img: nombre del archivo dentro de la carpeta "logos"
  // top: true muestra la etiqueta TOP · old: precio anterior (opcional)
  // stock: unidades disponibles. Cuando llegue a 0, el producto se muestra "Agotado" automáticamente
  // en todas partes (catálogo, carrito, pago) y ya no se puede comprar.
  // planes: (opcional) periodos que el cliente elige en la página del producto. Cada uno: { meses, precio, old (opcional) }
  //         El primero es el que se muestra en el catálogo como "Desde". Si no hay planes, se usa precio y duración normales.
  // duracion: (opcional) texto de duración propio del producto, ej. "1 año". Si no se pone, se usa DURACION.
  // caract: (opcional) lista de [valor, texto] que se muestra en la página del producto, ej. ["+3500", "canales"]
  // id: se genera solo a partir del nombre (se usa en la dirección de la página del producto)
  PRODUCTOS: [
    { nombre: "Netflix",         cat: "streaming", tipo: "Perfil individual", img: "netflix.png",         precio: 14.00, stock: 3,  top: true, caract: [["Full HD", "buena calidad"], ["1", "perfil propio"]] },
    { nombre: "Disney+",         cat: "streaming", tipo: "Perfil individual", img: "disney.png",          precio: 12.00, stock: 2,  top: true, caract: [["4K", "Ultra HD"], ["1", "perfil propio"]] },
    { nombre: "Prime Video",     cat: "streaming", tipo: "Perfil individual", img: "prime-video.png",     precio: 9.00, stock: 2, caract: [["Full HD", "buena calidad"], ["1", "perfil propio"]] },
    { nombre: "HBO Max Estándar", cat: "streaming", tipo: "Perfil individual", img: "hbo-max-estandar.png", precio: 9.00, stock: 3, caract: [["Full HD", "1080p"], ["1", "perfil propio"]] },
    { nombre: "HBO Max Platino",  cat: "streaming", tipo: "Perfil individual", img: "hbo-max-platino.png",  precio: 12.00, stock: 3, caract: [["4K", "Ultra HD"], ["1", "perfil propio"]] },
    { nombre: "DirecTV Go + Liga 1 Max", cat: "streaming", tipo: "Perfil · 1 dispositivo", img: "directv-go.png", precio: 30.00, stock: 3, caract: [["Liga 1 Max", "incluida"], ["1", "dispositivo"]] },
    { nombre: "Crunchyroll",     cat: "streaming", tipo: "Perfil individual", img: "crunchyroll.png",     precio: 7.00, stock: 3, caract: [["Sin", "anuncios"], ["1", "perfil propio"]] },
    { nombre: "Claro video + Liga 1 Max", cat: "streaming", tipo: "Perfil · 1 dispositivo", img: "claro-video.png", precio: 22.50, stock: 3, caract: [["Liga 1 Max", "incluida"], ["1", "dispositivo"]] },
    { nombre: "Movistar TV + Liga 1 Max", cat: "streaming", tipo: "Perfil individual", img: "movistar-tv.png", precio: 30.00, stock: 3, caract: [["Liga 1 Max", "incluida"], ["TV", "en vivo"]] },
    { nombre: "Paramount+",      cat: "streaming", tipo: "Perfil individual", img: "paramount.png",       precio: 9.00, stock: 3, caract: [["Full HD", "buena calidad"], ["1", "perfil propio"]] },
    { nombre: "Apple TV+",       cat: "streaming", tipo: "Perfil · 1 dispositivo", img: "apple-tv.png",        precio: 10.00, stock: 2, caract: [["4K", "HDR"], ["1", "dispositivo"], ["Apple", "Originals"]] },
    { nombre: "IPTV Smarters Pro", cat: "streaming", tipo: "Perfil · 1 dispositivo", img: "iptv-smarters.png", precio: 15.00, stock: 2, duracion: "1 mes",
      caract: [["+3500", "canales"], ["+8500", "series"], ["+45000", "películas"], ["1", "dispositivo"]] },
    { nombre: "YouTube Premium", cat: "streaming", tipo: "Acceso compartido", img: "youtube-premium.png", precio: 8.00, stock: 2, caract: [["Sin", "anuncios"], ["Music", "incluido"], ["Descargas", "sin conexión"]] },
    { nombre: "ChatGPT Plus",    cat: "ia",        tipo: "Acceso compartido", img: "chatgpt.png",         precio: 60.00, stock: 0, top: true, caract: [["Modelos", "avanzados"], ["Más", "límites de uso"]] },
    { nombre: "Spotify Premium 1 Mes", cat: "otros",     tipo: "Acceso compartido", img: "spotify.png",         precio: 20.0,  stock: 1, caract: [["Sin", "anuncios"], ["Descargas", "sin conexión"], ["1", "mes"]] },
    { nombre: "Canva Pro",       cat: "otros",     tipo: "Acceso compartido", img: "canva.png",           precio: 24.90,  stock: 1, caract: [["Plantillas", "premium"], ["Quitar", "fondos en 1 clic"], ["Brand", "Kit"]] },
    { nombre: "CapCut Pro",      cat: "otros",     tipo: "Acceso compartido", img: "capcut.png",          precio: 24.90, stock: 1, caract: [["Efectos", "premium"], ["Sin", "marca de agua"], ["4K", "exportación"]] },
    { nombre: "Microsoft 365",   cat: "otros",     tipo: "Acceso compartido", img: "microsoft-365.png",   precio: 64.90, stock: 1, duracion: "12 meses", caract: [["1 TB", "en OneDrive"], ["Word, Excel", "y PowerPoint"], ["12", "meses de vigencia"]] },
    { nombre: "HolaVPN", cat: "otros", tipo: "Acceso · 1 dispositivo", img: "hola-vpn.png", stock: 3,
      planes: [{ meses: 1, precio: 12.90 }, { meses: 3, precio: 25.00 }, { meses: 6, precio: 44.90 }, { meses: 12, precio: 59.90 }],
      caract: [["1", "dispositivo"], ["150+", "países"]] },
    { nombre: "NordVPN", cat: "otros", tipo: "Acceso · 1 dispositivo", img: "nordvpn.png", stock: 2,
      planes: [{ meses: 1, precio: 14.90 }, { meses: 3, precio: 44.90 }, { meses: 6, precio: 59.90 }, { meses: 12, precio: 79.90 }],
      caract: [["1", "dispositivo"], ["VPN", "navegación privada"]] },
    { nombre: "ESET Security Essential", cat: "otros", tipo: "Clave digital · 1 equipo", img: "eset.png", precio: 94.90, duracion: "1 año", stock: 1,
      caract: [["1", "equipo"], ["12", "meses de vigencia"]] },
    { nombre: "McAfee AntiVirus", cat: "otros", tipo: "Clave digital · 1 equipo", img: "mcafee.png", precio: 85.00, duracion: "1 año", stock: 1,
      caract: [["1", "equipo"], ["12", "meses de vigencia"]] }
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

  // Ayudantes de planes (periodos) y duración por producto
  var N = window.NEXA;
  N.planDe = function (p, meses) {
    if (!p || !p.planes || !p.planes.length) return null;
    meses = parseInt(meses, 10);
    for (var i = 0; i < p.planes.length; i++) if (p.planes[i].meses === meses) return p.planes[i];
    return p.planes[0];
  };
  N.precioDe = function (p, meses) { var pl = N.planDe(p, meses); return pl ? pl.precio : p.precio; };
  N.oldDe = function (p, meses) { var pl = N.planDe(p, meses); return pl ? (pl.old || 0) : (p.old || 0); };
  N.etiquetaMeses = function (m) { return m + (m === 1 ? ' mes' : ' meses'); };
  N.duracionDe = function (p, meses) {
    var pl = N.planDe(p, meses);
    return pl ? N.etiquetaMeses(pl.meses) : (p.duracion || N.DURACION);
  };

  window.NEXA.PRODUCTOS.forEach(function (p) {
    if (p.planes && p.planes.length) { p.precio = p.planes[0].precio; if (p.planes[0].old) p.old = p.planes[0].old; }
    if (!p.id) {
      p.id = p.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
  });
})();

/* ====== Respaldo de imágenes de productos ======
   Si "logos/<img>" no carga, prueba otras extensiones (png, jpg, jpeg, webp) y variantes del nombre
   (con o sin guion). Si ninguna existe, quita la imagen y queda el fondo de color. */
window.nexaImg = function (img) {
  var cola = img._cola;
  if (!cola) {
    var m = /^(.*\/)([^\/?#]+?)(\.[A-Za-z0-9]+)?$/.exec(img.getAttribute('src') || '');
    if (!m) { img.remove(); return; }
    var dir = m[1], base = m[2], orig = (m[3] || '').toLowerCase();
    var nombres = [base, base.replace(/-/g, ''), base.replace(/-/g, '_')];
    var exts = ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG', '.WEBP'];
    cola = [];
    nombres.forEach(function (n) {
      exts.forEach(function (e) {
        var u = dir + n + e;
        if (u !== img.getAttribute('src') && cola.indexOf(u) === -1) cola.push(u);
      });
    });
    img._cola = cola;
  }
  if (cola.length) img.src = cola.shift(); else img.remove();
};