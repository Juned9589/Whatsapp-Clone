import connectDB from "../../../../lib/db";
import User from "../../../../lib/models/User";
import { verifyAuth } from "../../../../lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();
    const decoded = await verifyAuth();

    if (decoded === null) {
      return Response.json({ message: "unauthorized " }, { status: 401 });
    }
    const userExist = await User.findById((decoded as any).userId).select(
      "-password",
    );

    if (!userExist) {
      return Response.json({ message: "user not found" }, { status: 404 });
    }

    return Response.json({ userExist });
  } catch (error) {
    console.log("Me route error", error);
    return Response.json({ message: "Something Went Wrong " }, { status: 500 });
  }
}
