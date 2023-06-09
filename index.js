const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const controllers = require("./Controllers/controllers");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser')

require("dotenv").config();
app.use(cors({
  origin: ['https://knowlib.vercel.app','http://localhost:3000', ],
  credentials: true
}));

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.set("strictQuery", false);

// Connect to the MongoDB database
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Define the CRUD routes
app.get("/", (req, res) => {
  res.send("Welcome to the API homepage!");
});

// Create a new data model
app.post("/data", controllers.createData);

// Read all data models
app.get("/data", controllers.getAllData);

// Read a single data model by ID
app.get("/data/:id", controllers.getDataById);

// Update a data model by ID
app.put("/data/:id", controllers.updateData);

// Delete a data model by ID
app.delete("/data/:id", controllers.deleteData);
app.post("/login", controllers.adminLogin);
app.post("/register", controllers.adminSignup);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
