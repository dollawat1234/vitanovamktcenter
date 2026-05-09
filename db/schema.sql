CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT NOT NULL,
  sku TEXT,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_brand_id_idx ON products (brand_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products (status);

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  path TEXT NOT NULL,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('brand', 'product')),
  owner_id TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('logo', 'hero', 'main', 'packaging', 'ref')),
  alt_text TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (bucket, path)
);

CREATE INDEX IF NOT EXISTS images_owner_idx ON images (owner_type, owner_id);
CREATE INDEX IF NOT EXISTS images_image_type_idx ON images (image_type);

CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  prompt_type TEXT NOT NULL DEFAULT 'general',
  input TEXT NOT NULL,
  output TEXT,
  model TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS prompts_brand_id_idx ON prompts (brand_id);
CREATE INDEX IF NOT EXISTS prompts_product_id_idx ON prompts (product_id);
CREATE INDEX IF NOT EXISTS prompts_created_at_idx ON prompts (created_at DESC);

CREATE TABLE IF NOT EXISTS work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_date DATE NOT NULL DEFAULT CURRENT_DATE,
  brand_id TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  work_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS work_logs_date_idx ON work_logs (work_date DESC);
CREATE INDEX IF NOT EXISTS work_logs_brand_date_idx ON work_logs (brand_id, work_date DESC);

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('brand-assets', 'brand-assets', true),
  ('product-assets', 'product-assets', true)
ON CONFLICT (id) DO NOTHING;
