const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  const { name, phoneNumber, email, id } = req.query;

  // Read existing users from the file (if it exists)
  let usersData = [];
  try {
    const existingData = fs.readFileSync('users.json', 'utf8');
    usersData = JSON.parse(existingData);
  } catch (err) {
    // Ignore errors if the file doesn't exist
  }

  // Check if no parameters are provided
  if (!name && !phoneNumber && !email && !id) {
    // If no parameters, return all users as a single object
    const usersWithoutPasswords = usersData.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    return res.status(200).json({ message: 'Retrieved all data', users: usersWithoutPasswords });
  }

  // Filter based on query parameters (as before)
  let filteredUsers = usersData.filter(user =>
    (name ? user.name.toLowerCase() === name.toLowerCase() : true) &&
    (phoneNumber ? user.phoneNumber === phoneNumber : true) &&
    (email ? user.email.toLowerCase() === email.toLowerCase() : true) &&
    (id ? user.id === parseInt(id) : true)
  );

  // Handle the case of no users found
  if (filteredUsers.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Handle the case of a single user found
  if (filteredUsers.length === 1) {
    const user = filteredUsers[0];
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json({ message: 'Retrieved data', user: userWithoutPassword });
  }

  // Handle the case of multiple users found
  const usersWithoutPasswords = filteredUsers.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  return res.status(200).json({ message: 'Retrieved data', users: usersWithoutPasswords });
});

module.exports = router;