export type RecipeOverview = {
  title: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
  cuisine_type: string;
}

export type Ingredient = {
  item: string;
  amount: string;
  unit: string | null;
  notes?: string;
}

export type RecipeData = {
    recipe_overview: RecipeOverview;
    ingredients: Ingredient[];
    equipment: string[];
    instructions: string[];
}
