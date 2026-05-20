import { notFound, redirect } from "next/navigation"
import { createClient } from "@/app/lib/supabase/server"
import { ProfileEditor } from "./profile-editor"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (slug !== "profile") {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Load the authenticated user's profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    // Return empty fallback profile object if loading failed or not created yet
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Error loading health profile</h2>
        <p className="text-zinc-500 mt-2">Could not retrieve profile record. Please check your system status or try again.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <ProfileEditor profile={profile} />
    </div>
  )
}