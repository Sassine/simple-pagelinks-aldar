// Google Analytics 4 — Al Dar Restaurante
// Substitua G-XXXXXXXXXX pelo Measurement ID real (GA4 → Admin → Data Streams).
(function () {
  var GA_MEASUREMENT_ID = 'G-8KYWF9EVGK';

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
})();
