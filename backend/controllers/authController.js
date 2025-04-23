const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Customer = require("../models/Customer");
const Owner = require("../models/Owner");
const Realtor = require("../models/Realtor");

// Admin Login
exports.adminLogin = async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminId }).select("+password");
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    // const isMatch = await bcrypt.compare(password, admin.password);
    const isMatch = password == admin.password;
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        adminId: admin.adminId,
        name: admin.name,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic User Login (Customer/Owner/Realtor)
exports.userLogin = (model, role) => async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await model.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Check approval status for Owners/Realtors
    if (user.status && user.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Account pending admin approval" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userData = user.toObject();
    delete userData.password;

    res.json({
      token,
      user: {
        ...userData,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic User Signup (Customer/Owner/Realtor)
exports.userSignup = (model, role) => async (req, res) => {
  const {
    email,
    password,
    phone,
    name,
    dob,
    occupation,
    annualIncome,
    address,
    SSN,
  } = req.body;

  try {
    // Check if email already exists in the collection
    const existingUser = await model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, password",
      });
    }

    // Build new user object
    const newUserData = {
      email,
      password: await bcrypt.hash(password, 10),
      phone: phone || "",
      name,
      ...(SSN && ["owner", "customer"].includes(role) && { SSN: SSN }),
    };

    if (role == "customer" || role == "owner") {
      newUserData.dob = dob;
      newUserData.occupation = occupation;
      newUserData.annualIncome = annualIncome;
      newUserData.address = address;
    }

    // Set status to pending for privileged roles
    if (["owner", "realtor"].includes(role)) {
      newUserData.status = "pending";
    }

    // Create and save the user
    const newUser = await model.create(newUserData);

    // For roles requiring approval, don't return token
    if (["owner", "realtor"].includes(role)) {
      return res.status(201).json({
        message: "Account created. Pending admin approval.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role,
        },
      });
    }

    // Else, issue token for customer
    const token = jwt.sign({ id: newUser._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
