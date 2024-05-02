const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/User");

// ! Configuration Multer for file Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // store uploaded files in "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // use the original filename
  },
});

const upload = multer({ storage });

// ! User register
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    // Take all info from the form
    const { firstName, lastName, email, password } = req.body;

    // Uploaded file  is available as req.file
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    // path to the uploaded profile photo
    const profileImagePath = profileImage.path;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "User already exists!",
      });
    }

    /* Hass the password */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Create a new User */
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    /* Save the new User */
    await newUser.save();

    /* Send a successful message */
    res.status(200).json({
      status: "success",
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "fail",
      message: "Registration failed!",
      error: err.message,
    });
  }
});

module.exports = router;
