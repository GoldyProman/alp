-- ================================================================
-- ALPINE POWER TOOLS — SUPABASE DATABASE SCHEMA
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- CATEGORIES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT DEFAULT '',
  full_description TEXT DEFAULT '',
  image_url       TEXT,
  banner_url      TEXT,
  meta_title      TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  is_active       BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

-- ================================================================
-- PRODUCTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  description       TEXT DEFAULT '',
  full_description  TEXT DEFAULT '',
  images            JSONB DEFAULT '[]'::jsonb,     -- array of image URLs
  tiers             JSONB DEFAULT '[]'::jsonb,     -- [{title, color, description, sizes:[]}]
  specifications    JSONB DEFAULT '[]'::jsonb,     -- [{label, value}]
  sizes             JSONB DEFAULT '[]'::jsonb,     -- ["4 inch", "5 inch"]
  tags              JSONB DEFAULT '[]'::jsonb,     -- ["concrete", "diamond"]
  is_active         BOOLEAN DEFAULT TRUE,
  is_featured       BOOLEAN DEFAULT FALSE,
  meta_title        TEXT DEFAULT '',
  meta_description  TEXT DEFAULT '',
  sort_order        INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order);

-- ================================================================
-- ENQUIRIES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS enquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  message      TEXT,
  product_name TEXT,
  contacted    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_email     ON enquiries(email);
CREATE INDEX IF NOT EXISTS idx_enquiries_contacted ON enquiries(contacted);
CREATE INDEX IF NOT EXISTS idx_enquiries_created   ON enquiries(created_at DESC);

-- ================================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_enquiries_updated_at
  BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- Service role key bypasses RLS (used by admin API)
-- Public/anon can only READ active categories + products
-- ================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries  ENABLE ROW LEVEL SECURITY;

-- Public can read active categories
CREATE POLICY "Public read active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE);

-- Public can read active products
CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

-- Public can insert enquiries (contact form)
CREATE POLICY "Public submit enquiries"
  ON enquiries FOR INSERT
  WITH CHECK (TRUE);

-- No public read on enquiries (admin-only)
-- Service role key bypasses all RLS policies

-- ================================================================
-- SEED DATA (optional — delete if not needed)
-- ================================================================
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
  ('Diamond Saw Blades',       'diamond-blades',   'Industrial grade diamond tools for concrete, granite, and masonry cutting.', TRUE, 1),
  ('TCT Saw Blades',           'tct-blades',       'Tungsten Carbide Tipped blades for wood, aluminum, and plastics.',           TRUE, 2),
  ('Cutting & Grinding Discs', 'cutting-discs',    'Abrasive solutions for metal fabrication and stainless steel.',              TRUE, 3)
ON CONFLICT (slug) DO NOTHING;
