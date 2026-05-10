import { NextResponse } from "next/server";
import { getDatabase } from "../../_db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database is not connected yet." }, { status: 503 });

  const { id } = await params;
  const input = await request.json();
  const rows = await sql`
    UPDATE public.products
    SET
      brand_id = COALESCE(${input.brand_id ?? null}, brand_id),
      sku = COALESCE(${input.sku ?? null}, sku),
      name = COALESCE(${input.name ?? null}, name),
      name_th = ${input.name_th ?? null},
      category = ${input.category ?? null},
      description = ${input.description ?? null},
      description_th = ${input.description_th ?? null},
      claim = ${input.claim ?? null},
      claim_th = ${input.claim_th ?? null},
      claim_type = COALESCE(${input.claim_type ?? null}, claim_type),
      ingredients = ${input.ingredients ?? null},
      channels = ${input.channels ?? []},
      sort_order = COALESCE(${input.sort_order ?? null}, sort_order)
    WHERE id = ${id}
    RETURNING *
  `;

  if (!rows[0]) return NextResponse.json({ message: "Product not found." }, { status: 404 });
  return NextResponse.json({ product: rows[0] });
}

export async function DELETE(_request: Request, { params }: Params) {
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database is not connected yet." }, { status: 503 });

  const { id } = await params;
  await sql`UPDATE public.products SET is_active = false WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
