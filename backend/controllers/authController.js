const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check karo email already exist to nahi karta
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Password hash karo (plain text kabhi store nahi karte)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Naya user banao
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User dhundo email se
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Password compare karo (hashed wale se)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // JWT token banao
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }  // 7 din tak valid rahega
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { name, department } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.department = department || user.department;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login, updateProfile };

