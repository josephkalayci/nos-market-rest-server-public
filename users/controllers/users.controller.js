const { request } = require('express');

const wooCommerce = require('../../common/services/woocommerce.service')
  .wooCommerce;

exports.getById = (req, res) => {
  wooCommerce
    .get(`customers/${req.params.userId}`)
    .then((wooResponse) => {
      res.status(wooResponse.status).send(wooResponse.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
};

exports.patchById = (req, res) => {
  //do not update password throught api
  delete req.body.password;
  wooCommerce
    .put(`customers/${req.params.userId}`, req.body)
    .then((wooResponse) => {
      res.status(wooResponse.status).send(wooResponse.data);
    })
    .catch((error) => {
      res.status(500).send(error.response.data);
    });
};
