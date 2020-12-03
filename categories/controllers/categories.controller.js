const wooCommerce = require('../../common/services/woocommerce.service')
  .wooCommerce;

exports.getById = (req, res) => {
  wooCommerce
    .get(`products/categories/${req.params.categoryId}`, req.query)
    .then((wooResponse) => {
      delete wooResponse.data.yoast_head;

      res.status(wooResponse.status).send(wooResponse.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
};

exports.list = (req, res) => {
  wooCommerce
    .get(`products/categories`, req.query)
    .then((wooResponse) => {
      // wooResponse.data.forEach((item) => delete item.yoast_head);

      res.status(wooResponse.status).send(wooResponse.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
};
