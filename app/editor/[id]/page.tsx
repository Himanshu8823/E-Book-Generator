import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EditorContainer } from "@/components/editor/editor-container"

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch document if id is not 'new'
  let document = null
  if (id !== "new") {
    const { data } = await supabase.from("documents").select("*").eq("id", id).eq("user_id", user.id).single()
    document = data
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />
      <EditorContainer document={document} userId={user.id} />
    </div>
  )
}
