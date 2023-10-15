const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const path=require('path')
require('dotenv').config()


const app = express();
const port = process.env.PORT;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });



//Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Add a new user
app.post('/api/users/add', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});
// Update a user by ID
app.put('/api/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ error: 'Bad request' });
    }
  });

  // Delete a user by ID (DELETE)
app.delete('/api/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndRemove(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(400).json({ error: 'Bad request' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
