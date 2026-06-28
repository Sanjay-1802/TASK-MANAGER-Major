const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
{
title: {
type: String,
required: [true, "Task title is required"],
trim: true,
},


description: {
  type: String,
  required: [true, "Task description is required"],
  trim: true,
},

status: {
  type: String,
  enum: ["pending", "completed"],
  default: "pending",
},

priority: {
  type: String,
  enum: ["Low", "Medium", "High"],
  default: "Medium",
},

dueDate: {
  type: Date,
  default: null,
},


},
{
timestamps: true,
}
);

module.exports = mongoose.model("Task", taskSchema);
