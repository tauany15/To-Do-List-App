const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

// Home route
router.get("/", todoController.getDefaultList);

// About page
router.get("/about", todoController.getAboutPage);

// Add item
router.post("/add", todoController.addItem);

// Delete item
router.post("/delete", todoController.deleteItem);

// Update item (new feature)
router.post("/update", todoController.updateItem);

// Mark item as complete/incomplete (new feature)
router.post("/toggle", todoController.toggleItem);

// Custom list routes - MUST BE LAST!
router.get("/:customListName", todoController.getCustomList);

module.exports = router;