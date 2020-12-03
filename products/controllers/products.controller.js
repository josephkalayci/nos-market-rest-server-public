const wooCommerce = require('../../common/services/woocommerce.service')
  .wooCommerce;

exports.getById = (req, res) => {
  wooCommerce
    .get(`products/${req.params.productId}`, req.query)
    .then((wooResponse) => {
      res.status(wooResponse.status).send(wooResponse.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
};

exports.list = (req, res) => {
  wooCommerce
    .get(`products`, req.query)
    .then((wooResponse) => {
      res.status(wooResponse.status).send(wooResponse.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
};
