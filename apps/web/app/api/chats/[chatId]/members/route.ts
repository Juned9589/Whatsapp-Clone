import connectDB from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import Chat from "@repo/database/models/Chat";

export async function PATCH(
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
    const { action, memberId } = await request.json();
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return Response.json({ message: "Chat not found" }, { status: 404 });
    }
    if (chat.groupAdmin.toString() !== (auth as any).userId) {
      return Response.json(
        { message: "Only admin can manage members" },
        { status: 403 },
      );
    }
    if (action === "add") {
      chat.members.push(memberId);
    } else if (action === "remove") {
      chat.members = chat.members.filter((m: any) => m.toString() !== memberId);
    } else {
      return Response.json({ message: "Invalid action" }, { status: 400 });
    }
    await chat.save();
    return Response.json({ chat }, { status: 200 });
  } catch (error) {
    console.error(error);

    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
