const axios = require('axios');

exports.login = (req, res) => {
  var config = {
    method: 'post',
    url: 'https://testnos.nosmarket.ca/wp-json/jwt-auth/v1/token',
    headers: {},
    data: {
      username: req.body.username,
      password: req.body.password,
    },
  };

  axios(config)
    .then(function (response) {
      //res.status(response.status).send(response.data);
      if (response.data.success) {
        res.status(response.status).send(response.data.data);
      } else {
        res.status(response.data.statusCode).send({
          name: 'auth_error',
          message: 'Incorrect username or password',
        });
      }
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
};
