'use server'

import { createClient } from "@/app/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: {
  fullName: string
  age: number | null
  height: number | null
  weight: number | null
  allergies: string[]
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.fullName.trim(),
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        allergies: formData.allergies,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/user/profile")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update profile" }
  }
}

export async function resetHealthMetrics() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        age: null,
        height: null,
        weight: null,
        allergies: [],
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/user/profile")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reset profile" }
  }
}
