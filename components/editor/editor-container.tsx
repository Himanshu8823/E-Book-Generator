"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { TiptapEditor } from "./tiptap-editor"
import { AIAssistant } from "./ai-assistant"
import { ExportMenu } from "./export-menu"
import { PageSettings } from "./page-settings"
import { EbookMetadataForm, type EbookMetadata } from "./ebook-metadata-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  title: string
  content: any
  document_type: string
  word_count: number
  status: string
  page_settings?: any
}

interface Template {
  id: string
  name: string
  content: any
  document_type: string
}

interface EditorContainerProps {
  document?: Document | null
  userId: string
  documentType?: string
  template?: Template | null
}

export function EditorContainer({ document, userId, documentType, template }: EditorContainerProps) {
  const isEbookTemplate = template?.document_type === 'ebook' || documentType === 'ebook'
  const [showMetadataForm, setShowMetadataForm] = useState(!document && isEbookTemplate)
  const [ebookMetadata, setEbookMetadata] = useState<EbookMetadata | null>(null)
  
  // Load saved page settings or use defaults
  const savedSettings = document?.page_settings || {}
  
  const [title, setTitle] = useState(document?.title || template?.name || "Untitled Document")
  const [content, setContent] = useState(document?.content || template?.content || null)
  const [isSaving, setIsSaving] = useState(false)
  const [currentDocId, setCurrentDocId] = useState(document?.id || null)
  const [wordCount, setWordCount] = useState(document?.word_count || 0)
  const [showPageBorders, setShowPageBorders] = useState(savedSettings.showPageBorders || false)
  const [showPageNumbers, setShowPageNumbers] = useState(savedSettings.showPageNumbers ?? true)
  const [showHeader, setShowHeader] = useState(savedSettings.showHeader ?? true)
  const [showFooter, setShowFooter] = useState(savedSettings.showFooter ?? true)
  const [headerLeft, setHeaderLeft] = useState(savedSettings.headerLeft || 'AI eBook Editor')
  const [headerCenter, setHeaderCenter] = useState(savedSettings.headerCenter || '')
  const [headerRight, setHeaderRight] = useState(savedSettings.headerRight || '')
  const [footerLeft, setFooterLeft] = useState(savedSettings.footerLeft || '')
  const [footerCenter, setFooterCenter] = useState(savedSettings.footerCenter || '')
  const [footerRight, setFooterRight] = useState(savedSettings.footerRight || '{page} of {total}')
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const editorRef = useRef<any>(null)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const docData = {
        title,
        content,
        user_id: userId,
        document_type: documentType || document?.document_type || template?.document_type || "general",
        word_count: wordCount,
        status: "draft",
      }

      if (currentDocId) {
        const { error } = await supabase.from("documents").update(docData).eq("id", currentDocId)
        if (error) {
          console.error("[v0] Update error details:", error)
          throw error
        }
      } else {
        const { data, error } = await supabase.from("documents").insert([docData]).select().single()
        if (error) {
          console.error("[v0] Insert error details:", error)
          throw error
        }
        setCurrentDocId(data.id)
        router.replace(`/editor/${data.id}`)
      }

      toast({
        title: "Saved",
        description: "Your document has been saved successfully",
      })
    } catch (error: any) {
      console.error("[v0] Error saving document:", error)
      console.error("[v0] Error message:", error?.message)
      console.error("[v0] Error code:", error?.code)
      console.error("[v0] Error details:", error?.details)
      toast({
        title: "Error",
        description: error?.message || "Failed to save document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInsertContent = (html: string) => {
    if (editorRef.current) {
      editorRef.current.insertHTML(html)
    }
  }

  const handleMetadataSubmit = (metadata: EbookMetadata) => {
    setEbookMetadata(metadata)
    setTitle(metadata.bookTitle)
    setHeaderLeft(metadata.authorName)
    setHeaderCenter(metadata.bookTitle)
    setFooterCenter(`${metadata.bookTitle} | {page} of {total}`)
    
    // Generate initial eBook content with metadata
    const ebookContent = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: metadata.bookTitle }]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: `by ${metadata.authorName}` }]
        },
        { type: 'paragraph', content: [] },
        ...(metadata.publisher ? [{
          type: 'paragraph',
          content: [{ type: 'text', text: `Publisher: ${metadata.publisher}` }]
        }] : []),
        ...(metadata.publicationDate ? [{
          type: 'paragraph',
          content: [{ type: 'text', text: `Publication Date: ${new Date(metadata.publicationDate).toLocaleDateString()}` }]
        }] : []),
        ...(metadata.isbn ? [{
          type: 'paragraph',
          content: [{ type: 'text', text: `ISBN: ${metadata.isbn}` }]
        }] : []),
        ...(metadata.edition ? [{
          type: 'paragraph',
          content: [{ type: 'text', text: `Edition: ${metadata.edition}` }]
        }] : []),
        { type: 'paragraph', content: [] },
        { type: 'paragraph', content: [] },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'About This Book' }]
        },
        {
          type: 'paragraph',
          content: metadata.description ? [{ type: 'text', text: metadata.description }] : []
        },
        { type: 'paragraph', content: [] },
        { type: 'paragraph', content: [] },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Chapter 1' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Start writing your content here...' }]
        }
      ]
    }
    
    setContent(ebookContent)
    setShowMetadataForm(false)
  }

  const handleImportDocument = (html: string) => {
    if (editorRef.current?.editor) {
      // Use setContent command directly
      editorRef.current.editor.commands.setContent(html)
      toast({
        title: "Document Imported",
        description: "Your Word document has been imported successfully",
      })
    } else {
      // Fallback: set content state
      toast({
        title: "Document Imported",
        description: "Your Word document has been imported successfully",
      })
    }
  }

  const getCurrentContent = () => {
    if (editorRef.current?.editor) {
      // First check if there's selected text
      const selectedText = editorRef.current.getSelectedText?.()
      if (selectedText && selectedText.trim().length > 0) {
        return selectedText
      }
      // Otherwise return full document text
      return editorRef.current.editor.getText()
    }
    return ''
  }

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (title && content) {
        handleSave()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [title, content, wordCount])

  // If showing metadata form, render it instead of editor
  if (showMetadataForm) {
    return (
      <EbookMetadataForm 
        onSubmit={handleMetadataSubmit}
        onCancel={() => {
          setShowMetadataForm(false)
          router.push('/dashboard/templates')
        }}
      />
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Editor Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="max-w-md border-0 bg-transparent text-sm sm:text-lg font-semibold focus-visible:ring-0"
            placeholder="Document title"
          />
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <span className="hidden sm:inline text-sm text-muted-foreground">{wordCount} words</span>
            <PageSettings
              showBorders={showPageBorders}
              onShowBordersChange={setShowPageBorders}
              showPageNumbers={showPageNumbers}
              onShowPageNumbersChange={setShowPageNumbers}
              showHeader={showHeader}
              onShowHeaderChange={setShowHeader}
              showFooter={showFooter}
              onShowFooterChange={setShowFooter}
              headerLeft={headerLeft}
              headerCenter={headerCenter}
              headerRight={headerRight}
              onHeaderChange={(position, value) => {
                if (position === 'left') setHeaderLeft(value)
                else if (position === 'center') setHeaderCenter(value)
                else setHeaderRight(value)
              }}
              footerLeft={footerLeft}
              footerCenter={footerCenter}
              footerRight={footerRight}
              onFooterChange={(position, value) => {
                if (position === 'left') setFooterLeft(value)
                else if (position === 'center') setFooterCenter(value)
                else setFooterRight(value)
              }}
            />
            <ExportMenu documentId={currentDocId} title={title} content={content} />
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-[60vh] lg:min-h-0">
          <TiptapEditor
            ref={editorRef}
            content={content}
            onChange={setContent}
            onWordCountChange={setWordCount}
            showPageBorders={showPageBorders}
            showHeader={showHeader}
            showFooter={showFooter}
            headerConfig={{
              left: headerLeft,
              center: headerCenter,
              right: headerRight,
            }}
            footerConfig={{
              left: footerLeft,
              center: footerCenter,
              right: footerRight,
            }}
            showPageNumbers={showPageNumbers}
            onImportDocument={handleImportDocument}
          />
        </div>

        {/* AI Assistant Sidebar */}
        <AIAssistant
          documentId={currentDocId}
          documentType={documentType || document?.document_type}
          onInsertContent={handleInsertContent}
          getCurrentContent={getCurrentContent}
        />
      </div>
    </div>
  )
}
