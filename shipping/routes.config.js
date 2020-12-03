const ShippingController = require('./controllers/shipping.controller');

exports.routesConfig = function (app) {
  app.get('/shipping/methods', [ShippingController.getMethodsByPostCode]);
};
