import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TemplateGrid } from "@/components/templates/template-grid"

export default async function TemplatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch all public templates and user's custom templates
  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .or(`is_public.eq.true,created_by.eq.${user.id}`)
    .order("created_at", { ascending: false })

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Document Templates</h1>
          <p className="mt-1 text-muted-foreground">Choose a template to start your document</p>
        </div>
        <TemplateGrid templates={templates || []} />
      </main>
    </div>
  )
}
