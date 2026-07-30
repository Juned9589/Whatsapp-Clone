import { verifyAuth } from "@/lib/auth";
import connectDB from "@repo/database/db";
import Status from "@repo/database/models/Status";
import User from "@repo/database/models/User";

// export async function GET() {
//   try {
//     await connectDB();

//     const auth = await verifyAuth();

//     if (!auth) {
//       return Response.json(
//         { message: "Authentication Failed" },
//         { status: 401 },
//       );
//     }

//     const statuses = await Status.find({
//       expiresAt: { $gt: new Date() },
//     })
//       .populate("userId", "name avatar")
//       .sort({ createdAt: -1 });

//     return Response.json({ statuses }, { status: 200 });
//   } catch (error) {
//     console.error("Get statuses error:", error);

//     return Response.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }

export async function POST(
  request: Request,
  { params }: { params: Promise<{ statusId: string }> },
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

    const { statusId } = await params;

    const status = await Status.findById(statusId);

    if (!status) {
      return Response.json({ message: "Status not found" }, { status: 404 });
    }

    const userId = (auth as any).userId;

    if (!status.viewers.includes(userId)) {
      status.viewers.push(userId);
      await status.save();
    }

    return Response.json(
      { message: "Status viewed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
