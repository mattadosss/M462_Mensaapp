-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    order_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_meal_id ON orders(meal_id);
CREATE INDEX idx_orders_order_time ON orders(order_time);
CREATE INDEX idx_orders_status ON orders(status);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
-- Users can only see their own orders
CREATE POLICY "Users can view their own orders"
    ON orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only insert their own orders
CREATE POLICY "Users can insert their own orders"
    ON orders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Only admins can update order status
CREATE POLICY "Admins can update order status"
    ON orders
    FOR UPDATE
    USING (auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'admin'
    ));

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 