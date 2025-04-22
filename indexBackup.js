const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());
let lastId = 0;
let usersData = [];

app.post('/users', (req, res) => {
  const newUser = req.body;
  const register_token = uuidv4(); // Generate a unique UUID

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

  res.status(201).json({ message: 'User created successfully', user: newUser });
  console.log('Registered User:', newUser);
});

app.get('/users', (req, res) => {
  const { name, phoneNumber, email, id } = req.query;
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

app.put('/users', (req, res) => {
  const { id, ...updatedData } = req.body;
  
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
  
  res.status(200).json({ message: 'User updated successfully', user: usersData[userIndex] });
  console.log('Edited User:', req.body);
});


app.delete('/users', (req, res) => {
  const { id } = req.body;

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
  console.log('Deleted User:', usersData[userIndex])
});



const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});