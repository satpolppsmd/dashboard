/* Service worker Dashboard PPUD — hanya untuk notifikasi HP (Web Push). Tidak menyimpan halaman/data (tanpa cache). */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { isi: e.data ? e.data.text() : '' }; }
  var opsi = {
    body: d.isi || '',
    icon: '/dashboard/ikon-192.png',
    badge: '/dashboard/ikon-badge.png',
    data: { url: d.url || '/dashboard/' },
    lang: 'id',
    timestamp: d.waktu || Date.now()
  };
  if (d.tag) { opsi.tag = d.tag; opsi.renotify = true; }
  e.waitUntil(self.registration.showNotification(d.judul || 'Dashboard PPUD', opsi));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = new URL((e.notification.data && e.notification.data.url) || '/dashboard/', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf(self.location.origin + '/dashboard/') === 0 && 'focus' in c) {
        return c.focus().then(function (f) { (f || c).postMessage({ buka: url }); });
      }
    }
    return self.clients.openWindow(url);
  }));
});
