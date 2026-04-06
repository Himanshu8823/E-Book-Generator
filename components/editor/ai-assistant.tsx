"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, ChevronRight, ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  documentId: string | null
  documentType?: string
  onInsertContent: (html: string) => void
  getCurrentContent?: () => string
}

type GroqModel =
  | "llama-3.3-70b-versatile"
  | "llama-3.1-70b-versatile"
  | "llama-3.1-8b-instant"
  | "llama-3.2-90b-text-preview"
  | "mixtral-8x7b-32768"

export function AIAssistant({ documentId, documentType, onInsertContent, getCurrentContent }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedModel, setSelectedModel] = useState<GroqModel>("llama-3.3-70b-versatile")
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const currentContent = getCurrentContent ? getCurrentContent() : ''
      
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          documentId,
          model: selectedModel,
          documentType,
          currentContent, // Send current editor content for context
        }),
      })

      if (!response.ok) throw new Error("Failed to generate content")

      const data = await response.json()

      onInsertContent(data.html)

      toast({
        title: "Content Generated",
        description: "AI content has been inserted into your document",
      })

      setPrompt("")
    } catch (error) {
      console.error("[v0] Error generating content:", error)
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (isCollapsed) {
    return (
      <div className="border-l border-border bg-card">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="m-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full lg:w-80 overflow-y-auto border-t lg:border-t-0 lg:border-l border-border bg-card max-h-[300px] lg:max-h-none">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Generate Content</CardTitle>
            <CardDescription className="text-xs">Describe what you want to write</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-medium">AI Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as GroqModel)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={isGenerating}
              >
                <optgroup label="Recommended">
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B - Best Quality</option>
                  <option value="llama-3.1-70b-versatile">Llama 3.1 70B - High Quality</option>
                </optgroup>
                <optgroup label="Fast Models">
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B - Fast Generation</option>
                </optgroup>
                <optgroup label="Advanced">
                  <option value="llama-3.2-90b-text-preview">Llama 3.2 90B - Experimental</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B - Long Context</option>
                </optgroup>
              </select>
              <p className="text-xs text-muted-foreground">
                {selectedModel.includes("70b") && "Best for detailed, high-quality content"}
                {selectedModel.includes("90b") && "Experimental model with advanced capabilities"}
                {selectedModel.includes("8b") && "Fast generation, good for quick content"}
                {selectedModel.includes("mixtral") && "Excellent for long documents (32K context)"}
              </p>
            </div>
            <Textarea
              placeholder="E.g., Write a detailed introduction about climate change with statistics and examples..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              disabled={isGenerating}
              className="resize-none"
            />
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate & Insert
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-transparent"
              onClick={() =>
                setPrompt(
                  "Expand and elaborate on the existing content with more details, examples, and depth. Continue the narrative/topic naturally.",
                )
              }
              disabled={isGenerating}
            >
              Expand Current Content
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-transparent"
              onClick={() =>
                setPrompt(
                  "Continue writing the next part of the story/article. Maintain the same style, tone, and flow.",
                )
              }
              disabled={isGenerating}
            >
              Continue Writing
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-transparent"
              onClick={() =>
                setPrompt(
                  "Write a comprehensive introduction for this topic with background information, context, significance, and relevance. Include at least 3-4 detailed paragraphs.",
                )
              }
              disabled={isGenerating}
            >
              Write Introduction
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-transparent"
              onClick={() =>
                setPrompt(
                  "Expand on the previous section with detailed examples, supporting evidence, case studies, and in-depth analysis. Provide comprehensive coverage of at least 800 words.",
                )
              }
              disabled={isGenerating}
            >
              Expand Content
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-transparent"
              onClick={() =>
                setPrompt(
                  "Write a compelling conclusion that summarizes all key points, synthesizes findings, and provides final thoughts with implications and future directions.",
                )
              }
              disabled={isGenerating}
            >
              Write Conclusion
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-transparent"
              onClick={() =>
                setPrompt(
                  "Create a comprehensive literature review section with detailed analysis of existing research, studies, theories, and methodologies. Include critical evaluation.",
                )
              }
              disabled={isGenerating}
            >
              Literature Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs bg-transparent"
              onClick={() =>
                setPrompt(
                  "Write a detailed methodology section explaining the research approach, data collection methods, analysis techniques, and justification for chosen methods.",
                )
              }
              disabled={isGenerating}
            >
              Methodology Section
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
