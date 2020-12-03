const OrdersController = require('./controllers/orders.controller');
const OrdersPermissionMiddleware = require('./middlewares/orders.permission.middleware');
const AuthValidationMiddleware = require('../authorization/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
  app.get('/orders', [
    AuthValidationMiddleware.validJWTNeeded,
    OrdersPermissionMiddleware.onlySameUserCanDoThisAction,
    OrdersController.listByCustomerId,
  ]);
  app.post('/orders', [
    AuthValidationMiddleware.isAuthenticated,
    OrdersController.createAndCharge,
  ]);
};
