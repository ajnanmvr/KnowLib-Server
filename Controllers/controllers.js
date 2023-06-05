const DataModel = require('../Models/dataModel');

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
      res.json(data);
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

  // Check if username and password are valid
  if (username === "admin" && password === "dhiucmd") {
    // Admin login successful
    res.json({ message: "Admin login successful" });
  } else {
    // Invalid credentials
    res.status(401).json({ error: "Invalid credentials" });
  }
};

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are valid
  if (username === "admin" && password === "dhiucmd") {
    // Admin login successful
    res.json({ message: "Admin login successful" });
  } else {
    // Invalid credentials
    res.status(401).json({ error: "Invalid credentials" });
  }
};

