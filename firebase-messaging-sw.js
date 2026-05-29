importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBGfJdtWUQuyyBuym_KLHOqooJZqyEaKa4",
  authDomain: "reportes-gsm.firebaseapp.com",
  databaseURL: "https://reportes-gsm-default-rtdb.firebaseio.com",
  projectId: "reportes-gsm",
  storageBucket: "reportes-gsm.firebasestorage.app",
  messagingSenderId: "395219824140",
  appId: "1:395219824140:web:687f135e1d601cba0b4829"
});

const messaging = firebase.messaging();
const APP_URL = 'https://francangelosi.github.io/Reportes-GSM/ReportesGSM.html';
const ICON = 'https://francangelosi.github.io/Reportes-GSM/icon-192.png';

// Construye la notificación leyendo de notification.* Y de data.* (respaldo
// para mensajes "data-only", que es como se mandan para poder filtrar por sector).
function buildNotif(payload) {
  var data = payload.data || {};
  var n = payload.notification || {};
  var title = n.title || data.title || 'Nuevo reporte · GSM';
  var body  = n.body  || data.body  || data.descripcion || data.message || 'Tocá para ver el reporte.';
  return {
    title: title,
    options: {
      body: body,
      icon: ICON,
      badge: ICON,
      tag: data.reportId || data.type || 'gsm',   // agrupa por reporte
      renotify: true,
      data: {
        url: data.url || APP_URL,
        type: data.type || 'nuevo_reporte',
        reportId: data.reportId || ''
      },
      requireInteraction: (data.type || 'nuevo_reporte') === 'nuevo_reporte'
    }
  };
}

// Mensajes recibidos con la app cerrada / en segundo plano (FCM data-only).
messaging.onBackgroundMessage(function(payload) {
  var b = buildNotif(payload);
  return self.registration.showNotification(b.title, b.options);
});

// Respaldo: algunos navegadores entregan el push por el evento 'push' crudo
// en vez de onBackgroundMessage. Lo cubrimos para no perder ninguno.
self.addEventListener('push', function(event) {
  if (!event.data) return;
  var payload;
  try { payload = event.data.json(); } catch (e) { payload = { data: { body: event.data.text() } }; }
  // Si trae bloque notification, el navegador ya lo muestra solo: evitamos duplicado.
  if (payload && payload.notification && (payload.notification.title || payload.notification.body)) return;
  var b = buildNotif(payload || {});
  event.waitUntil(self.registration.showNotification(b.title, b.options));
});

// Al tocar la notificación: si la app ya está abierta, la enfoca; si no, la abre.
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || APP_URL;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf('ReportesGSM') >= 0 && 'focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Activa el SW nuevo sin esperar a que se cierren todas las pestañas.
self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(event) { event.waitUntil(self.clients.claim()); });
