const express = require("express");
const router = express.Router();
const DataModel = require("../Models/dataModel"); // Replace with the actual path to your DataModel file
const { protect, isAdmin } = require("../utils/authMiddleware");
const mongoose=require('mongoose')

// Create a new data model
router.post("/", protect, isAdmin, async (req, res, next) => {
  try {
    const newData = await DataModel.create({ ...req.body, published: true });
    res.status(201).json(newData);
  } catch (error) {
    next(error);
  }
});
router.post("/suggest", async (req, res, next) => {
  try {
    const newData = await DataModel.create({ ...req.body });
    res.status(201).json(newData);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let query = { published: true };

    if (req.query.category && req.query.category !== "all") {
      // Assuming req.query.category is the ObjectId for the category
      query.category = mongoose.Types.ObjectId(req.query.category);
    }

    const data = await DataModel.find(query).sort("-createdAt");
    res.json({
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/type/suggestion", async (req, res, next) => {
  try {
    const data = await DataModel.find({ published: false }).sort("-createdAt");
    res.json({
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// Read a single data model by ID
router.get("/:id", async (req, res, next) => {
  try {
    const data = await DataModel.findById(req.params.id);
    if (!data) {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.json(data);
    }
  } catch (error) {
    next(error);
  }
});

// Update a data model by ID
router.patch("/:id", protect, isAdmin, async (req, res, next) => {
  try {
    const data = await DataModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.json(data);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a data model by ID
router.delete("/:id", protect, isAdmin, async (req, res, next) => {
  try {
    const data = await DataModel.findByIdAndRemove(req.params.id);
    if (!data) {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.json({ message: "Data deleted" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
