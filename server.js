import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

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
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: String,
    createdAt: { type: Date, default: Date.now }
  });
const User = mongoose.model("User", UserSchema);

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
    const user = await User.findById(req.params.id, 'username profilePicture');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ username: user.username, profilePicture: user.profilePicture });
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
