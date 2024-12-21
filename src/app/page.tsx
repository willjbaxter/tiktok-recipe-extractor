'use client'

import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import GradientsPanel from '../components/panels/GradientsPanel'
import ConfigPanel from '../components/panels/configPanel'
import { RecipeData } from '../lib/type'

export default function RecipeExtractor() {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleExtract = async (videoUrl: string) => {
    if (loading) return
    if (!videoUrl) {
      toast.error('Please enter a valid video URL')
      return
    }
    
    setLoading(true)
    
    try {
      console.log('Sending request with URL:', videoUrl)
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl })
      })
      
      const responseData = await response.json()
      console.log('Received response:', responseData)

      if (responseData.error) {
        toast.error(responseData.error)
        return
      }

      if (!responseData.data) {
        toast.error('No recipe data received')
        return
      }

      setRecipeData(responseData.data)
      toast.success('Recipe extracted successfully!')
    } catch (error) {
      console.error('Error extracting recipe:', error)
      toast.error('Failed to extract recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-orange-50">
        <div className="container mx-auto flex">
          <ConfigPanel onExtract={handleExtract} loading={loading} />
          <GradientsPanel recipeData={recipeData || undefined} loading={loading} />
        </div>
      </div>
    </>
  )
}