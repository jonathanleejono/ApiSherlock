import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    ticketTitle: {
      type: String,
      required: [true, "Please provide ticket title"],
      maxlength: 100,
    },
    ticketDescription: {
      type: String,
      required: [true, "Please provide ticket description"],
      maxlength: 1000,
    },
    ticketDueDate: {
      type: String,
      required: [true, "Please provide ticket due date"],
      maxlength: 50,
    },
    ticketAssignees: {
      type: String,
      required: [true, "Please provide ticket assignees"],
      maxlength: 100,
    },
    ticketStatus: {
      type: String,
      enum: ["Open", "Pending", "Done"],
      default: "Open",
    },
    ticketPriority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "High",
    },
    ticketType: {
      type: String,
      enum: ["Issue", "Bug", "Feature Request"],
      default: "Issue",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", TicketSchema);
