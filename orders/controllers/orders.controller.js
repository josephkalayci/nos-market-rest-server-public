const { Card } = require('square-connect');

const wooCommerce = require('../../common/services/woocommerce.service')
  .wooCommerce;

const paymentsApi = require('../../common/services/squareup.service')
  .paymentsApi;
crypto = require('crypto');

exports.listByCustomerId = (req, res) => {
  wooCommerce
    .get(`orders`, { customer: req.query.customer })
    .then((wooResponse) => {
      res.status(wooResponse.status).send(wooResponse.data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};
/* 
  1.create payment request if payment type is credit Card (skip this step if payment type is cash on delivery)
  2.create order with panding status
  3.complate payment if payment type is credit Card (skip this step if payment type is cash on delivery)
  4.update order with set_paid = true (skip this step if payment type is cash on delivery)
  5.return response 
*/
exports.createAndCharge = async (req, res) => {
  const hasPaymentInfo = req.body.payment_method === 'square_credit_card';
  try {
    if (hasPaymentInfo) {
      var paymentResponse = await createPayment(req, res);
    }
    const orderWithPendingStatus = await createOrderWithPendingStatus(req, res);

    if (hasPaymentInfo) {
      await completePayment(paymentResponse);
      const orderWithPaidStatus = await updateOrderToPaidStatus(
        orderWithPendingStatus.data.id,
        paymentResponse.payment.id
      );
      res.status(orderWithPaidStatus.status).send(orderWithPaidStatus.data);
      return;
    }
    res.status(orderWithPendingStatus.status).send(orderWithPendingStatus.data);
  } catch (e) {
    console.log(e);
    switch (e.code) {
      case 'CREATE_PAYMENT_ERROR':
        sendPaymentErrorMessage(e.data, res);
        break;
      case 'CREATE_ORDER_ERROR':
        res.status(500).send();
        break;
      case 'COMPLETE_PAYMENT_ERROR':
        sendPaymentErrorMessage(e.data, res);
        break;
      case 'COMPLETE_ORDER_ERROR':
        res.status(200).send();
        break;
      default:
        response.status(500).send({
          errorMessage: 'Unknown temporary error; please try again;',
        });
        break;
    }
  }
};

const createPayment = async (req, res) => {
  const paymentRequest = {
    idempotency_key: crypto.randomBytes(12).toString('hex'),
    source_id: req.body.nonce,
    amount_money: {
      amount: req.body.amount,
      currency: 'CAD',
    },
    autocomplete: false,
  };

  return new Promise((resolve, reject) => {
    paymentsApi
      .createPayment(paymentRequest)
      .then((response) => resolve(response))
      .catch((e) => {
        delete e.response.req.headers;
        delete e.response.req._headers;
        const { errors } = JSON.parse(e.response.text);

        reject({ code: 'CREATE_PAYMENT_ERROR', data: errors });
      });
  });
};

const createOrderWithPendingStatus = async (req, res) => {
  const customerId = res.locals.isAuthenticated ? req.jwt.data.user.id : 0;

  const orderData = {
    ...req.body,
    customer_id: customerId,
    set_paid: false,
  };

  console.log(customerId, orderData.line_items, req.body.line_items);
  return new Promise((resolve, reject) => {
    wooCommerce
      .post(`orders`, orderData)
      .then((wooResponse) => {
        console.log(wooResponse.data);
        resolve(wooResponse);
      })
      .catch((error) => {
        reject({ code: 'CREATE_ORDER_ERROR', data: error });
      });
  });
};

const completePayment = async (paymentResponse) => {
  return new Promise((resolve, reject) => {
    paymentsApi
      .completePayment(paymentResponse.payment.id)
      .then(() => resolve())
      .catch((e) => {
        delete e.response.req.headers;
        delete e.response.req._headers;
        const { errors } = JSON.parse(e.response.text);

        reject({ code: 'COMPLETE_PAYMENT_ERROR', data: errors });
      });
  });
};

const updateOrderToPaidStatus = async (orderId, transactionId) => {
  return new Promise((resolve, reject) => {
    wooCommerce
      .put(`orders/${orderId}`, {
        set_paid: true,
        transaction_id: transactionId,
      })
      .then((wooResponse) => {
        resolve(wooResponse);
      })
      .catch((error) => {
        reject({ code: 'COMPLETE_ORDER_ERROR', data: error });
      });
  });
};

const sendPaymentErrorMessage = (errors, response) => {
  switch (errors[0].code) {
    case 'UNAUTHORIZED':
      response.status(401).send({
        errorMessage:
          'Server Not Authorized. Please check your server permission.',
      });
      break;
    case 'GENERIC_DECLINE':
      response.status(400).send({
        errorMessage: 'Card declined. Please re-enter card information.',
      });
      break;
    case 'CVV_FAILURE':
      response.status(400).send({
        errorMessage: 'Invalid CVV. Please re-enter card information.',
      });
      break;
    case 'ADDRESS_VERIFICATION_FAILURE':
      response.status(400).send({
        errorMessage: 'Invalid Postal Code. Please re-enter card information.',
      });
      break;
    case 'EXPIRATION_FAILURE':
      response.status(400).send({
        errorMessage:
          'Invalid expiration date. Please re-enter card information.',
      });
      break;
    case 'INSUFFICIENT_FUNDS':
      response.status(400).send({
        errorMessage:
          'Insufficient funds; Please try re-entering card details.',
      });
      break;
    case 'CARD_NOT_SUPPORTED':
      response.status(400).send({
        errorMessage:
          '	The card is not supported either in the geographic region or by the MCC; Please try re-entering card details.',
      });
      break;
    case 'PAYMENT_LIMIT_EXCEEDED':
      response.status(400).send({
        errorMessage:
          'Processing limit for this merchant; Please try re-entering card details.',
      });
      break;
    case 'TEMPORARY_ERROR':
      response.status(500).send({
        errorMessage: 'Unknown temporary error; please try again;',
      });
      break;
    default:
      response.status(400).send({
        errorMessage:
          'Payment error. Please contact support if issue persists.',
      });
      break;
  }
};
