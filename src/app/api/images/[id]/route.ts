// app/api/images/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { IMAGE_MAP } from "@/lib/image-map";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const filename = IMAGE_MAP[id];
  if (!filename) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const filePath = path.join("./public/images/questions/", filename);

  try {
    const imageBuffer = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : "image/jpeg";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Error loading image ${e}` },
      { status: 500 },
    );
  }
}
