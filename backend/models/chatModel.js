const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  description: { type: String, required: true, trim: true },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Ensure tasks are assigned to users within the group
  },
  dueDate: { type: Date, default: null },
  completed: { type: Boolean, default: false },
});

const phaseSchema = mongoose.Schema({
  phaseName: { type: String, required: true, trim: true },
  tasks: [taskSchema], // Array of tasks within each phase
});

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    meetingId: {
      type: String,
      default: null,
    },
    joinUrl: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    phases: [phaseSchema], // Array of phases with associated tasks
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;
