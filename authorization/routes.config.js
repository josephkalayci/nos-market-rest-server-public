const AuthValidationMiddleware = require('./middlewares/auth.validation.middleware');
const LoginController = require('./controllers/authorization.controller');
exports.routesConfig = function (app) {
  app.post('/auth', [
    AuthValidationMiddleware.hasAuthValidFields,
    LoginController.login,
  ]);
  app.post('/auth/verify', [
    AuthValidationMiddleware.validJWTNeeded,
    (req, res) => res.send('ok'),
  ]);
};
