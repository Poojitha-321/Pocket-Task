const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// Sample data
let services = require('./data/services.json');
let users = require('./data/users.json');

// Routes
app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Don't send password to client
    const { password, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      user: userWithoutPassword,
      message: 'Login successful'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'User already exists' 
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    coins: 5, // Starting coins
    joinDate: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Don't send password to client
  const { password: pwd, ...userWithoutPassword } = newUser;
  
  res.status(201).json({ 
    success: true, 
    user: userWithoutPassword,
    message: 'Registration successful'
  });
});

// AI Assistant endpoint
app.post('/api/assistant', (req, res) => {
  const { query } = req.body;
  
  // Simple AI response logic
  let response = "I'm your PocketTask AI assistant. How can I help you find services today?";
  
  if (query.toLowerCase().includes('service')) {
    response = "We offer various services including teaching, healthcare, housing, and more. What specific service are you looking for?";
  } else if (query.toLowerCase().includes('price') || query.toLowerCase().includes('cost')) {
    response = "Prices vary by service provider. You can view detailed pricing on each service page.";
  } else if (query.toLowerCase().includes('help')) {
    response = "I can help you find services, answer questions about PocketTask, or connect you with professionals.";
  }
  
  res.json({ response });
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});