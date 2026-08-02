import connectDB from "@repo/database/db";
import { verifyAuth } from "@/lib/auth";
import Message from "@repo/database/models/Message";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    await connectDB();

    const auth = await verifyAuth();

    if (!auth) {
      return Response.json(
        { message: "Authentication Failed" },
        { status: 401 },
      );
    }

    const { chatId } = await params;

    const messages = await Message.find({ chatId })
      .populate("sender", "name image")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name image",
        },
      })
      .sort({ createdAt: 1 })
      .lean();

    return Response.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Get messages error:", error);

    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
