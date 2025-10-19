-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('wholeseller', 'retailer')),
  is_new BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_shops_category ON shops(category);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_shops_created_at ON shops(created_at DESC);

-- Create index on location coordinates for geospatial queries
CREATE INDEX IF NOT EXISTS idx_shops_location ON shops(latitude, longitude);

-- Create skus (products) table
CREATE TABLE IF NOT EXISTS skus (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  box_price DECIMAL(10, 2) NOT NULL,
  cost_per_unit DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for searching
CREATE INDEX IF NOT EXISTS idx_skus_name ON skus(name);

-- Enable Row Level Security (RLS)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;

-- Create policies for shops table
-- Allow all authenticated users to read shops
CREATE POLICY "Allow read access to shops" ON shops
  FOR SELECT
  USING (true);

-- Allow all authenticated users to insert shops
CREATE POLICY "Allow insert access to shops" ON shops
  FOR INSERT
  WITH CHECK (true);

-- Allow all authenticated users to update shops
CREATE POLICY "Allow update access to shops" ON shops
  FOR UPDATE
  USING (true);

-- Allow all authenticated users to delete shops
CREATE POLICY "Allow delete access to shops" ON shops
  FOR DELETE
  USING (true);

-- Create policies for skus table
-- Allow all authenticated users to read skus
CREATE POLICY "Allow read access to skus" ON skus
  FOR SELECT
  USING (true);

-- Allow all authenticated users to insert skus
CREATE POLICY "Allow insert access to skus" ON skus
  FOR INSERT
  WITH CHECK (true);

-- Allow all authenticated users to update skus
CREATE POLICY "Allow update access to skus" ON skus
  FOR UPDATE
  USING (true);

-- Allow all authenticated users to delete skus
CREATE POLICY "Allow delete access to skus" ON skus
  FOR DELETE
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at for skus
CREATE TRIGGER update_skus_updated_at
  BEFORE UPDATE ON skus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default SKU data
INSERT INTO skus (id, name, description, price, box_price, cost_per_unit) VALUES
  ('SKU001', 'Puffed Rice', 'High-quality puffed rice', 13, 520, 10),
  ('SKU002', 'Roasted Makhana', 'Premium roasted makhana', 300, 6000, 250),
  ('SKU003', 'Makhana (Cheese)', 'Cheese flavored makhana', 90, 900, 75),
  ('SKU004', 'Makhana (Onion & Cream)', 'Onion & Cream flavored makhana', 90, 900, 75),
  ('SKU005', 'Rakhiya Bari', 'Traditional Rakhiya Bari', 90, 1440, 75),
  ('SKU006', 'Adori Bari', 'Fresh Adori Bari', 65, 1040, 50),
  ('SKU007', 'Dahi Mirchi (Curd Chillies)', 'Spicy curd chillies', 50, 1000, 40),
  ('SKU008', 'Bijori', 'Traditional Bijori snack', 50, 1000, 40),
  ('SKU009', 'Instant Bhel', 'Ready to eat instant bhel', 40, 1600, 30),
  ('SKU010', 'Chewda', 'Crunchy chewda mix', 40, 1600, 30)
ON CONFLICT (id) DO NOTHING;
