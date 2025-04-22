const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
let lastId = 0;
let usersData = [];

router.post('/', async (req, res) => {
  const newUser = req.body;
  const register_token = uuidv4(); // Generate a unique UUID

   // Validate name (only alphabets)
   const nameRegex = /^[a-z A-Z]+$/;
   if (!nameRegex.test(newUser.name)) {
     return res.status(400).json({ error: 'Invalid name: Only alphabets allowed' });
   }
 
   // Validate phoneNumber (only numbers)
   const phoneNumberRegex = /^[0-9]{9,12}$/;
   if (!phoneNumberRegex.test(newUser.phoneNumber)) {
    if (newUser.phoneNumber.length < 9) {
      return res.status(400).json({ error: 'Phone number is too short (minimum 9 digits)' });
    } else if (newUser.phoneNumber.length > 12) {
      return res.status(400).json({ error: 'Phone number is too long (maximum 12 digits)' });
    } else {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }
  }
 
   // Validate email (using a more complex regex)
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(newUser.email)) {
     return res.status(400).json({ error: 'Invalid email format' });
   }

  // Validate the request data
  if (!newUser.name || !newUser.phoneNumber || !newUser.email || !newUser.password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Read existing users from the file (if it exists)
  try {
    const existingData = fs.readFileSync('users.json', 'utf8');
    usersData = JSON.parse(existingData);
  } catch (err) {
    // Ignore errors if the file doesn't exist
  }

  // Add the ID and register_token to the new user object
  newUser.id = ++lastId;
  newUser.register_token = register_token;

  // Append the new user to the array
  usersData.push(newUser);

  // Write the updated data (including new user) to the file
  fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2));

    // Create a response object without the password
    const responseUser = {
      id: newUser.id,
      name: newUser.name,
      phoneNumber: newUser.phoneNumber,
      email: newUser.email,
      register_token: newUser.register_token
      // Omit the password
    };

  res.status(201).json({ message: 'User created successfully', user: responseUser });
  console.log('Registered User:', newUser);
});

module.exports = router;