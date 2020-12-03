require('dotenv').config();
const config = require('./common/config/env.config.js');
var winston = require('winston'),
  expressWinston = require('express-winston');

const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const ProductsRouter = require('./products/routes.config');
const CategoriesRouter = require('./categories/routes.config');
const OrdersRouter = require('./orders/routes.config');
const UserRouter = require('./users/routes.config');
const AuthorizationRouter = require('./authorization/routes.config');
const ShippingRouter = require('./shipping/routes.config');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Authorization, Content-Type, X-Requested-With, Range'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      // winston.format.colorize(),
      winston.format.json()
    ),
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg:
      'HTTP {{req.method}} {{req.url}} responseTime: {{res.responseTime}}ms statusCode: {{res.statusCode}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);

app.use(bodyParser.json());

AuthorizationRouter.routesConfig(app);
CategoriesRouter.routesConfig(app);
ProductsRouter.routesConfig(app);
OrdersRouter.routesConfig(app);
ShippingRouter.routesConfig(app);
UserRouter.routesConfig(app);

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      //   winston.format.colorize(),
      winston.format.json()
    ),
  })
);

app.listen(process.env.PORT || config.port, function () {
  console.log('app listening at port %s', process.env.PORT || config.port);
});
