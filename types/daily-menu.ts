import { Meal } from './meal';

export type DailyMenu = {
    id: string;
    date: string;
    meal_ids: string[];
    created_at: string;
    updated_at: string;
    meals?: Meal[]; // Optional field for joined meal data
};

export type CreateDailyMenuInput = {
    date: string;
    meal_ids: string[];
};

export type UpdateDailyMenuInput = Partial<CreateDailyMenuInput>; 