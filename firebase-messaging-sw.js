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

messaging.onBackgroundMessage(function(payload) {
  var data = payload.data || {};
  var n = payload.notification || {};
  var title = n.title || 'GSM Reportes';
  var body = n.body || '';
  var url = 'https://francangelosi.github.io/Reportes-GSM/ReportesGSM.html';

  // Para notificaciones de cambio de estado, el ícono puede variar
  var icon = 'https://francangelosi.github.io/Reportes-GSM/icon-192.png';

  self.registration.showNotification(title, {
    body: body,
    icon: icon,
    badge: icon,
    data: {
      url: url,
      type: data.type || 'nuevo_reporte',
      reportId: data.reportId || ''
    },
    requireInteraction: data.type === 'nuevo_reporte'
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) ||
            'https://francangelosi.github.io/Reportes-GSM/ReportesGSM.html';
  event.waitUntil(clients.openWindow(url));
});
