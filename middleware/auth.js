const jwt = require("jsonwebtoken");
const User = require("../models/User");

const UnAuthenticatedError = require("../errors/unauthenticated");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication invalid!");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: payload.userId });
    if (!user) {
      throw new UnAuthenticatedError("Invalid Credentials");
    }
    req.user = payload;
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication invalid!");
  }
};

module.exports = auth;
