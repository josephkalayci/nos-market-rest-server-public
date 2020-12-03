const CategoriesController = require('./controllers/categories.controller');
const CacheMiddleware = require('../common/middlewares/cache.middleware');

exports.routesConfig = function (app) {
  app.get('/categories', [
    CacheMiddleware.cacheByUrl(60 * 30),
    CategoriesController.list,
  ]);
  app.get('/categories/:categoryId', [
    CacheMiddleware.cacheByUrl(60 * 30),
    CategoriesController.getById,
  ]);
};
