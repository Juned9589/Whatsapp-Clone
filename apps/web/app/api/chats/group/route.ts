import Chat from "@repo/database/models/Chat";
import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/db";

export async function POST(request: Request) {
  try {
    await connectDB();
    const auth = await verifyAuth();
    if (!auth) {
      return Response.json(
        { message: "Authorization Failed" },
        { status: 401 },
      );
    }
    const { groupName, memberIds } = await request.json();

    if (!groupName || !memberIds?.length) {
      return Response.json(
        { message: "Group name and members are required" },
        { status: 400 },
      );
    }

    const chat = await Chat.create({
      isGroup: true,
      groupName: groupName,
      members: [...memberIds, (auth as any).userId],
      groupAdmin: (auth as any).userId,
    });

    return Response.json({ chat }, { status: 201 });
  } catch (error) {
    console.error("Group creation error:", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
