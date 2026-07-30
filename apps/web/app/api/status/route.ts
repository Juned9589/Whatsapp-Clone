import connectDB from "@repo/database/db";
import { verifyAuth } from "@/lib/auth";
import Status from "@repo/database/models/Status";
import User from "@repo/database/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();

    const auth = await verifyAuth();

    if (!auth) {
      return Response.json(
        { message: "Authentication Failed" },
        { status: 401 },
      );
    }
    const { mediaUrl, caption } = await request.json();

    // 24 Hours From Now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const status = await Status.create({
      userId: (auth as any).userId,
      mediaUrl,
      caption,
      expiresAt,
    });
    return Response.json({ status }, { status: 201 });
  } catch (error) {
    console.error("Create status error:", error);

    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}

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

    const statuses = await Status.find({
      expiresAt: { $gt: new Date() },
    }).populate("userId", "name avatar");

    return Response.json({ statuses }, { status: 200 });
  } catch (error) {
    console.error("Get statuses error:", error);

    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
