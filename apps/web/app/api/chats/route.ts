import Chat from "@/lib/models/Chat";
import { verifyAuth } from "@/lib/auth";
import connectDB from "@repo/database/db";

export async function POST(request: Request) {
  try {
    await connectDB();
    const auth = await verifyAuth();

    if (!auth) {
      return Response.json({ message: "Not Authenticated" }, { status: 401 });
    }

    const { receiverId } = await request.json();

    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [(auth as any).userId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        isGroup: false,
        members: [(auth as any).userId, receiverId],
      });
    }

    return Response.json({ chat });
  } catch (error) {
    console.error("Chat creation error:", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const auth = await verifyAuth();

    if (!auth) {
      return Response.json({ message: "Not Authenticated" }, { status: 401 });
    }

    const chats = await Chat.find({ members: (auth as any).userId }).populate(
      "members",
      "name avatar status",
    );

    return Response.json({ chats });
  } catch (error) {
    console.error("Fetch chats error:", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
