const express = require('express');
const fs = require('fs');

const router = express.Router();
let usersData = [];

router.get('/', (req, res) => {
  const { name, phoneNumber, email, id } = req.query;
  
  // Read existing users from the file (if it exists)
  try {
    const existingData = fs.readFileSync('users.json', 'utf8');
    usersData = JSON.parse(existingData);
  } catch (err) {
    // Ignore errors if the file doesn't exist
  }
  
  let filteredUsers = usersData;
  
  // Filter based on query parameters (combined with logical OR for flexibility)
  if (name || phoneNumber || email || id) {
    filteredUsers = filteredUsers.filter(user =>
      (name ? user.name.toLowerCase().includes(name.toLowerCase()) : true) &&
      (phoneNumber ? user.phoneNumber.includes(phoneNumber) : true) &&
      (email ? user.email.toLowerCase().includes(email.toLowerCase()) : true) &&
      (id ? user.id === parseInt(id) : true)
    );
  }

  res.status(200).json({message: 'Retrieved data', filteredUsers})
  console.log('Find User:', filteredUsers)
});

module.exports = router;