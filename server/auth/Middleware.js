const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");


const auth = (requiredRole = null) => {
  return (req, res, next) => {
    try {
      let token = req.header("Authorization")
      if (!token) {
        return res.status(401).send({ error: "Access denied . No token provided" });
      }
      token = token.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET,(err, decoded) => {
        if (err) {
          return res.status(401).send({ error: "Invalid token" });
        }else{
          console.log(decoded)
          req.user = decoded;

          if(requiredRole && decoded.role !== requiredRole){
            return res.status(403).json({ 
            message: 'Access denied. Insufficient permissions.' 
            });
          }

          next();
        }
      });
  
    } catch (error) {
      res.status(401).send({ error: "Please authenticate." });
    }
  };
}


module.exports = auth;