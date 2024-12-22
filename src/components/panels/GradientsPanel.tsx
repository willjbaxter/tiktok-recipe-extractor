'use client'

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { Share } from 'lucide-react'

// Update the type to match Python service response
interface RecipeData {
  recipe: string;  // The raw recipe text
  status: string;
}

function createRecipeText(sections: { [key: string]: string[] }): string {
  const parts: string[] = [];
  
  if (sections['RECIPE NAME']) {
    parts.push(sections['RECIPE NAME'][0] || '');
    if (sections['RECIPE NAME'].length > 1) {
      parts.push(sections['RECIPE NAME'].slice(1).join('\n') || '');
    }
    parts.push('\n');
  }

  if (sections['EQUIPMENT NEEDED']) {
    parts.push('Equipment Needed:');
    parts.push(sections['EQUIPMENT NEEDED'].map((item: string) => `• ${item}`).join('\n'));
    parts.push('\n');
  }

  if (sections['INGREDIENTS']) {
    parts.push('Ingredients:');
    parts.push(sections['INGREDIENTS'].map((item: string) => `• ${item}`).join('\n'));
    parts.push('\n');
  }

  if (sections['INSTRUCTIONS']) {
    parts.push('Instructions:');
    parts.push(sections['INSTRUCTIONS'].map((item: string, i: number) => `${i + 1}. ${item}`).join('\n'));
    parts.push('\n');
  }

  if (sections['RECIPE NOTES']) {
    parts.push('Recipe Notes:');
    parts.push(sections['RECIPE NOTES'].map((item: string) => `• ${item}`).join('\n'));
  }

  return parts.join('\n');
}

const shareRecipe = async (sections: { [key: string]: string[] }) => {
  const recipeText = createRecipeText(sections);
  try {
    if (navigator.share) {
      await navigator.share({
        title: sections['RECIPE NAME']?.[0] || 'Recipe',
        text: recipeText
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const textArea = document.createElement('textarea');
      textArea.value = recipeText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Recipe copied to clipboard!');
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

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
      <div className="w-full md:w-4/5 lg:w-3/4 max-w-3xl mx-auto px-4 py-6">
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
      <div className="w-full md:w-4/5 lg:w-3/4 max-w-3xl mx-auto px-4 py-6">
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
    <div className="w-full md:w-4/5 lg:w-3/4 max-w-3xl mx-auto px-4 py-6">
      <Card className="h-full">
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <CardTitle className="text-2xl md:text-3xl text-blue-500">
              {sections['RECIPE NAME']?.[0] || 'Untitled Recipe'}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-base md:text-lg text-muted-foreground">
              {sections['RECIPE NAME']?.slice(1).map((info, index) => (
                <div key={index}>{info}</div>
              ))}
            </div>
            <Button 
              onClick={() => shareRecipe(sections)}
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 text-base md:text-lg py-6"
            >
              <Share className="h-5 w-5" />
              Share Recipe
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {sections['EQUIPMENT NEEDED'] && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-orange-500">Equipment Needed</h3>
              <ul className="space-y-2">
                {sections['EQUIPMENT NEEDED'].map((item, index) => (
                  <li key={index} className="flex items-start text-base md:text-lg">
                    • {item.replace('- ', '')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator className="my-8" />

          {sections['INGREDIENTS'] && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-orange-500">Ingredients</h3>
              <ul className="space-y-3">
                {sections['INGREDIENTS'].map((ingredient, index) => (
                  <li key={index} className="flex items-start text-base md:text-lg">
                    • {ingredient.replace('- ', '')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator className="my-8" />

          {sections['INSTRUCTIONS'] && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-orange-500">Instructions</h3>
              <div className="space-y-4">
                {sections['INSTRUCTIONS'].map((instruction, index) => (
                  <div key={index} className="flex gap-3 text-base md:text-lg">
                    <span className="text-orange-500 font-medium">{index + 1}.</span>
                    <span>{instruction.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections['RECIPE NOTES'] && (
            <>
              <Separator className="my-8" />
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-xl md:text-2xl mb-4 text-orange-500">Recipe Notes</h3>
                <ul className="space-y-2 text-base md:text-lg">
                  {sections['RECIPE NOTES'].map((note, index) => (
                    <li key={index} className="flex items-start">
                      • {note.replace('- ', '')}
                    </li>
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