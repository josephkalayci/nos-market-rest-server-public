const SquareConnect = require('square-connect');
const { PaymentsApi } = require('square-connect');
const defaultClient = SquareConnect.ApiClient.instance;

const config = {
  ACCESS_TOKEN: process.env.SQUARE_ACCESS_TOKEN,
  API_BASE_PATH: 'https://connect.squareupsandbox.com',
};

let oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = config.ACCESS_TOKEN;

// Use API_BASE_PATH to switch between sandbox env and production env
// sandbox: https://connect.squareupsandbox.com
// production: https://connect.squareup.com
defaultClient.basePath = config.API_BASE_PATH;

const paymentsApi = new PaymentsApi();

exports.paymentsApi = paymentsApi;
