import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.json({ message: "Logged Out Successfully" });
  response.cookies.set("token", "", { maxAge: 0 });
  return response;
}
