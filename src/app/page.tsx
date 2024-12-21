'use client'

import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

import GradientsPanel from '../components/panels/GradientsPanel'
import ConfigPanel from '../components/panels/configPanel'
import { RecipeData } from '../lib/type'


export default function RecipeExtractor() {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleExtract = async (videoUrl: string, apiKey: string) => {
    if (loading) return
    if (!videoUrl || !apiKey) {
      toast.error('Please enter a valid video URL and API key')
      return
    }
    
    setLoading(true) // Set loading to true when starting
    
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: JSON.stringify({ videoUrl, apiKey }),
      })
      const responseData = await response.json()
      setRecipeData(responseData.data)
    } catch (error) {
      console.error('Error extracting recipe:', error)
    } finally {
      setLoading(false) // Set loading to false when done
    }
  }

  return (
<>
<ToastContainer />

    <div className=" min-h-screen bg-orange-50">
      <div className="container mx-auto flex">
        <ConfigPanel onExtract={handleExtract} loading={loading} />
        <GradientsPanel recipeData={recipeData|| undefined} loading={loading} />
      </div>


    </div>
    </>
  )
}