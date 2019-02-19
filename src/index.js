require('./index.html');
require('./app.scss');
if (ENABLE_SERVICE_WORKER) {
  require('./sw.setup.js');
}
require('./app.js');
