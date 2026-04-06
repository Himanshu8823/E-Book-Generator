"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, Code, FileCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportMenuProps {
  documentId: string | null
  title: string
  content: any
}

export function ExportMenu({ documentId, title, content }: ExportMenuProps) {
  const { toast } = useToast()

  const handleExport = async (format: string) => {
    if (!documentId) {
      toast({
        title: "Error",
        description: "Please save the document before exporting",
        variant: "destructive",
      })
      return
    }

    try {
      if (format === "pdf") {
        const response = await fetch("/api/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId, format, title, content }),
        })

        if (!response.ok) throw new Error("Export failed")

        const html = await response.text()

        const iframe = document.createElement("iframe")
        iframe.style.display = "none"
        document.body.appendChild(iframe)

        const iframeDoc = iframe.contentWindow?.document
        if (iframeDoc) {
          iframeDoc.open()
          iframeDoc.write(html)
          iframeDoc.close()

          iframe.onload = () => {
            iframe.contentWindow?.print()
            setTimeout(() => document.body.removeChild(iframe), 1000)
          }
        }

        toast({
          title: "Print Dialog Opened",
          description: "Save as PDF from the print dialog",
        })
        return
      }

      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, format, title, content }),
      })

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      const extension = format === "docx" ? "docx" : format === "markdown" ? "md" : "html"
      a.download = `${title}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: `Document exported as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error("[v0] Export error:", error)
      toast({
        title: "Error",
        description: "Failed to export document",
        variant: "destructive",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="mr-2 h-4 w-4" />
          PDF Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("docx")}>
          <FileCode className="mr-2 h-4 w-4" />
          Word Document (.docx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("markdown")}>
          <Code className="mr-2 h-4 w-4" />
          Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("html")}>
          <FileCode className="mr-2 h-4 w-4" />
          HTML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
