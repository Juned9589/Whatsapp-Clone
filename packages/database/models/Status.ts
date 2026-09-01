import mongoose, { Schema } from "mongoose";

const statusSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    viewers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Status || mongoose.model("Status", statusSchema);
