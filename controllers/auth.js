const asyncWrapper = require("../utilities/wrapper");
const User = require("../models/users")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = asyncWrapper(async (req, res) => {
  const { username, password, role } = req.body;
  const { user } = req;

  if (!['Super Admin', 'Admin', 'User'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists.' });
  }

  if (role === 'Super Admin') {
    if (user?.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Only a Super Admin can create a Super Admin.' });
    }

    const superAdminExists = await User.findOne({ role: 'Super Admin' });
    if (superAdminExists) {
      return res.status(403).json({ message: 'Super Admin already exists.' });
    }
  } else if (role === 'Admin') {
    if (user?.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Only a Super Admin can create Admin accounts.' });
    }
  } else if (role === 'User') {
    if (!['Super Admin', 'Admin'].includes(user?.role)) {
      return res.status(403).json({ message: 'Only Admin or Super Admin can create User accounts.' });
    }
  }

  const newUser = new User({ username, password, role });
  await newUser.save();

  res.status(201).json({ message: `${role} registered successfully.` });
});

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