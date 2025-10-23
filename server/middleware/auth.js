const jwt = require("jsonwebtoken");

module.exports = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) return res.status(401).json({ msg: "No token, access denied" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ msg: "Access forbidden" });

      next();
    } catch (err) {
      res.status(401).json({ msg: "Invalid token" });
    }
  };
};
