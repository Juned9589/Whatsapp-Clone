import connectDB from "../../../../lib/db";
import User from "../../../../lib/models/User";
import { signupSchema } from "../../../../lib/validations/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password } = signupSchema.parse(body);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json(
        { message: "User Already Existing" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      {
        message: "User registered",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return Response.json({ message: "Signup failed" }, { status: 500 });
  }
}
