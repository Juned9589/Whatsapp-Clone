import connectDB from "@repo/database/db";
import { verifyAuth } from "@/lib/auth";
import User from "@repo/database/models/User";

export async function GET() {
  try {
    await connectDB();

    const auth = await verifyAuth();

    if (!auth) {
      return Response.json(
        { message: "Authentication Failed" },
        { status: 401 },
      );
    }
    const users = await User.find({
      _id: { $ne: (auth as any).userId },
    }).select("name email avatar");

    return Response.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Get users error", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
