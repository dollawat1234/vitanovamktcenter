import { NextResponse } from "next/server";
import { getDatabase } from "../_db";

type ImageInput = {
  owner_type?: "brand" | "product";
  owner_id?: string;
  image_type?: string;
  storage_path?: string;
  storage_bucket?: "brand-assets" | "product-assets";
  public_url?: string;
  label?: string;
  note?: string;
  sort_order?: number;
};

export async function GET(request: Request) {
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ images: [], message: "Database is not connected yet." }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const ownerType = searchParams.get("owner_type");
  const ownerId = searchParams.get("owner_id");

  const rows = ownerType && ownerId
    ? await sql`
        SELECT * FROM public.images
        WHERE owner_type = ${ownerType} AND owner_id = ${ownerId}
        ORDER BY sort_order, uploaded_at DESC
      `
    : await sql`
        SELECT * FROM public.images
        ORDER BY owner_type, owner_id, sort_order, uploaded_at DESC
      `;

  return NextResponse.json({ images: rows });
}

export async function POST(request: Request) {
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database is not connected yet." }, { status: 503 });

  const input = (await request.json()) as ImageInput;
  if (!input.owner_type || !input.owner_id || !input.image_type || !input.storage_path || !input.storage_bucket) {
    return NextResponse.json({ message: "owner_type, owner_id, image_type, storage_path, and storage_bucket are required." }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO public.images (
      owner_type, owner_id, image_type, storage_path, storage_bucket,
      public_url, label, note, sort_order
    )
    VALUES (
      ${input.owner_type}, ${input.owner_id}, ${input.image_type}, ${input.storage_path},
      ${input.storage_bucket}, ${input.public_url || null}, ${input.label || null},
      ${input.note || null}, ${input.sort_order || 0}
    )
    RETURNING *
  `;

  return NextResponse.json({ image: rows[0] }, { status: 201 });
}
