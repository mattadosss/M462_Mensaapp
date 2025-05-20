export type PortionSize = {
    price: number;
    description: string;
};

export type PortionSizes = {
    small: PortionSize;
    medium: PortionSize;
    large: PortionSize;
};

export type Meal = {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    allergens: string[];
    country_of_origin: string;
    image_url: string;
    portion_sizes: PortionSizes;
    created_at: string;
    updated_at: string;
};

export type CreateMealInput = Omit<Meal, 'id' | 'created_at' | 'updated_at'>;

export type UpdateMealInput = Partial<CreateMealInput>; 