const jwt = require('jsonwebtoken'),
  secret = require('../../common/config/env.config.js').jwt_secret,
  crypto = require('crypto');

exports.validJWTNeeded = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      let authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        return res.status(400).send({
          name: 'auth_error',
          message: 'Bad request',
        });
      } else {
        req.jwt = jwt.verify(authorization[1], secret);
        console.log('validation OK');
        return next();
      }
    } catch (err) {
      console.log('validation not  OK', err);
      return res.status(401).send({
        name: 'auth_error',
        message: 'Unauthenticated. Valid JWT needed',
      });
    }
  } else {
    console.log('bad request', req.headers);
    return res.status(400).send({
      name: 'auth_error',
      message: 'Bad request',
    });
  }
};

exports.isAuthenticated = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      let authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        res.locals.isAuthenticated = false;
        return next();
      } else {
        req.jwt = jwt.verify(authorization[1], secret);
        res.locals.isAuthenticated = true;
        return next();
      }
    } catch (err) {
      res.locals.isAuthenticated = false;
      return next();
    }
  } else {
    res.locals.isAuthenticated = false;
    return next();
  }
};

exports.hasAuthValidFields = (req, res, next) => {
  let errors = [];

  if (req.body) {
    if (!req.body.username) {
      errors.push('Missing username field');
    }
    if (!req.body.password) {
      errors.push('Missing password field');
    }

    if (errors.length) {
      return res
        .status(400)
        .send({ name: 'auth_error', message: errors.join(', ') });
    } else {
      return next();
    }
  } else {
    return res.send({ name: 'auth_error', message: errors.join(', ') });
  }
};
