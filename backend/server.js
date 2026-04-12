require("dotenv").config(); // ✅ ADD THIS AT TOP

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");

const User = require("./models/User");
const Admin = require("./models/Admin");

// ---------------- CONFIG ----------------
const app = express();
const PORT = process.env.PORT || 5000;

//  USE ENV VARIABLES (instead of hardcoding)
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const API_BASE_URL = "/api";

// ---------------- DATABASE ----------------
mongoose
  .connect(MONGO_URI, { family: 4 })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) =>
    console.error("MongoDB connection error. Check MONGO_URI:", err)
  );

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);

// ---------------- AUTH ROUTER ----------------
const authRouter = express.Router();

/* ================= USER REGISTER ================= */
authRouter.post("/signup", async (req, res) => {
  const { fullName, gender, age, email, password } = req.body;

  if (!email || !password || !fullName || !gender || !age) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      gender,
      age,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: "user" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= USER LOGIN ================= */
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "user" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      role: "user",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
        age: user.age,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADMIN LOGIN ================= */
authRouter.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      role: "admin",
      admin: {
        _id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Admin Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= USER PROFILE ================= */
authRouter.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

authRouter.put("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    Object.assign(user, req.body);
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

authRouter.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- ATTACH ROUTES ----------------
app.use(API_BASE_URL, authRouter);

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});