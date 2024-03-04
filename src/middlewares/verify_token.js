import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(403).json({ success: false, mess: "Require Login" });
  const accessToken = token.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS_TOKEN, (err, user) => {
    if (err) {
      const isChecked = err instanceof jwt.TokenExpiredError;
      if (!isChecked) {
        return res
          .status(403)
          .json({ success: false, mess: "Access Token Invalid" });
      } else {
        return res
          .status(403)
          .json({ success: false, mess: "Access Token Expired" });
      }
    }
    req.user = user;
    next();
  });
};

export default verifyToken;
