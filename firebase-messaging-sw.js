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
  var n = payload.notification || {};
  var title = n.title || 'Nuevo reporte GSM';
  var body = n.body || '';
  var url = 'https://francangelosi.github.io/Reportes-GSM/ReportesGSM.html';
  
  self.registration.showNotification(title, {
    body: body,
    icon: '/favicon.ico',
    data: { url: url }
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || 
            'https://francangelosi.github.io/Reportes-GSM/ReportesGSM.html';
  event.waitUntil(clients.openWindow(url));
});
