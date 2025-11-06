const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "List name is required"],
    unique: true,
    trim: true,
    maxlength: [50, "List name cannot exceed 50 characters"]
  },
  items: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster lookups
listSchema.index({ name: 1 });

module.exports = mongoose.model("List", listSchema);