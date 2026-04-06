"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extension-placeholder"
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { Image } from "@tiptap/extension-image"
import { Underline } from "@tiptap/extension-underline"
import { TextAlign } from "@tiptap/extension-text-align"
import { FontFamily } from "@tiptap/extension-font-family"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import { Extension } from "@tiptap/core"
import { common, createLowlight } from "lowlight"
import { Pages, TableKit } from "@tiptap-pro/extension-pages"
import { TextStyleKit } from "@tiptap/extension-text-style"
import { ExportDocx } from "@tiptap-pro/extension-export-docx"
import { Ai } from "@tiptap-pro/extension-ai"
import { EditorToolbar } from "./editor-toolbar"
import { useEffect, useImperativeHandle, forwardRef, useState, useMemo } from "react"
import { threeColumnHeaderFooter } from "@/lib/tiptap/threeColumnHeaderFooter"

const lowlight = createLowlight(common)

const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {}
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: any) => {
          return chain().setMark("textStyle", { fontSize }).run()
        },
      unsetFontSize:
        () =>
        ({ chain }: any) => {
          return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run()
        },
    }
  },
})

interface TiptapEditorProps {
  content: any
  onChange: (content: any) => void
  onWordCountChange: (count: number) => void
  showPageBorders?: boolean
  showHeader?: boolean
  showFooter?: boolean
  headerConfig?: {
    left: string
    center: string
    right: string
  }
  footerConfig?: {
    left: string
    center: string
    right: string
  }
  showPageNumbers?: boolean
  onImportDocument?: (html: string) => void
}

export const TiptapEditor = forwardRef<any, TiptapEditorProps>(
  ({ 
    content, 
    onChange, 
    onWordCountChange, 
    showPageBorders = false,
    showHeader = true,
    showFooter = true,
    headerConfig = { left: 'AI eBook Editor', center: '', right: '' },
    footerConfig = { left: '', center: '', right: '{page} of {total}' },
    showPageNumbers = true,
    onImportDocument
  }, ref) => {
    const [ready, setReady] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    
    // Memoize header/footer functions to prevent recreation
    const headerFunction = useMemo(() => {
      if (!showHeader) return undefined
      return threeColumnHeaderFooter({
        left: headerConfig?.left || '',
        center: headerConfig?.center || '',
        right: headerConfig?.right || ''
      })
    }, [showHeader, headerConfig?.left, headerConfig?.center, headerConfig?.right])
    
    const footerFunction = useMemo(() => {
      if (!showFooter) return undefined
      return threeColumnHeaderFooter({
        left: footerConfig?.left || '',
        center: footerConfig?.center || '',
        right: footerConfig?.right || ''
      })
    }, [showFooter, footerConfig?.left, footerConfig?.center, footerConfig?.right])
    
    const editor = useEditor({
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      content,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),
        Pages.configure({
          pageFormat: 'A4',
          header: headerFunction,
          footer: footerFunction,
          pageBreakBackground: '#f7f7f7',
        }),
        TableKit,
        TextStyleKit,
        Placeholder.configure({
          placeholder: "Start writing or use AI to generate content...",
        }),
        Ai.configure({
          appId: process.env.NEXT_PUBLIC_TIPTAP_APP_ID,
          token: process.env.NEXT_PUBLIC_TIPTAP_API_TOKEN,
          autocompletion: true,
          onLoading: () => setIsGenerating(true),
          onSuccess: () => setIsGenerating(false),
          onError: (error) => {
            console.error('AI Error:', error)
            setIsGenerating(false)
          },
        }),
        CodeBlockLowlight.configure({
          lowlight,
        }),
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        FontFamily.configure({
          types: ["textStyle"],
        }),
        TextStyle,
        FontSize,
        Color,
        Highlight.configure({
          multicolor: true,
        }),
        ExportDocx.configure({
          onCompleteExport: result => {
            const blob = new Blob([result as BlobPart], {
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'export.docx'
            a.click()
            URL.revokeObjectURL(url)
          },
        }),
      ],
      onCreate: () => {
        setReady(true)
      },
      editorProps: {
        attributes: {
          class: "focus:outline-none",
        },
      },
      onUpdate: ({ editor }) => {
        const json = editor.getJSON()
        onChange?.(json)
        
        // Update word count
        const text = editor.getText()
        const words = text.trim().split(/\s+/).filter(word => word.length > 0)
        onWordCountChange(words.length)
      },
    }, [
      headerFunction, 
      footerFunction
    ])
    
    // Update editor content when external content changes (but not on every keystroke)
    useEffect(() => {
      if (editor && content && !editor.isFocused) {
        const currentContent = JSON.stringify(editor.getJSON())
        const newContent = JSON.stringify(content)
        if (currentContent !== newContent) {
          editor.commands.setContent(content)
        }
      }
    }, [editor, content])

    useImperativeHandle(ref, () => ({
      editor,
      insertHTML: (html: string) => {
        if (editor && ready) {
          // Get current selection
          const { from, to } = editor.state.selection
          
          // If there's selected text, delete it first
          if (from !== to) {
            editor.chain().focus().deleteSelection().run()
          }
          
          // Insert the new content at cursor position
          editor.chain().focus().insertContent(html).run()
        }
      },
      getSelectedText: () => {
        if (editor && ready) {
          const { from, to } = editor.state.selection
          return editor.state.doc.textBetween(from, to, ' ')
        }
        return ''
      },
      exportDocx: () => {
        if (editor && ready) {
          editor.chain().exportDocx().run()
        }
      },
      aiEdit: (prompt: string) => {
        if (editor && ready) {
          // Use AI text command if available, otherwise log
          if (editor.commands.aiTextPrompt) {
            editor.commands.aiTextPrompt({ text: prompt })
          } else {
            console.log('AI command not available')
          }
        }
      },
      aiComplete: () => {
        if (editor && ready) {
          editor.commands.aiComplete()
        }
      },
    }), [editor, ready])

    if (!editor) {
      return null
    }

    return (
      <div className={`w-full h-full flex flex-col ${showPageBorders ? 'page-borders-visible' : ''}`}>
        {isGenerating && (
          <div className="absolute top-20 right-4 z-50 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            AI is working...
          </div>
        )}
        {/* Sticky Toolbar */}
        <div className="sticky top-0 z-40 bg-background">
          <EditorToolbar 
            editor={editor} 
            showPageBorders={showPageBorders} 
            onImportDocument={onImportDocument}
          />
        </div>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-4xl px-4 py-8">
            {!ready && (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading document...</div>
              </div>
            )}
            <div style={{ visibility: ready ? 'visible' : 'hidden' }}>
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </div>
    )
  },
)

TiptapEditor.displayName = "TiptapEditor"
