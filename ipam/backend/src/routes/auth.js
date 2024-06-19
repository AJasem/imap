const dotenv = require("dotenv");

dotenv.config();

const authToken = process.env.authToken;

function auth(req, res, next) {
  const token = process.env.authToken;

  if (token === authToken) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = auth;
