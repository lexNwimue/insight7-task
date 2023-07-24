import jwt from "jsonwebtoken";
import { User } from "../model/User.mjs";

// Middleware for ensuring protected routes are only accessed by logged in users.
export const verifyLogin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (typeof token == "undefined")
    return res.status(401).json({ err: "Please login first" });
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ err: "Please login first" });
      } else if (decodedToken) {
        // Get user from decodedToken
        User.findOne({ phoneNumber: decodedToken.id })
          .then((user) => {
            if (!user) {
              return res.status(401).json({ err: "Please Login First" });
            } else {
              req.user = user;
              next();
            }
          })
          .catch((err) => {
            console.error(err);
            res
              .status(500)
              .json({ err: "Some error occurred while authenticating user" });
          });
      }
    });
  } else {
    res.status(401).json({ err: "Please Login First" });
  }
};
