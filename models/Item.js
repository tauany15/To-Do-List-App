const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
    maxlength: [200, "Item name cannot exceed 200 characters"]
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
itemSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Item", itemSchema);