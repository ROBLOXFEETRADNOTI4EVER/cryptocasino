import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import axios from "axios";
import path from "path";
import fs from "fs";
import { type } from "os";

dotenv.config();

const app = express();
const port = 4002;

app.use(cors());
app.use(express.json());

// makeing sure uplods directory exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/myDatabase"; 

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

  const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rank: { type: String, default: "User" },
    bitcoinnumb: { type: Number, default: 0},
      bitcoinAdress: { type: String, unique: true,default: "No adress generated"},
    etheriumnumb: { type: Number, default: 0},
      etheriumAdress: { type: String, unique: true, default: "No adress generated"},
    litecoinNumb: { type: Number, default: 0},
      litecoinAdress: { type: String, unique: true ,default: "No adress generated"},
    userWarnings: { type: Number, default: 0},
    transactionHistory: {type: String, default: "No transactions"},
    profilePicture: String,
    createdAt: { type: Date, default: Date.now }
  });
const User = mongoose.model("User", UserSchema);

// need to have a main wallet ! and from it user gets a wallet (like main wallet but creat (fake own wallets from it) like main wallet and server only chekcs if for user generated wallet witch is a sending adress only if crypto comes to that adress or sent to THAT adress the user who owns the wallet gets their number updated !! MAKE SURE IT CAN'T BE MANIPULATED MAKE IT SAFE !!)
    app.post("/api/auth/transactions", async (req, res) =>{
      // to do make users get their transatcion history displayed
    });

    app.post("/api/auth/GenerateBtcadress", async (req, res) =>{
      // to do make users get their transatcion history displayed
    });

    app.post("/api/auth/GenerateEthadress", async (req, res) =>{
      // to do make users get their transatcion history displayed
    });
    app.post("/api/auth/GenerateLtcadress", async (req, res) =>{
      // to do make users get their transatcion history displayed
    });

// [)------------------------------------------------------------------------------------------(]
// get Data for admin Dashboard
    app.get("/api/stats/total-users", async (req, res) => {
      try {
        const totalUsers = await User.countDocuments(); //
        res.json({ totalUsers });
      } catch (error) {
        console.error("Error fetching total users:", error);
        res.status(500).json({ error: "Server error while fetching total users" });
      }
    });

    app.get("/api/stats/online-today", async (req, res) => {
      try {
        // Set the start of the current day
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
    
        // counting the users who logged in since the  timer 
        const onlineToday = await User.countDocuments({ lastLogin: { $gte: startOfToday } });
    
        // returing the count with a json fromat
        res.json({ onlineToday });
      } catch (error) {
        console.error("Error fetching users online today:", error);
        res.status(500).json({ error: "Server error while fetching online users" });
      }
    });
// [)------------------------------------------------------------------------------------------(]


app.post("/api/auth/admin-login", async (req, res) => {
  const { username, password, captcha } = req.body;

  try {
      if (captcha) {
          const captchaVerification = await axios.post(
              "https://hcaptcha.com/siteverify",
              null,
              {
                  params: {
                      secret: process.env.HCAPTCHA_SECRET_KEY,
                      response: captcha,
                  },
              }
          );

          if (!captchaVerification.data.success) {
              return res.status(403).json({ isAdmin: false, message: "CAPTCHA validation failed." });
          }
      }

      const user = await User.findOne({ username });
      if (!user || user.rank !== "Admin") {
          return res.status(403).json({ isAdmin: false, message: "Access denied." });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
          return res.status(403).json({ isAdmin: false, message: "Invalid password." });
      }

      res.json({ isAdmin: true, userId: user._id });
  } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Server error" });
  }
});
app.get("/api/verify-admin/:id", async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user || user.rank !== "Admin") {
          return res.status(403).json({ isAdmin: false, message: "Access denied." });
      }

      res.json({ isAdmin: true });
  } catch (error) {
      console.error("Error verifying admin:", error);
      res.status(500).json({ error: "Server error" });
  }
});





app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ error: "Email already in use" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ error: "Username already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ username, email });
    if (!user) return res.status(400).json({ error: "Invalid username or email" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(400).json({ error: "Invalid password" });

    res.status(200).json({ message: "Login successful", username: user.username, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'username profilePicture rank');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ username: user.username, profilePicture: user.profilePicture, rank: user.rank });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /jpg|jpeg|gif|png/;
    const mimetype = filetypes.test(file.mimetype.toLowerCase());
    const extnameCheck = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extnameCheck) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type! Only JPG and PNG are allowed.'));
  }
});

// uoploadgin profiple pcute
app.post("/upload", upload.single('profilePicture'), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).send('userId is required');

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // seve file palth iin mongo db
    user.profilePicture = req.file.path;
    await user.save();

    res.status(200).send('Profile picture uploaded successfully!');
  } catch (err) {
    console.error(err);
    // if i get this hsit multer rejcted and saved my ass
    res.status(500).send(err.message);
  }
});

app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
