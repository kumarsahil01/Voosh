const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  console.log("middleware");
  const token = req.cookies.acessToken; 

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.user.id;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized token." });
    }
  } else if (req.isAuthenticated()) { 
    if (req.user && req.user.id) {
      req.userId = req.user.id; 
      return next();
    }
  }

  return res.status(401).json({ message: "Login to get the details" });
};
 
 module.exports = verifyToken;