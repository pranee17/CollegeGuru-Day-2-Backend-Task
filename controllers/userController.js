const User = require('../models/user');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, mobileNumber, stream, level, password } = req.body;

    const user = new User({
      name,
      email,
      mobileNumber,
      stream,
      level,
      password
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!', user });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(400).json({ message: 'Error registering user', error });
  }
};
