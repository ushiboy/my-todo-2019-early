if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker
      .register('./sw.bundle.js')
      .then(function() {}, function() {});
  });
}
