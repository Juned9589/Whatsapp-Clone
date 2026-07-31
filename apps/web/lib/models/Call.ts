import mongoose, { Schema, models, model } from "mongoose";

const CallSchema = new Schema(
  {
    caller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["audio", "video"],
      default: "video",
    },
    status: {
      type: String,
      enum: ["answered", "missed", "rejected"],
      default: "answered",
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default models.Call || model("Call", CallSchema);
