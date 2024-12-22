'use client'

import { useState } from 'react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"
import { Utensils } from 'lucide-react'

type ConfigPanelProps = {
  onExtract: (videoUrl: string) => void
  loading: boolean
}

export default function ConfigPanel({ onExtract, loading }: ConfigPanelProps) {
  const [videoUrl, setVideoUrl] = useState('')

  return (
    <div className="w-full px-4 py-6 max-w-lg mx-auto">
      <div className="flex flex-col items-center mb-6">
        <Utensils className="h-8 w-8 text-orange-500 mb-2" />
        <h1 className="text-2xl font-bold text-orange-500 mb-2">
          TikTok Recipe Extractor
        </h1>
        <p className="text-base text-gray-600 text-center px-4">
          Turn your favorite TikTok cooking videos into easy-to-follow recipes
        </p>
      </div>
      
      <Card className="shadow-sm border border-orange-100">
        <CardContent className="pt-4">
          <div className="space-y-3">
            <Input 
              placeholder="Paste your TikTok URL here..." 
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="text-base p-4 rounded-lg border border-orange-200 focus:border-orange-500"
            />
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-base py-4"
              onClick={() => onExtract(videoUrl)}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                  <span>Extracting...</span>
                </div>
              ) : (
                'Extract Recipe'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}