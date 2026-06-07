-- Relax Station Food and Fun — Restaurant CMS Schema
-- Idempotent: safe to run on every deploy (IF NOT EXISTS throughout)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Users (admin)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ---------------------------------------------------------------------------
-- Menu
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_categories_slug ON menu_categories (slug);
CREATE INDEX IF NOT EXISTS idx_menu_categories_active_sort ON menu_categories (is_active, sort_order);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES menu_categories (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  cloudinary_public_id VARCHAR(255),
  is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
  is_spicy BOOLEAN NOT NULL DEFAULT FALSE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_slug ON menu_items (slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (is_available, sort_order);

-- ---------------------------------------------------------------------------
-- Gallery
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  caption TEXT,
  image_url TEXT NOT NULL,
  cloudinary_public_id VARCHAR(255),
  category VARCHAR(100) DEFAULT 'general',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_active_sort ON gallery_images (is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Offers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  discount_percent NUMERIC(5, 2) CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100)),
  discount_amount NUMERIC(10, 2) CHECK (discount_amount IS NULL OR discount_amount >= 0),
  image_url TEXT,
  cloudinary_public_id VARCHAR(255),
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  terms TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT offers_discount_check CHECK (
    discount_percent IS NOT NULL OR discount_amount IS NOT NULL OR (discount_percent IS NULL AND discount_amount IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_offers_slug ON offers (slug);
CREATE INDEX IF NOT EXISTS idx_offers_active_dates ON offers (is_active, valid_from, valid_until);

-- ---------------------------------------------------------------------------
-- Today's Special
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS today_specials (
  id SERIAL PRIMARY KEY,
  menu_item_id INT NOT NULL REFERENCES menu_items (id) ON DELETE CASCADE,
  special_price NUMERIC(10, 2) CHECK (special_price IS NULL OR special_price >= 0),
  note TEXT,
  image_url TEXT,
  cloudinary_public_id VARCHAR(255),
  special_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (special_date, menu_item_id)
);

CREATE INDEX IF NOT EXISTS idx_today_specials_date ON today_specials (special_date, is_active);

-- ---------------------------------------------------------------------------
-- Booking requests
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS birthday_requests (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  event_date DATE NOT NULL,
  guest_count INT NOT NULL CHECK (guest_count > 0),
  package_type VARCHAR(100),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'completed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_birthday_requests_status ON birthday_requests (status, event_date);

CREATE TABLE IF NOT EXISTS event_requests (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  guest_count INT NOT NULL CHECK (guest_count > 0),
  budget_range VARCHAR(100),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'completed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_requests_status ON event_requests (status, event_date);

-- ---------------------------------------------------------------------------
-- Site settings (JSONB key-value)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Updated_at trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Triggers Execution Block
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_updated') THEN
    CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_menu_categories_updated') THEN
    CREATE TRIGGER trg_menu_categories_updated BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_menu_items_updated') THEN
    CREATE TRIGGER trg_menu_items_updated BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_gallery_updated') THEN
    CREATE TRIGGER trg_gallery_updated BEFORE UPDATE ON gallery_images FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_offers_updated') THEN
    CREATE TRIGGER trg_offers_updated BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_today_specials_updated') THEN
    CREATE TRIGGER trg_today_specials_updated BEFORE UPDATE ON today_specials FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_birthday_requests_updated') THEN
    CREATE TRIGGER trg_birthday_requests_updated BEFORE UPDATE ON birthday_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_event_requests_updated') THEN
    CREATE TRIGGER trg_event_requests_updated BEFORE UPDATE ON event_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_site_settings_updated') THEN
    CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Idempotent Default Seed Data
-- ---------------------------------------------------------------------------
INSERT INTO site_settings (key, value)
VALUES ('business_info', '{"name": "Relax Station Food and Fun", "currency": "USD"}')
ON CONFLICT (key) DO NOTHING;
