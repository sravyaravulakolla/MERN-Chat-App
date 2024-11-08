const mongoose = require("mongoose");

const taskModel = mongoose.Schema({
  description: { type: String, required: true, trim: true },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dueDate: { type: Date, default: null },
  completed: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  phaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
    required: true,
  },
  order: { type: Number, required: true }, // to maintain task order within phase
});

const Task = mongoose.model("Task", taskModel);
module.exports = Task;
