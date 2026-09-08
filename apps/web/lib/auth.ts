import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

interface AuthPayload extends JwtPayload {
  userId: string;
}

export async function verifyAuth(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "string" || !decoded.userId) {
      return null;
    }

    return decoded as AuthPayload;
  } catch (error) {
    return null;
  }
}
