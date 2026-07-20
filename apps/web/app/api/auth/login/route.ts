import bcrypt from "bcryptjs";
import connectDB from "../../../../lib/db";
import User from "../../../../lib/models/User";
import { loginSchema } from "../../../../lib/validations/auth";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return Response.json({ message: "Invalid Credentials" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return Response.json({ message: "Invalid Credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({
      message: "Login Successful",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ message: "Login Failed" }, { status: 500 });
  }
}
