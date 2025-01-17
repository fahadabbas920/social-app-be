const asyncWrapper = require("../utilities/wrapper");
const User = require("../models/users")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = asyncWrapper(async (req, res) => {
    const { username, password, role } = req.body;

    if (!['Super Admin', 'Admin', 'User'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    if (role === 'Super Admin') {
      const superAdminExists = await User.findOne({ role: 'Super Admin' });
      if (superAdminExists) {
        return res.status(403).json({ message: 'Super Admin already exists.' });
      }
    }

    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
})

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful.', token });
}



module.exports = { registerUser, loginUser };