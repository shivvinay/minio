// app/api/upload-url/route.ts

export const runtime = "nodejs"; // ✅ ADD THIS AT THE TOP

import { s3 } from "@/lib/minio";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
  const { fileName, fileType } = await req.json();
  const key = `${Date.now()}-${fileName}`;


  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.MINIO_BUCKET!,
      Key: key,
      ContentType: fileType,
    }),
    { expiresIn: 300 }
  );

  return new Response(
    JSON.stringify({ uploadUrl ,key }),
    { headers: { "Content-Type": "application/json" } }
  );
}
