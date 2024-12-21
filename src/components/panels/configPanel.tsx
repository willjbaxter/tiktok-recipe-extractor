'use client'

import { useState } from 'react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Utensils } from 'lucide-react'
import GitHubButton from 'react-github-btn'

type ConfigPanelProps = {
  onExtract: (videoUrl: string, apiKey: string) => void
  loading: boolean
}

export default function ConfigPanel({ onExtract, loading }: ConfigPanelProps) {
  const [videoUrl, setVideoUrl] = useState('')
  const [apiKey, setApiKey] = useState('')

  return (
    <div className="w-1/2 p-6 space-y-6">
      <div className="flex items-center mb-8">
        <Utensils className="h-8 w-8 text-orange-500 mr-2" />
        <h1 className="text-2xl font-bold text-orange-500 mr-2">TikTok Recipe Extractor</h1>
        <GitHubButton 
          href="https://github.com/abakermi/tiktok-recipe-extractor" 
          data-color-scheme="no-preference: dark; light: light; dark: dark;" 
          data-size="large" 
          data-show-count="true" 
          aria-label="Star abakermi/tiktok-recipe-extractor on GitHub"
        >
          Star
        </GitHubButton>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Video URL</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            placeholder="Enter TikTok video URL" 
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mb-4"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Gemini API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            type="password"
            placeholder="Enter your Gemini API key" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mb-4"
          />
        </CardContent>
      </Card>
      <Button 
        className="w-full bg-orange-500 hover:bg-orange-600"
        onClick={() => onExtract(videoUrl, apiKey)}
        disabled={loading}
      >
        {loading ? 'Extracting...' : 'Extract Recipe'}
      </Button>
    </div>
  )
}