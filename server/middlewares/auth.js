const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) return res.status(401).send("No token provided with request.");

  try {
    let decoded = jwt.verify(token, "noZNVF&_5xBpr1JgJr+37+n}2f[1@@");

    if (!decoded) return res.status(401).send("Unauthorized request");

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send("Unauthorized request");
  }
};

module.exports = verifyToken;
