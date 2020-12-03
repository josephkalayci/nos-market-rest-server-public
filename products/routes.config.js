const ProductsController = require('./controllers/products.controller');
const CacheMiddleware = require('../common/middlewares/cache.middleware');
exports.routesConfig = function (app) {
  app.get('/products', [
    CacheMiddleware.cacheByUrl(60 * 30),
    ProductsController.list,
  ]);
  app.get('/products/:productId', [
    CacheMiddleware.cacheByUrl(60 * 30),
    ProductsController.getById,
  ]);
};
