import { put } from "@vercel/blob";

const MAX_RESUME_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

function sanitizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function hasAllowedExtension(fileName) {
  const lower = fileName.toLowerCase();
  return ALLOWED_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

export async function POST(request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { success: false, message: "Blob upload is not configured." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const resumeFile = formData.get("file");

    if (!(resumeFile instanceof File)) {
      return Response.json(
        { success: false, message: "No resume file was provided." },
        { status: 400 }
      );
    }

    if (resumeFile.size <= 0 || resumeFile.size > MAX_RESUME_SIZE_BYTES) {
      return Response.json(
        { success: false, message: "Resume must be 8MB or smaller." },
        { status: 400 }
      );
    }

    if (!hasAllowedExtension(resumeFile.name)) {
      return Response.json(
        { success: false, message: "Resume must be a PDF, DOC, DOCX, or TXT file." },
        { status: 400 }
      );
    }

    const safeFileName = sanitizeFileName(resumeFile.name || "resume");
    const blobPath = `applications/resumes/${Date.now()}-${safeFileName}`;

    const uploadedBlob = await put(blobPath, resumeFile, {
      access: "private",
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return Response.json({
      success: true,
      url: uploadedBlob.url,
      pathname: uploadedBlob.pathname,
      name: resumeFile.name,
      size: resumeFile.size,
    });
  } catch (error) {
    console.error("[resume-upload] upload failed", error);
    const message =
      error instanceof Error ? error.message : "Resume upload failed. Please try again.";
    return Response.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? `Resume upload failed: ${message}`
            : "Resume upload failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
