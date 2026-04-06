"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MoreVertical, Trash2, Edit, Plus } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useConfirm } from "@/components/ui/confirm-dialog"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  title: string
  document_type: string
  word_count: number
  updated_at: string
  status: string
}

interface DocumentsGridProps {
  documents: Document[]
}

export function DocumentsGrid({ documents: initialDocs }: DocumentsGridProps) {
  const [documents, setDocuments] = useState(initialDocs)
  const router = useRouter()
  const supabase = createClient()
  const { confirm } = useConfirm()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete Document",
      description: "Are you sure you want to delete this document? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    })

    if (!confirmed) return

    const { error } = await supabase.from("documents").delete().eq("id", id)

    if (!error) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* New Document Card */}
      <Card className="border-dashed">
        <CardContent className="flex h-full min-h-[200px] flex-col items-center justify-center p-6">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" asChild>
            <Link href="/editor/new">
              <Plus className="h-6 w-6" />
            </Link>
          </Button>
          <p className="mt-4 text-sm font-medium">New Document</p>
          <p className="text-xs text-muted-foreground">Start from scratch</p>
        </CardContent>
      </Card>

      {documents.map((doc) => (
        <Card key={doc.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/editor/${doc.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(doc.id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link href={`/editor/${doc.id}`} className="block">
              <h3 className="mb-2 font-semibold hover:underline">{doc.title}</h3>
              <p className="mb-4 text-xs text-muted-foreground">
                {doc.word_count} words · {doc.document_type.replace("-", " ")}
              </p>
              <p className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
              </p>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
