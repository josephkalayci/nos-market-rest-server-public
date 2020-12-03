const wooCommerce = require('../../common/services/woocommerce.service')
  .wooCommerce;

exports.getMethodsByPostCode = (req, res) => {
  if (!req.body.postcode) {
    res.status(400).send('Missing postcode');
    return;
  }
  const randomNumber = Math.floor(Math.random() * 3 + 1);
  let responsBody = [
    { method_id: 'free_shipping', enabled: true, min_amount: 40 },
    { method_id: 'flat_rate', enabled: true, cost: randomNumber },
    { method_id: 'local_pickup', enabled: true },
  ];

  res.status(200).send(responsBody);
};
