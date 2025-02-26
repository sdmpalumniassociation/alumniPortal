const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint to save user data
app.post('/api/register', (req, res) => {
  const userData = req.body;
  const filePath = path.join(__dirname, '../src/assets/data/Users.json');

  // Read existing users
  fs.readFile(filePath, 'utf8', (err, data) => {
    let users = [];
    if (!err) {
      users = JSON.parse(data);
    }

    // Add new user
    users.push(userData);

    // Write back to file
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'Error saving user data' });
      } else {
        res.json({ message: 'Registration successful' });
      }
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 