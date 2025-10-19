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

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  order_items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_code TEXT,
  discount_amount DECIMAL(10, 2),
  final_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on shop_id for orders
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create return_orders table
CREATE TABLE IF NOT EXISTS return_orders (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  linked_order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  return_items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  reason_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on shop_id and linked_order_id for return_orders
CREATE INDEX IF NOT EXISTS idx_return_orders_shop_id ON return_orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_return_orders_linked_order_id ON return_orders(linked_order_id);
CREATE INDEX IF NOT EXISTS idx_return_orders_created_at ON return_orders(created_at DESC);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Packaging', 'Transit', 'ShipToOutlet', 'OutForDelivery', 'Delivered')),
  current_location TEXT,
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,
  tracking_number TEXT,
  delivery_notes TEXT,
  status_history JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for deliveries
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_shop_id ON deliveries(shop_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON deliveries(created_at DESC);

-- Enable Row Level Security for new tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
CREATE POLICY "Allow read access to orders" ON orders
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert access to orders" ON orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update access to orders" ON orders
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete access to orders" ON orders
  FOR DELETE
  USING (true);

-- Create policies for return_orders table
CREATE POLICY "Allow read access to return_orders" ON return_orders
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert access to return_orders" ON return_orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update access to return_orders" ON return_orders
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete access to return_orders" ON return_orders
  FOR DELETE
  USING (true);

-- Create policies for deliveries table
CREATE POLICY "Allow read access to deliveries" ON deliveries
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert access to deliveries" ON deliveries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update access to deliveries" ON deliveries
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete access to deliveries" ON deliveries
  FOR DELETE
  USING (true);

-- Trigger to automatically update updated_at for deliveries
CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
