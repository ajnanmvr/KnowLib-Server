const DataModel = require('../Models/dataModel');
const User = require('../Models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new data model
exports.createData = (req, res) => {
  const newData = new DataModel(req.body);

  newData.save()
    .then(() => {
      res.status(201).json(newData);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

// Read all data models
exports.getAllData = (req, res) => {
  DataModel.find()
    .then((data) => {
      res.json({
        count:data.length,
        data});
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Read a single data model by ID
exports.getDataById = (req, res) => {
  DataModel.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({ error: 'Data not found' });
      } else {
        res.json(data);
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Update a data model by ID
exports.updateData = (req, res) => {
  DataModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).json({ error: 'Data not found' });
      } else {
        res.json(data);
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

// Delete a data model by ID
exports.deleteData = (req, res) => {
  DataModel.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({ error: 'Data not found' });
      } else {
        res.json({ message: 'Data deleted' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  // Find the user by their username
  User.findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (!result) {
          return res.status(401).json({ error: 'Invalid password' });
        }

        // Authentication successful
        // Generate a JWT token
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY);

        // Set the token as a cookie in the response
        res.cookie('login_token', token, {
          httpOnly: true,
          secure: true,
        });

        res.status(200).json({ message: 'Sign in successful' });
      });
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};



exports.adminSignup = (req, res) => {
  const { username, password } = req.body;

  // Check if user with the same username already exists
  User.findOne({ username })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Generate a hash of the password using bcrypt
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Create a new user object
        const newUser = new User({ username, password: hashedPassword });

        // Save the new user to the database
        newUser.save()
          .then(() => {
            // Send a success response
            res.status(201).json({ message: 'User created successfully' });
          })
          .catch(error => {
            res.status(500).json({ error: `Error saving user to the database ${error}` });
          });
      });
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error' });
    });
};

