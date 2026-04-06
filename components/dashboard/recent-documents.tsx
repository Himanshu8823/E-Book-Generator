"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MoreVertical, Trash2, Edit } from "lucide-react"
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

interface RecentDocumentsProps {
  documents: Document[]
}

export function RecentDocuments({ documents: initialDocs }: RecentDocumentsProps) {
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

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Your recently edited documents will appear here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">No documents yet</p>
          <Button className="mt-4" asChild>
            <Link href="/editor/new">Create your first document</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Your recently edited documents</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/documents">View all</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Link href={`/editor/${doc.id}`} className="font-medium hover:underline">
                    {doc.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {doc.word_count} words · Updated{" "}
                    {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
