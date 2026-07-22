import mongoose, { Schema, model, models } from "mongoose";

const chatSchema = new Schema(
  {
    isGroup: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    groupName: {
      type: String,
      default: "",
    },
    groupAvatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default models.Chat || model("Chat", chatSchema);
