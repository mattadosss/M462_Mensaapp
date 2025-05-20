-- Create daily_menus table
CREATE TABLE daily_menus (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    meal_ids UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Ensure no more than 3 meals per day
    CONSTRAINT max_meals_per_day CHECK (array_length(meal_ids, 1) <= 3),
    -- Ensure unique date
    CONSTRAINT unique_date UNIQUE (date)
);

-- Create index for faster date lookups
CREATE INDEX idx_daily_menus_date ON daily_menus(date);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_menus ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations"
    ON daily_menus
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_daily_menus_updated_at
    BEFORE UPDATE ON daily_menus
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 