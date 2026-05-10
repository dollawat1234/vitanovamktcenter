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

  try {
    const { searchParams } = new URL(request.url);
    const ownerType = searchParams.get("owner_type");
    const ownerId = searchParams.get("owner_id");

  const imageSelect = `
    SELECT
      id,
      owner_type,
      owner_id,
      image_type,
      path AS storage_path,
      bucket AS storage_bucket,
      COALESCE(metadata->>'public_url', 'https://hazqbyphdupfwejsenro.supabase.co/storage/v1/object/public/' || bucket || '/' || path) AS public_url,
      COALESCE(metadata->>'label', alt_text, image_type) AS label,
      metadata->>'note' AS note,
      COALESCE((metadata->>'sort_order')::integer, 0) AS sort_order,
      created_at
    FROM public.images
  `;

    const rows = ownerType && ownerId
      ? await sql.unsafe(`
          ${imageSelect}
          WHERE owner_type = $1 AND owner_id = $2
          ORDER BY sort_order, created_at DESC
        `, [ownerType, ownerId])
      : await sql.unsafe(`
          ${imageSelect}
          ORDER BY owner_type, owner_id, sort_order, created_at DESC
        `);

    return NextResponse.json({ images: rows });
  } catch (error) {
    console.error("Image API error", error);
    return NextResponse.json({ images: [], message: "Image database query failed." }, { status: 200 });
  }
}

export async function POST(request: Request) {
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database is not connected yet." }, { status: 503 });

  const input = (await request.json()) as ImageInput;
  if (!input.owner_type || !input.owner_id || !input.image_type || !input.storage_path || !input.storage_bucket) {
    return NextResponse.json({ message: "owner_type, owner_id, image_type, storage_path, and storage_bucket are required." }, { status: 400 });
  }

  const imageType = input.image_type === "logo_dark" ? "logo" : ["visual_ref", "mood"].includes(input.image_type) ? "ref" : input.image_type;

  const rows = await sql`
    INSERT INTO public.images (owner_type, owner_id, image_type, path, bucket, alt_text, metadata)
    VALUES (
      ${input.owner_type}, ${input.owner_id}, ${imageType}, ${input.storage_path},
      ${input.storage_bucket}, ${input.label || null},
      jsonb_strip_nulls(jsonb_build_object(
        'public_url', ${input.public_url || null},
        'label', ${input.label || null},
        'note', ${input.note || null},
        'sort_order', ${input.sort_order || 0}
      ))
    )
    RETURNING *
  `;

  return NextResponse.json({ image: rows[0] }, { status: 201 });
}
