import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  authenticateRequest,
  unauthorizedResponse,
} from "@/utils/api-middleware";
import { Hono } from "hono";
import { Env } from "@/types/env";
import { env } from "hono/adapter";

const uploadRoutes = new Hono();

// Generate a presigned URL for uploading to R2
uploadRoutes.get("/presigned", async (c) => {
  // Authenticate the request
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, CLOUDFLARE_ACCOUNT_ID, R2_BUCKET_NAME, R2_PUBLIC_URL } = env<Env>(c);
    const { fileName, contentType } = c.req.query();

    if (!fileName || !contentType) {
      return c.json({ error: "fileName and contentType are required" }, 400);
    }

    // Initialize S3 client for R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || "",
        secretAccessKey: R2_SECRET_ACCESS_KEY || "",
      },
    });

    // Create a unique file name to prevent overwriting
    const uniqueFileName = `${auth.userId}/${Date.now()}-${fileName}`;

    // Create the command for putting an object in the bucket
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: contentType,
    });

    // Generate the presigned URL
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    // Calculate the public URL for the uploaded file
    const publicUrl = `${R2_PUBLIC_URL}/${uniqueFileName}`;

    return c.json({
      url: presignedUrl,
      publicUrl: publicUrl,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return c.json({ error: "Failed to generate upload URL" }, 500);
  }
});

// Delete an object from R2
uploadRoutes.delete("/delete", async (c) => {
  // Authenticate the request
  const auth = await authenticateRequest(c);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, CLOUDFLARE_ACCOUNT_ID, R2_BUCKET_NAME } = env<Env>(c);
    const { objectKey } = c.req.query();

    if (!objectKey) {
      return c.json({ error: "objectKey is required" }, 400);
    }

    // Security check: Ensure the object key starts with the user's ID
    // This prevents users from deleting other users' images
    if (!objectKey.startsWith(`${auth.userId}/`)) {
      return c.json(
        { error: "Unauthorized: You can only delete your own images" },
        403
      );
    }

    // Initialize S3 client for R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || "",
        secretAccessKey: R2_SECRET_ACCESS_KEY || "",
      },
    });

    // Create the command for deleting an object from the bucket
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
    });

    // Delete the object
    await s3Client.send(command);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting object:", error);
    return c.json({ error: "Failed to delete object" }, 500);
  }
});

export { uploadRoutes };
