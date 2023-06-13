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

  // Find the user by username in the database
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }

        if (!result) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token with a secret key from the environment variable and expiration time
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: '24h', // Token expires in 24 hours
        });

        // Send the token in a cookie with an expiration time
        res.cookie('token', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true });

        // Send a success response
        res.status(200).json({ status: 'success' });
      });
    })
    .catch((error) => {
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

