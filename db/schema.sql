CREATE TABLE IF NOT EXISTS public.leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_th TEXT,
  category TEXT,
  description TEXT,
  description_th TEXT,
  claim TEXT,
  claim_th TEXT,
  claim_type TEXT CHECK (claim_type IN ('safe','risky','neutral')) DEFAULT 'safe',
  ingredients TEXT,
  channels TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('brand','product')),
  owner_id TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('logo','logo_dark','hero','main_photo','packaging','lifestyle','visual_ref','mood')),
  storage_path TEXT NOT NULL,
  storage_bucket TEXT NOT NULL CHECK (storage_bucket IN ('brand-assets','product-assets')),
  public_url TEXT,
  label TEXT,
  note TEXT,
  sort_order INTEGER DEFAULT 0,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  prompt_type TEXT CHECK (prompt_type IN ('caption','visual_brief','claim_check','ads_copy','tiktok_script','custom')),
  lang TEXT CHECK (lang IN ('th','en')) DEFAULT 'th',
  input_notes TEXT,
  content TEXT NOT NULL,
  is_saved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT,
  task_type TEXT CHECK (task_type IN ('content','design','ads','report','meeting','other')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('done','in_progress','pending')) DEFAULT 'done',
  log_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_images_owner ON public.images(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_images_type ON public.images(image_type);
CREATE INDEX IF NOT EXISTS idx_prompts_brand ON public.prompts(brand_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_date ON public.work_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_work_logs_brand ON public.work_logs(brand_id);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.products;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS allow_all_products ON public.products;
DROP POLICY IF EXISTS allow_all_images ON public.images;
DROP POLICY IF EXISTS allow_all_prompts ON public.prompts;
DROP POLICY IF EXISTS allow_all_work_logs ON public.work_logs;

CREATE POLICY allow_all_products ON public.products FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY allow_all_images ON public.images FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY allow_all_prompts ON public.prompts FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY allow_all_work_logs ON public.work_logs FOR ALL USING (TRUE) WITH CHECK (TRUE);

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('brand-assets', 'brand-assets', TRUE),
  ('product-assets', 'product-assets', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS public_read_brand_assets ON storage.objects;
DROP POLICY IF EXISTS anon_upload_brand_assets ON storage.objects;
DROP POLICY IF EXISTS anon_delete_brand_assets ON storage.objects;
DROP POLICY IF EXISTS public_read_product_assets ON storage.objects;
DROP POLICY IF EXISTS anon_upload_product_assets ON storage.objects;
DROP POLICY IF EXISTS anon_delete_product_assets ON storage.objects;

CREATE POLICY public_read_brand_assets ON storage.objects FOR SELECT USING (bucket_id = 'brand-assets');
CREATE POLICY anon_upload_brand_assets ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-assets');
CREATE POLICY anon_delete_brand_assets ON storage.objects FOR DELETE USING (bucket_id = 'brand-assets');
CREATE POLICY public_read_product_assets ON storage.objects FOR SELECT USING (bucket_id = 'product-assets');
CREATE POLICY anon_upload_product_assets ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-assets');
CREATE POLICY anon_delete_product_assets ON storage.objects FOR DELETE USING (bucket_id = 'product-assets');

INSERT INTO public.products
  (brand_id, sku, name, name_th, category, description, description_th, claim, claim_th, claim_type, channels, sort_order)
VALUES
  ('natwell','NW-001','Natwell Collagen Plus','นัทเวล คอลลาเจน พลัส','Supplement','Fish collagen + Vitamin C 1000mg','คอลลาเจนสกัดจากปลา + วิตามินซี 1000mg','Supports skin care when used regularly','ช่วยดูแลผิว ใช้เป็นประจำ','safe',ARRAY['Online','Facebook'],1),
  ('natwell','NW-002','Natwell Immunity','นัทเวล อิมมูนิตี้','Supplement','Ginseng extract + Zinc + Vitamin D','สารสกัดโสม + ซิงก์ + วิตามินดี','Supports immune system care','ช่วยดูแลภูมิคุ้มกัน','safe',ARRAY['Online','Facebook'],2),
  ('natwell','NW-003','Natwell Bright','นัทเวล ไบรท์','Supplement','Glutathione + Vitamin C','กลูต้าไธโอน + วิตามินซี','Nourishes skin from within','ดูแลผิวพรรณจากภายใน','safe',ARRAY['Online','Facebook','Shopee'],3),
  ('vitus','VS-001','VitUS Vitamin C 1000','วิตัส วิตามินซี 1000','Vitamin','Imported USA Vitamin C 1000mg','วิตามินซีนำเข้า USA 1000mg','Supplement daily nutrition','เสริมโภชนาการประจำวัน','safe',ARRAY['Pharmacy','Online','Facebook'],1),
  ('vitus','VS-002','VitUS Omega-3','วิตัส โอเมก้า-3','Vitamin','USA quality fish oil','น้ำมันปลาคุณภาพจากอเมริกา','Daily health support','ดูแลสุขภาพประจำวัน','safe',ARRAY['Pharmacy','Online'],2),
  ('vitus','VS-003','VitUS Zinc Plus','วิตัส ซิงก์ พลัส','Vitamin','Zinc + B6 imported supplement','ซิงก์ + วิตามิน B6 นำเข้า','Body nourishment supplement','บำรุงร่างกาย','safe',ARRAY['Pharmacy','Online'],3),
  ('ella','EL-001','Ella Scar Gel','เอลล่า สการ์ เจล','Cosmeceutical','Silicone gel for skin around wound areas','ซิลิโคนเจลดูแลผิวบริเวณรอยแผล','Helps care for skin around wound areas','ช่วยดูแลผิวบริเวณรอยแผล ใช้ต่อเนื่อง','safe',ARRAY['Pharmacy','Facebook','TikTok'],1),
  ('ella','EL-002','Ella Bright Serum','เอลล่า ไบรท์ เซรั่ม','Cosmeceutical','Vitamin C + Niacinamide serum','เซรั่มวิตามินซี + ไนอะซินาไมด์','Cares for brighter-looking skin','ดูแลผิวให้ดูกระจ่างใส','safe',ARRAY['Pharmacy','Facebook','TikTok','Online'],2),
  ('ella','EL-003','Ella Sun Shield SPF50+','เอลล่า ซัน ชีลด์','Cosmeceutical','Cosmeceutical sunscreen','กันแดดสูตรเวชสำอาง','Protects skin from UVA/UVB','ปกป้องผิวจากรังสี UVA/UVB','safe',ARRAY['Pharmacy','Online'],3),
  ('airizu','AR-001','Airizu Light Moisturizer','แอร์อิซึ ไลท์ มอยส์เจอไรเซอร์','Skincare','Lightweight non-comedogenic moisturizer','มอยส์เจอไรเซอร์เนื้อบางเบา ไม่อุดตัน','Gently nourishes skin daily','บำรุงผิวอย่างอ่อนโยน ใช้ได้ทุกวัน','safe',ARRAY['Skincare','Facebook','TikTok','Shopee'],1),
  ('airizu','AR-002','Airizu Toner Mist','แอร์อิซึ โทนเนอร์ มิสต์','Skincare','Gentle formula toner spray','โทนเนอร์สเปรย์ สูตรอ่อนโยน','Refreshing skin care','ดูแลผิวให้สดชื่น สบายผิว','safe',ARRAY['Skincare','Facebook','TikTok'],2),
  ('airizu','AR-003','Airizu Eye Essence','แอร์อิซึ อาย เอสเซนส์','Skincare','Eye area nourishing essence','เอสเซนส์บำรุงรอบดวงตา','Gently cares for eye area skin','ดูแลผิวรอบดวงตาอย่างอ่อนโยน','safe',ARRAY['Skincare','Shopee','Online'],3),
  ('klear','KL-001','Klear Acne Gel','เคลียร์ แอคเน่ เจล','Pharmacy','Benzoyl peroxide 5% acne gel','เจลดูแลสิว เบนโซอิลเปอร์ออกไซด์ 5%','Helps manage initial acne concerns','ดูแลปัญหาสิวเบื้องต้น','safe',ARRAY['Pharmacy','Facebook'],1),
  ('klear','KL-002','Klear Soothing Cream','เคลียร์ ซูทติ้ง ครีม','Pharmacy','Gentle sunburn care cream','ครีมดูแลผิวแพ้แดด อ่อนโยน','Helps care for irritated skin','ช่วยดูแลผิวที่ระคายเคือง','safe',ARRAY['Pharmacy','Facebook'],2),
  ('klear','KL-003','Klear Oil Control Serum','เคลียร์ ออยล์ คอนโทรล เซรั่ม','Pharmacy','Oil control serum','เซรั่มควบคุมความมัน','Easy to use for oily skin','ใช้ง่าย เหมาะสำหรับผิวมัน','safe',ARRAY['Pharmacy','Online'],3)
ON CONFLICT (sku) DO UPDATE SET
  brand_id = EXCLUDED.brand_id,
  name = EXCLUDED.name,
  name_th = EXCLUDED.name_th,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  description_th = EXCLUDED.description_th,
  claim = EXCLUDED.claim,
  claim_th = EXCLUDED.claim_th,
  claim_type = EXCLUDED.claim_type,
  channels = EXCLUDED.channels,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE;
