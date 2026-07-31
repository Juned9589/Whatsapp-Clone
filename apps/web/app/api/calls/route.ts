import connectDB from "@/lib/db";
import Call from "@/lib/models/Call";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const auth = await verifyAuth();

    if (!auth) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, duration, status, type } = await req.json();

    const call = await Call.create({
      caller: auth.userId,
      receiver: receiverId,
      duration,
      status,
      type,
    });

    return Response.json(call);
  } catch (error) {
    console.error(error);

    return Response.json({ message: "Failed to save call" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const auth = await verifyAuth();

    if (!auth) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const calls = await Call.find({
      $or: [{ caller: auth.userId }, { receiver: auth.userId }],
    })
      .populate("caller", "name image")
      .populate("receiver", "name image")
      .sort({ createdAt: -1 });

    return Response.json(calls);
  } catch (error) {
    console.error(error);

    return Response.json({ message: "Failed to fetch calls" }, { status: 500 });
  }
}
