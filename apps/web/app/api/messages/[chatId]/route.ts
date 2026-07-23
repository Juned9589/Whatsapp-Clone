import { verifyAuth } from "@/lib/auth";
import Message from "@/lib/models/Message";
import connectDB from "@repo/database/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    await connectDB();
    const auth = await verifyAuth();

    if (!auth) {
      return Response.json({ message: "Not Authenticated" }, { status: 401 });
    }
    const { chatId } = await params;
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    return Response.json({ messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return Response.json({ message: "Something went wrong " }, { status: 500 });
  }
}
