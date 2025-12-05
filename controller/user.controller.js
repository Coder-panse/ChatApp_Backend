import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const image = req.file.filename;

    const user = await User.findOne({ email });

    if (user) return res.send("User Already Exist");

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const user = await User.create({
          username,
          email,
          password: hash,
          image,
        });
        const userToken = jwt.sign({ email }, "secret");

        res
          .status(200)
          .cookie("userToken", userToken, {
            httpOnly: true,
            secure: true, // if using HTTPS on Render
            sameSite: "none", // important for Render cross-site cookies
          })
          .json({ user });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something Went wrong" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send("User Not Found");

    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) return res.status(400).json({ msg: "Password Incorrect" });

      const userToken = jwt.sign({ email }, "secret");

      return res.status(200).cookie("userToken", userToken).json({ user });
    });
  } catch (error) {
    return res.status(400).json({ msg: "Failed" });
  }
};

export const Logout = async (req, res) => {
  res.cookie("userToken", "").json({ msg: "Logout" });
};

export const updateProfile = (req, res) => {
  console.log(req.body);
  console.log(req.file);
};
