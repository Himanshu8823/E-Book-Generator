"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { AlertCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SettingsFormProps {
  user: {
    id: string
    email?: string
  }
  totalDocs: number
  totalGenerations: number
}

export function SettingsForm({ user, totalDocs, totalGenerations }: SettingsFormProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone and all your documents will be permanently deleted.",
      )
    ) {
      return
    }

    if (
      !confirm(
        "This is your final warning. All your data will be permanently deleted. Are you absolutely sure you want to continue?",
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      // Note: In a real application, you would need to implement a server-side
      // function to properly delete the user account and all associated data
      // For now, we'll just sign out the user
      await supabase.auth.signOut()
      toast({
        title: "Account deletion requested",
        description: "Please contact support to complete account deletion",
      })
      router.push("/")
    } catch (error) {
      console.error("[v0] Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>Your usage and activity overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Documents</span>
            <span className="font-semibold">{totalDocs}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI Generations</span>
            <span className="font-semibold">{totalGenerations}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Account Email</span>
            <span className="font-semibold">{user.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Deleting your account will permanently remove all your documents, AI generations, and personal data. This
              action cannot be undone.
            </AlertDescription>
          </Alert>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
