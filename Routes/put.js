const express = require('express');
const fs = require('fs');

const router = express.Router();
let usersData = [];

router.put('/', (req, res) => {
  const { id, ...updatedData } = req.body;
  
  // Read existing users from the file (if it exists)
  try {
    const existingData = fs.readFileSync('users.json', 'utf8');
    usersData = JSON.parse(existingData);
  } catch (err) {
    // Ignore errors if the file doesn't exist
  }
  

  // Find the user index
  const userIndex = usersData.findIndex(user => user.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!id) {
    return res.status(400).json({ error: 'Missing required field: id' });
  }
  
  // Update the user's data
  usersData[userIndex] = {
    ...usersData[userIndex],
    ...updatedData,
  };
  
  // Write the updated data to the file
  fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2));
  
  res.status(201).json({ message: 'User updated successfully', user: usersData[userIndex] });
  console.log('Edited User:', req.body);
});

module.exports = router;