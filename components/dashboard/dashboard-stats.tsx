import { Card, CardContent } from "@/components/ui/card"
import { FileText, TrendingUp, Zap } from "lucide-react"

interface DashboardStatsProps {
  totalDocs: number
  totalWords: number
}

export function DashboardStats({ totalDocs, totalWords }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
            <p className="text-2xl font-bold">{totalDocs}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Words</p>
            <p className="text-2xl font-bold">{totalWords.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">AI Generations</p>
            <p className="text-2xl font-bold">-</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
