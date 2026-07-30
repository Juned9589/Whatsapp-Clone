// import connectDB from "@repo/database/db";
// import { verifyAuth } from "@/lib/auth";
// import Status from "@repo/database/models/Status";

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ statusId: string }> },
// ) {
//   try {
//     await connectDB();
//     const auth = await verifyAuth();

//     if (!auth) {
//       return Response.json(
//         { message: "Authentication Failed" },
//         { status: 401 },
//       );
//     }

//     const { statusId } = await params;
//     const status = await Status.findById(statusId);

//     if (!status) {
//       return Response.json({ message: "Status not found" }, { status: 404 });
//     }

//     if (!status.viewers.includes((auth as any).userId)) {
//       status.viewers.push((auth as any).userId);
//       await status.save();
//     }

//     return Response.json({ status });
//   } catch (error) {
//     console.error("View status error:", error);
//     return Response.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }

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
      .sort({ createdAt: 1 })
      .lean();

    return Response.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Get messages error:", error);

    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
