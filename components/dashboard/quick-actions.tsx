import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Code, Briefcase } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      icon: BookOpen,
      label: "E-Book Chapter",
      description: "Start writing an e-book",
      href: "/editor/new?type=ebook",
    },
    {
      icon: FileText,
      label: "Research Paper",
      description: "Create academic paper",
      href: "/editor/new?type=research-paper",
    },
    {
      icon: Code,
      label: "Technical Doc",
      description: "Write documentation",
      href: "/editor/new?type=technical-doc",
    },
    {
      icon: Briefcase,
      label: "Project Report",
      description: "Generate report",
      href: "/editor/new?type=project-report",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Start</CardTitle>
        <CardDescription>Start a new document</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button key={action.label} variant="outline" className="w-full justify-start bg-transparent" asChild>
            <Link href={action.href}>
              <action.icon className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
