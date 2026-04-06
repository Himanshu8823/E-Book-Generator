"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Table,
  Code2,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImageIcon,
  Highlighter,
  Square,
  FileUp,
} from "lucide-react"
import { useCallback, useRef } from "react"

interface EditorToolbarProps {
  editor: Editor
  showPageBorders?: boolean
  onTogglePageBorders?: () => void
  onImportDocument?: (html: string) => void
}

export function EditorToolbar({ editor, showPageBorders = false, onTogglePageBorders, onImportDocument }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  
  const addImage = useCallback(() => {
    imageInputRef.current?.click()
  }, [])

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (base64) {
        editor.chain().focus().setImage({ src: base64 }).run()
      }
    }
    reader.readAsDataURL(file)

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }, [editor])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.name.endsWith('.docx')) {
      try {
        const mammoth = (await import('mammoth')).default
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        onImportDocument?.(result.value)
      } catch (error) {
        console.error('Error importing Word document:', error)
        alert('Failed to import Word document. Please try again.')
      }
    } else {
      alert('Please select a .docx file')
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onImportDocument])

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      
      {/* Import Document */}
      {onImportDocument && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleImportClick}
            className="h-8 w-8"
            title="Import Word Document"
          >
            <FileUp className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
        </>
      )}
      
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8"
      >
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Enhanced Font Family Selector */}
      <select
        value={editor.getAttributes("textStyle").fontFamily || "Inter"}
        onChange={(e) => {
          if (e.target.value === "default") {
            editor.chain().focus().unsetFontFamily().run()
          } else {
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
        }}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs min-w-[160px]"
      >
        <option value="default">Default Font</option>
        <optgroup label="System Fonts">
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', Times, serif">Times New Roman</option>
          <option value="'Courier New', Courier, monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
          <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
          <option value="Impact, sans-serif">Impact</option>
          <option value="'Palatino Linotype', serif">Palatino</option>
          <option value="Tahoma, sans-serif">Tahoma</option>
        </optgroup>
        <optgroup label="Sans Serif">
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="'Open Sans'">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Poppins">Poppins</option>
          <option value="Raleway">Raleway</option>
          <option value="'Source Sans 3'">Source Sans</option>
          <option value="Nunito">Nunito</option>
          <option value="Ubuntu">Ubuntu</option>
          <option value="Quicksand">Quicksand</option>
          <option value="'Josefin Sans'">Josefin Sans</option>
          <option value="Cabin">Cabin</option>
          <option value="'Noto Sans'">Noto Sans</option>
          <option value="'Work Sans'">Work Sans</option>
          <option value="Archivo">Archivo</option>
          <option value="Karla">Karla</option>
          <option value="Manrope">Manrope</option>
          <option value="'DM Sans'">DM Sans</option>
          <option value="'IBM Plex Sans'">IBM Plex Sans</option>
          <option value="'Libre Franklin'">Libre Franklin</option>
          <option value="'PT Sans'">PT Sans</option>
        </optgroup>
        <optgroup label="Serif (Times New Roman Style)">
          <option value="'EB Garamond'">EB Garamond</option>
          <option value="Merriweather">Merriweather</option>
          <option value="'Playfair Display'">Playfair Display</option>
          <option value="'PT Serif'">PT Serif</option>
          <option value="'Crimson Text'">Crimson Text</option>
          <option value="Lora">Lora</option>
          <option value="'Libre Baskerville'">Libre Baskerville</option>
          <option value="'Noto Serif'">Noto Serif</option>
          <option value="'IBM Plex Serif'">IBM Plex Serif</option>
          <option value="'Cormorant Garamond'">Cormorant Garamond</option>
          <option value="Spectral">Spectral</option>
          <option value="Arvo">Arvo</option>
          <option value="Bitter">Bitter</option>
        </optgroup>
        <optgroup label="Monospace">
          <option value="'Roboto Mono'">Roboto Mono</option>
          <option value="'Source Code Pro'">Source Code Pro</option>
          <option value="'Fira Code'">Fira Code</option>
        </optgroup>
      </select>

      {/* Enhanced Font Size Selector */}
      <select
        value={editor.getAttributes("textStyle").fontSize || "16px"}
        onChange={(e) => {
          const size = e.target.value
          if (size === "default") {
            editor.chain().focus().unsetMark("textStyle").run()
          } else {
            editor.chain().focus().setMark("textStyle", { fontSize: size }).run()
          }
        }}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs min-w-[80px]"
      >
        <option value="default">Size</option>
        <option value="8px">8</option>
        <option value="9px">9</option>
        <option value="10px">10</option>
        <option value="11px">11</option>
        <option value="12px">12</option>
        <option value="13px">13</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="20px">20</option>
        <option value="22px">22</option>
        <option value="24px">24</option>
        <option value="26px">26</option>
        <option value="28px">28</option>
        <option value="30px">30</option>
        <option value="32px">32</option>
        <option value="36px">36</option>
        <option value="40px">40</option>
        <option value="48px">48</option>
        <option value="56px">56</option>
        <option value="64px">64</option>
        <option value="72px">72</option>
      </select>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        data-active={editor.isActive("heading", { level: 1 })}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        data-active={editor.isActive("heading", { level: 2 })}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        data-active={editor.isActive("heading", { level: 3 })}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        data-active={editor.isActive("bold")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        data-active={editor.isActive("italic")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        data-active={editor.isActive("underline")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        data-active={editor.isActive("strike")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        data-active={editor.isActive("highlight")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Highlighter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleCode().run()}
        data-active={editor.isActive("code")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        data-active={editor.isActive({ textAlign: "left" })}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        data-active={editor.isActive({ textAlign: "center" })}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        data-active={editor.isActive({ textAlign: "right" })}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        data-active={editor.isActive({ textAlign: "justify" })}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        data-active={editor.isActive("bulletList")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        data-active={editor.isActive("orderedList")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Quote & Code Block */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        data-active={editor.isActive("blockquote")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        data-active={editor.isActive("codeBlock")}
        className="h-8 w-8 data-[active=true]:bg-accent"
      >
        <Code2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className="h-8 w-8"
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={addImage} className="h-8 w-8">
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="icon"
        onClick={onTogglePageBorders}
        data-active={showPageBorders}
        className="h-8 w-8 data-[active=true]:bg-accent"
        title="Toggle Page Borders"
      >
        <Square className="h-4 w-4" />
      </Button>
    </div>
  )
}
