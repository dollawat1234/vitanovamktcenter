import { NextResponse } from "next/server";
import { getDatabase } from "../../_db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database is not connected yet." }, { status: 503 });

  const { id } = await params;
  const input = await request.json();
  const rows = await sql`
    UPDATE public.images
    SET
      alt_text = ${input.label ?? null},
      metadata = metadata || jsonb_strip_nulls(jsonb_build_object(
        'label', ${input.label ?? null},
        'note', ${input.note ?? null},
        'sort_order', ${input.sort_order ?? null}
      )),
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;

  if (!rows[0]) return NextResponse.json({ message: "Image not found." }, { status: 404 });
  return NextResponse.json({ image: rows[0] });
}

export async function DELETE(_request: Request, { params }: Params) {
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database is not connected yet." }, { status: 503 });

  const { id } = await params;
  await sql`DELETE FROM public.images WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
