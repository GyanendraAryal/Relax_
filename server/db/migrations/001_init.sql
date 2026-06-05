-- Relax Station Food and Fun — Restaurant CMS Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Users (admin)
-- ---------------------------------------------------------------------------
CREATE TABLE users (
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

CREATE INDEX idx_users_email ON users (email);

-- ---------------------------------------------------------------------------
-- Menu
-- ---------------------------------------------------------------------------
CREATE TABLE menu_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_categories_slug ON menu_categories (slug);
CREATE INDEX idx_menu_categories_active_sort ON menu_categories (is_active, sort_order);

CREATE TABLE menu_items (
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

CREATE INDEX idx_menu_items_category ON menu_items (category_id);
CREATE INDEX idx_menu_items_slug ON menu_items (slug);
CREATE INDEX idx_menu_items_available ON menu_items (is_available, sort_order);

-- ---------------------------------------------------------------------------
-- Gallery
-- ---------------------------------------------------------------------------
CREATE TABLE gallery_images (
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

CREATE INDEX idx_gallery_active_sort ON gallery_images (is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Offers
-- ---------------------------------------------------------------------------
CREATE TABLE offers (
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

CREATE INDEX idx_offers_slug ON offers (slug);
CREATE INDEX idx_offers_active_dates ON offers (is_active, valid_from, valid_until);

-- ---------------------------------------------------------------------------
-- Today's Special
-- ---------------------------------------------------------------------------
CREATE TABLE today_specials (
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

CREATE INDEX idx_today_specials_date ON today_specials (special_date, is_active);

-- ---------------------------------------------------------------------------
-- Booking requests
-- ---------------------------------------------------------------------------
CREATE TABLE birthday_requests (
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

CREATE INDEX idx_birthday_requests_status ON birthday_requests (status, event_date);

CREATE TABLE event_requests (
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

CREATE INDEX idx_event_requests_status ON event_requests (status, event_date);

-- ---------------------------------------------------------------------------
-- Site settings (JSONB key-value)
-- ---------------------------------------------------------------------------
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Updated_at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_menu_categories_updated BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_menu_items_updated BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_gallery_updated BEFORE UPDATE ON gallery_images FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_offers_updated BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_today_specials_updated BEFORE UPDATE ON today_specials FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_birthday_updated BEFORE UPDATE ON birthday_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_event_updated BEFORE UPDATE ON event_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Seed default site settings
-- ---------------------------------------------------------------------------
INSERT INTO site_settings (key, value) VALUES
  ('restaurant', '{"name":"Relax Station Food and Fun","tagline":"Food, Fun & Memories in Kathmandu","address":"Kathmandu, Nepal","phone":"+977-1-XXXXXXX","email":"info@relaxstation.np","hours":{"monday":"10:00 - 22:00","tuesday":"10:00 - 22:00","wednesday":"10:00 - 22:00","thursday":"10:00 - 22:00","friday":"10:00 - 23:00","saturday":"10:00 - 23:00","sunday":"10:00 - 22:00"},"social":{"facebook":"","instagram":"","tiktok":""}}'::jsonb),
  ('hero', '{"title":"Welcome to Relax Station","subtitle":"Nepal''s favorite spot for great food and family fun","ctaText":"View Menu","ctaLink":"/menu","backgroundImage":""}'::jsonb),
  ('about', '{"title":"About Us","content":"Relax Station Food and Fun is a family-friendly restaurant in Kathmandu offering delicious Nepali and international cuisine, birthday packages, and event hosting."}'::jsonb);
