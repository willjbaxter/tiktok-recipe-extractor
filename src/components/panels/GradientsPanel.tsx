'use client'

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { RecipeData } from "../../lib/type"

export default function GradientsPanel({ recipeData, loading }: { recipeData?: RecipeData, loading: boolean }) {
  if (loading) {
    return (
      <div className="w-1/2  p-6 bg-white">
        <Card className="h-full">
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded-md animate-pulse w-2/3" />
            <div className="flex gap-4 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((section) => (
              <div key={section}>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4 mb-4" />
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2" />
                ))}
                {section !== 3 && <Separator className="my-6" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!recipeData || !recipeData.recipe_overview) {
    return (
      <div className="w-1/2 p-6 bg-white">
        <Card className="h-full">
          <CardContent className="flex items-center justify-center h-full text-muted-foreground">
            No recipe data available
          </CardContent>
        </Card>
      </div>
    )
  }

  const { recipe_overview, ingredients = [], equipment = [], instructions = [] } = recipeData;

  return (
    <div className="w-1/2 p-6 bg-white">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-blue-500">{recipe_overview.title || 'Untitled Recipe'}</CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div>Prep: {recipe_overview.prep_time || 'N/A'}</div>
            <div>Cook: {recipe_overview.cook_time || 'N/A'}</div>
            <div>Servings: {typeof recipe_overview.servings === 'number' ? recipe_overview.servings.toString() : 'N/A'}</div>
            <div>Difficulty: {recipe_overview.difficulty || 'N/A'}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-orange-500">Ingredients</h3>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="font-medium">
                    {ingredient.amount || ''} {ingredient.unit || ''}
                  </span>
                  <span className="mx-2">{ingredient.item || 'Unknown ingredient'}</span>
                  {ingredient.notes && (
                    <span className="text-muted-foreground">({ingredient.notes})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-3 text-orange-500">Equipment Needed</h3>
            <ul className="list-disc list-inside space-y-1">
              {equipment.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-3 text-orange-500">Instructions</h3>
            <div className="whitespace-pre-line text-muted-foreground">
              {instructions.map((instruction, index) => (
                <div key={index}> {index+1}. {instruction}</div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}