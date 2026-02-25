import bcrypt from "bcryptjs";
import User from "../models/user.js";


// ✅ Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Signup successful",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id;

    res.status(200).json({
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Logout
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
};