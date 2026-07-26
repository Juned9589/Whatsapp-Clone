import { verifyAuth } from "@/lib/auth";
import connectDB from "@repo/database/db";
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

    const { groupName, groupAvatar } = await request.json();
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return Response.json({ message: "Chat not found" }, { status: 404 });
    }
    if (chat.groupAdmin.toString() !== (auth as any).userId) {
      return Response.json(
        { message: "Only admin can update group details" },
        { status: 403 },
      );
    }
    if (groupName) {
      chat.groupName = groupName;
    }
    if (groupAvatar) {
      chat.groupAvatar = groupAvatar;
    }
    await chat.save();
    return Response.json(
      {
        message: "Group updated successfully",
        chat,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Group update error", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
