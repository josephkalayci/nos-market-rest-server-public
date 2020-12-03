class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Auth Error';
  }
}

module.exports = {
  AuthError,
};
