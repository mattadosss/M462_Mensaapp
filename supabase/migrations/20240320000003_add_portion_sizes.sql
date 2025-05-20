-- Add portion_sizes column to meals table
ALTER TABLE meals
ADD COLUMN portion_sizes JSONB NOT NULL DEFAULT '{
    "small": {
        "price": 0,
        "description": "Small portion"
    },
    "medium": {
        "price": 0,
        "description": "Medium portion"
    },
    "large": {
        "price": 0,
        "description": "Large portion"
    }
}'::jsonb;

-- Update existing meals to have default portion sizes based on their current price
UPDATE meals
SET portion_sizes = jsonb_build_object(
    'small', jsonb_build_object('price', price * 0.8, 'description', 'Small portion'),
    'medium', jsonb_build_object('price', price, 'description', 'Medium portion'),
    'large', jsonb_build_object('price', price * 1.2, 'description', 'Large portion')
);

-- Add a check constraint to ensure portion prices are positive
ALTER TABLE meals
ADD CONSTRAINT positive_portion_prices CHECK (
    (portion_sizes->'small'->>'price')::numeric >= 0 AND
    (portion_sizes->'medium'->>'price')::numeric >= 0 AND
    (portion_sizes->'large'->>'price')::numeric >= 0
); 