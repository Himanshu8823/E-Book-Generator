"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen } from "lucide-react"

export interface EbookMetadata {
  bookTitle: string
  authorName: string
  publisher: string
  publicationDate: string
  isbn: string
  edition: string
  description: string
  category: string
}

interface EbookMetadataFormProps {
  onSubmit: (metadata: EbookMetadata) => void
  onCancel?: () => void
}

export function EbookMetadataForm({ onSubmit, onCancel }: EbookMetadataFormProps) {
  const [metadata, setMetadata] = useState<EbookMetadata>({
    bookTitle: "",
    authorName: "",
    publisher: "",
    publicationDate: new Date().toISOString().split('T')[0],
    isbn: "",
    edition: "1st Edition",
    description: "",
    category: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(metadata)
  }

  const handleChange = (field: keyof EbookMetadata, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>eBook Metadata</CardTitle>
              <CardDescription>Fill in the details for your eBook</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bookTitle">
                  Book Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bookTitle"
                  placeholder="Enter book title"
                  value={metadata.bookTitle}
                  onChange={(e) => handleChange("bookTitle", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorName">
                  Author Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="authorName"
                  placeholder="Enter author name"
                  value={metadata.authorName}
                  onChange={(e) => handleChange("authorName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  placeholder="Enter publisher name"
                  value={metadata.publisher}
                  onChange={(e) => handleChange("publisher", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicationDate">Publication Date</Label>
                <Input
                  id="publicationDate"
                  type="date"
                  value={metadata.publicationDate}
                  onChange={(e) => handleChange("publicationDate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  placeholder="978-0-000-00000-0"
                  value={metadata.isbn}
                  onChange={(e) => handleChange("isbn", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edition">Edition</Label>
                <Input
                  id="edition"
                  placeholder="1st Edition"
                  value={metadata.edition}
                  onChange={(e) => handleChange("edition", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category/Genre</Label>
              <Input
                id="category"
                placeholder="Fiction, Non-Fiction, Science, etc."
                value={metadata.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the book"
                value={metadata.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Continue to Editor
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
