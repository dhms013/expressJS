const express = require('express');
const fs = require('fs');

const router = express.Router();
let usersData = [];

router.delete('/', (req, res) => {
  const { id } = req.body;
  
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

  // Remove the user from the array
  usersData.splice(userIndex, 1);

  // Write the updated data to the file
  fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2));

  res.status(200).json({ message: 'User deleted successfully' });
  console.log('Deleted Id:', id)
});

module.exports = router;