import { NextResponse } from "next/server";
import { getDatabase } from "../_db";

type ProductInput = {
  brand_id?: string;
  sku?: string;
  name?: string;
  name_th?: string;
  category?: string;
  description?: string;
  description_th?: string;
  claim?: string;
  claim_th?: string;
  claim_type?: "safe" | "risky" | "neutral";
  ingredients?: string;
  channels?: string[];
  sort_order?: number;
};

function unavailable() {
  return NextResponse.json({ message: "Database is not connected yet." }, { status: 503 });
}

export async function GET(request: Request) {
  const sql = getDatabase();
  if (!sql) return unavailable();

  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brand_id");
  const q = `%${(searchParams.get("q") || "").trim()}%`;

  const rows = brandId
    ? await sql`
        SELECT * FROM public.products
        WHERE is_active = true
          AND brand_id = ${brandId}
          AND (${q} = '%%' OR name ILIKE ${q} OR sku ILIKE ${q} OR category ILIKE ${q})
        ORDER BY brand_id, sort_order, name
      `
    : await sql`
        SELECT * FROM public.products
        WHERE is_active = true
          AND (${q} = '%%' OR name ILIKE ${q} OR sku ILIKE ${q} OR category ILIKE ${q})
        ORDER BY brand_id, sort_order, name
      `;

  return NextResponse.json({ products: rows });
}

export async function POST(request: Request) {
  const sql = getDatabase();
  if (!sql) return unavailable();

  const input = (await request.json()) as ProductInput;
  if (!input.brand_id || !input.sku || !input.name) {
    return NextResponse.json({ message: "brand_id, sku, and name are required." }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO public.products (
      brand_id, sku, name, name_th, category, description, description_th,
      claim, claim_th, claim_type, ingredients, channels, sort_order
    )
    VALUES (
      ${input.brand_id}, ${input.sku}, ${input.name}, ${input.name_th || null},
      ${input.category || null}, ${input.description || null}, ${input.description_th || null},
      ${input.claim || null}, ${input.claim_th || null}, ${input.claim_type || "safe"},
      ${input.ingredients || null}, ${input.channels || []}, ${input.sort_order || 0}
    )
    RETURNING *
  `;

  return NextResponse.json({ product: rows[0] }, { status: 201 });
}
