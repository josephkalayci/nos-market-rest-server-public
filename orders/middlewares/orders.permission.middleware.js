exports.onlySameUserCanDoThisAction = (req, res, next) => {
  let userId = req.jwt.data.user.id;

  if (req.query.customer == userId) {
    return next();
  } else {
    return res.status(403).send({
      name: 'auth_error',
      message: 'Unauthorized',
    });
  }
};
