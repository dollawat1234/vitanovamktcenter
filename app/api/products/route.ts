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

const productSelect = `
  SELECT
    p.id,
    p.brand_id,
    p.sku,
    p.name,
    p.metadata->>'name_th' AS name_th,
    p.category,
    p.description,
    p.metadata->>'description_th' AS description_th,
    p.metadata->>'claim' AS claim,
    p.metadata->>'claim_th' AS claim_th,
    COALESCE(p.metadata->>'claim_type', 'safe') AS claim_type,
    p.metadata->>'ingredients' AS ingredients,
    CASE
      WHEN jsonb_typeof(p.metadata->'channels') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(p.metadata->'channels'))
      ELSE ARRAY[]::text[]
    END AS channels,
    COALESCE((p.metadata->>'sort_order')::integer, 0) AS sort_order,
    (
      SELECT COALESCE(i.metadata->>'public_url', 'https://hazqbyphdupfwejsenro.supabase.co/storage/v1/object/public/' || i.bucket || '/' || i.path)
      FROM public.images i
      WHERE i.owner_type = 'product' AND i.owner_id = p.id::text AND i.image_type = 'main'
      ORDER BY i.created_at DESC
      LIMIT 1
    ) AS main_image_url,
    (
      SELECT COALESCE(i.metadata->>'public_url', 'https://hazqbyphdupfwejsenro.supabase.co/storage/v1/object/public/' || i.bucket || '/' || i.path)
      FROM public.images i
      WHERE i.owner_type = 'product' AND i.owner_id = p.id::text AND i.image_type = 'packaging'
      ORDER BY i.created_at DESC
      LIMIT 1
    ) AS packaging_url,
    (
      SELECT COALESCE(i.metadata->>'public_url', 'https://hazqbyphdupfwejsenro.supabase.co/storage/v1/object/public/' || i.bucket || '/' || i.path)
      FROM public.images i
      WHERE i.owner_type = 'product' AND i.owner_id = p.id::text AND i.image_type = 'ref'
      ORDER BY i.created_at DESC
      LIMIT 1
    ) AS ref_url
  FROM public.products p
`;

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
    ? await sql.unsafe(`
        ${productSelect}
        WHERE p.status = 'active'
          AND p.brand_id = $1
          AND ($2 = '%%' OR p.name ILIKE $2 OR p.sku ILIKE $2 OR p.category ILIKE $2 OR p.metadata->>'name_th' ILIKE $2)
        ORDER BY p.brand_id, sort_order, p.name
      `, [brandId, q])
    : await sql.unsafe(`
        ${productSelect}
        WHERE p.status = 'active'
          AND ($1 = '%%' OR p.name ILIKE $1 OR p.sku ILIKE $1 OR p.category ILIKE $1 OR p.metadata->>'name_th' ILIKE $1)
        ORDER BY p.brand_id, sort_order, p.name
      `, [q]);

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
    INSERT INTO public.products (brand_id, sku, name, category, description, status, metadata)
    VALUES (
      ${input.brand_id}, ${input.sku}, ${input.name}, ${input.category || null},
      ${input.description || null}, 'active',
      jsonb_strip_nulls(jsonb_build_object(
        'name_th', ${input.name_th || null},
        'description_th', ${input.description_th || null},
        'claim', ${input.claim || null},
        'claim_th', ${input.claim_th || null},
        'claim_type', ${input.claim_type || "safe"},
        'ingredients', ${input.ingredients || null},
        'channels', ${JSON.stringify(input.channels || [])}::jsonb,
        'sort_order', ${input.sort_order || 0}
      ))
    )
    RETURNING *
  `;

  return NextResponse.json({ product: rows[0] }, { status: 201 });
}
