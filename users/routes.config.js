const UsersController = require('./controllers/users.controller');
const AuthValidationMiddleware = require('../authorization/middlewares/auth.validation.middleware');
const AuthPremissionMiddleware = require('../authorization/middlewares/auth.permission.middleware');

exports.routesConfig = function (app) {
  app.get('/users/:userId', [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPremissionMiddleware.onlySameUserCanDoThisAction,
    UsersController.getById,
  ]);
  app.patch('/users/:userId', [
    AuthValidationMiddleware.validJWTNeeded,
    AuthPremissionMiddleware.onlySameUserCanDoThisAction,
    UsersController.patchById,
  ]);
};
