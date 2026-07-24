import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return Response.json({ message: "Unauthorized access" }, { status: 401 });
    }

    const { fileName, fileType } = await request.json();

    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return Response.json({ uploadUrl, key });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
