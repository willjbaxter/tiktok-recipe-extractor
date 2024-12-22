'use client'

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

// Update the type to match Python service response
interface RecipeData {
  recipe: string;  // The raw recipe text
  status: string;
}

function parseRecipeText(text: string) {
  const sections: { [key: string]: string[] } = {};
  let currentSection = '';
  
  text.split('\n').forEach(line => {
    line = line.trim();
    if (!line) return;
    
    // Check for main section headers
    if (line.endsWith(':')) {
      currentSection = line.replace(':', '');
      sections[currentSection] = [];
    } else if (currentSection) {
      sections[currentSection].push(line);
    }
  });
  
  return sections;
}

export default function GradientsPanel({ recipeData, loading }: { recipeData?: RecipeData, loading: boolean }) {
  if (loading) {
    return (
      <div className="w-1/2 p-6 bg-white">
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

  if (!recipeData || !recipeData.recipe) {
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

  const sections = parseRecipeText(recipeData.recipe);

  return (
    <div className="w-1/2 p-6 bg-white">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-blue-500">
            {sections['RECIPE NAME']?.[0] || 'Untitled Recipe'}
          </CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {sections['RECIPE NAME']?.slice(1).map((info, index) => (
              <div key={index}>{info}</div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections['EQUIPMENT NEEDED'] && (
            <div>
              <h3 className="font-semibold text-lg mb-3 text-orange-500">Equipment Needed</h3>
              <ul className="space-y-1">
                {sections['EQUIPMENT NEEDED'].map((item, index) => (
                  <li key={index} className="flex items-start">
                    {item.replace('- ', '')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {sections['INGREDIENTS'] && (
            <div>
              <h3 className="font-semibold text-lg mb-3 text-orange-500">Ingredients</h3>
              <ul className="space-y-2">
                {sections['INGREDIENTS'].map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    {ingredient.replace('- ', '')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {sections['INSTRUCTIONS'] && (
            <div>
              <h3 className="font-semibold text-lg mb-3 text-orange-500">Instructions</h3>
              <div className="space-y-2">
                {sections['INSTRUCTIONS'].map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-orange-500 font-medium">{index + 1}.</span>
                    <span>{instruction.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections['RECIPE NOTES'] && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3 text-orange-500">Recipe Notes</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {sections['RECIPE NOTES'].map((note, index) => (
                    <li key={index}>{note.replace('- ', '')}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}