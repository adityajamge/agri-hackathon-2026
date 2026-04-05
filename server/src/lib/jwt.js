const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function signAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );
}

function verifyAuthToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

module.exports = {
  signAuthToken,
  verifyAuthToken,
};
