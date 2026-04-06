import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EditorContainer } from "@/components/editor/editor-container"

export default async function NewEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; template?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch template if specified
  let template = null
  if (params.template) {
    const { data } = await supabase.from("templates").select("*").eq("id", params.template).single()
    template = data
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />
      <EditorContainer userId={user.id} documentType={params.type} template={template} />
    </div>
  )
}
