-- PITGO DATABASE SCHEMA (POSTGRESQL / SUPABASE)

-- 1. Profiles (User data beyond Auth)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'provider', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Shops (Service Providers)
CREATE TABLE shops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    image_url TEXT,
    category TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services (Offered by Shops)
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_mins INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders (Transactions)
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id),
    shop_id UUID REFERENCES shops(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Order Items
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    price_at_purchase DECIMAL(10,2) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Public read for shops/services, private for profiles/orders)
CREATE POLICY "Public shops are viewable by everyone" ON shops FOR SELECT USING (is_active = true);
CREATE POLICY "Public services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);

-- Update profiles for customer location
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_lat DECIMAL(9,6);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_lng DECIMAL(9,6);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_address TEXT;
