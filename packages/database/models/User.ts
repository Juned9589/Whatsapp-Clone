import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "offline",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isAI: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default models.User || model("User", userSchema);
