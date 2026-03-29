const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const User = require("./models/User");
const Admin = require("./models/Admin");

// ---------------- CONFIG ----------------
const app = express();   // ✅ Moved here (before using app)
const PORT = process.env.PORT || 5000;

const MONGO_URI =
  "mongodb+srv://np03cs4a230023_db_user:EX3WRqttRHXIIiwB@cluster0.58dcap4.mongodb.net/pashminadb?retryWrites=true&w=majority&appName=Cluster0";

const JWT_SECRET = "PashminaEcom_VerySecretKey_ReplaceMe12345";
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

// ---------------- PRODUCT ROUTES ----------------
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// ---------------- ROUTER ----------------
const authRouter = express.Router();

/* ======================================================
   USER REGISTER
====================================================== */
authRouter.post("/signup", async (req, res) => {
  const { fullName, gender, age, email, password } = req.body;

  if (!email || !password || !fullName || !gender || !age) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
      message: "Registration successful!",
      token,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Server error during signup." });
  }
});

// LOGIN ROUTE
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'Invalid credentials. User not found.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials. Password incorrect.'
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // ✅ SEND USER DATA
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                gender: user.gender,
                age: user.age
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ======================================================
   ADMIN REGISTER
====================================================== */
authRouter.post("/admin/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password required." });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({
      message: "Admin registered successfully",
    });
  } catch (err) {
    console.error("Admin Register Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

/* ======================================================
   ADMIN LOGIN
====================================================== */
authRouter.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Invalid credentials. Admin not found." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials. Password incorrect." });
    }

    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
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
    res.status(500).json({ message: "Server error." });
  }
});

/* ======================================================
   USER CRUD
====================================================== */
authRouter.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Get User Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

authRouter.put("/user/:id", async (req, res) => {
  const { fullName, gender, age } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found." });

    if (fullName) user.fullName = fullName;
    if (gender) user.gender = gender;
    if (age) user.age = age;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      message: "User profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update User Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

authRouter.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found." });

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete User Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------------- ATTACH ROUTES ----------------
app.use(API_BASE_URL, authRouter);


app.use('/api', authRouter);
// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ---------------- START SERVER ----------------
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);