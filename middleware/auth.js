import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isLoggedIn = async (req, res, next) => {
  if (!req.cookies.userToken) return res.send("/login");
  if (req.cookies.userToken == "") return res.send("/login");
  else {
    try {
        const token = req.cookies.userToken;
      // Verify token
      const decoded = jwt.verify(token, "secret");

      // Find user
      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(401).json({ msg: "User does not exist" });
      }

      req.user = user;
      return next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ msg: "Unauthorized User" });
    }
  }
};
