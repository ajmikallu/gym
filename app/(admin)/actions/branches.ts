'use server'

import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { revalidatePath } from "next/cache"

/**
 * Verify if the currently logged-in user is an Admin or Superadmin.
 * Uses trusted server-side session user app_metadata to ensure security.
 */
async function verifyAdminOrSuperadmin() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Authentication required. Please log in.")
  }

  const role = user.app_metadata?.assigned_role?.toUpperCase()
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    throw new Error("Unauthorized. Only Admins and Superadmins can perform this action.")
  }

  return { user, role }
}

/**
 * Fetch all countries, sorted by name.
 */
export async function getCountries() {
  try {
    const adminClient = createAdminClient()
    const { data: countries, error } = await adminClient
      .from("countries")
      .select("*")
      .order("name", { ascending: true })

    if (error) throw error
    return { success: true, countries: countries || [], error: "" }
  } catch (err: any) {
    console.error("Error fetching countries:", err)
    return { success: false, countries: [], error: err.message || "Failed to fetch countries." }
  }
}

/**
 * Fetch all branches with country details, sorted by ID.
 */
export async function getBranches() {
  try {
    const adminClient = createAdminClient()
    const { data: branches, error } = await adminClient
      .from("branches")
      .select(`
        *,
        country:countries (
          id,
          name,
          currency_code,
          default_tax_rate
        )
      `)
      .order("id", { ascending: true })

    if (error) throw error
    return { success: true, branches: branches || [], error: "" }
  } catch (err: any) {
    console.error("Error fetching branches:", err)
    return { success: false, branches: [], error: err.message || "Failed to fetch branches." }
  }
}

/**
 * Create a new branch.
 */
export async function createBranch(prevState: any, formData: FormData) {
  try {
    await verifyAdminOrSuperadmin()

    const name = (formData.get("name") as string || "").trim()
    const countryIdStr = formData.get("country_id") as string
    const address = (formData.get("address") as string || "").trim()
    const timezone = (formData.get("timezone") as string || "").trim()

    // Server-side validation
    if (!name) throw new Error("Branch name is required.")
    if (!address) throw new Error("Address is required.")
    if (!timezone) throw new Error("Timezone is required.")
    
    const country_id = parseInt(countryIdStr, 10)
    if (isNaN(country_id) || country_id <= 0) {
      throw new Error("A valid country selection is required.")
    }

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("branches")
      .insert({
        name,
        country_id,
        address,
        timezone
      })
      .select()

    if (error) throw error

    revalidatePath("/admin/branches")
    return { success: true, branch: data?.[0], error: "" }
  } catch (err: any) {
    console.error("Error creating branch:", err)
    return { success: false, branch: null, error: err.message || "Failed to create branch." }
  }
}

/**
 * Update an existing branch.
 */
export async function updateBranch(prevState: any, formData: FormData) {
  try {
    await verifyAdminOrSuperadmin()

    const idStr = formData.get("id") as string
    const name = (formData.get("name") as string || "").trim()
    const countryIdStr = formData.get("country_id") as string
    const address = (formData.get("address") as string || "").trim()
    const timezone = (formData.get("timezone") as string || "").trim()

    // Server-side validation
    const id = parseInt(idStr, 10)
    if (isNaN(id) || id <= 0) throw new Error("Invalid branch ID.")
    if (!name) throw new Error("Branch name is required.")
    if (!address) throw new Error("Address is required.")
    if (!timezone) throw new Error("Timezone is required.")
    
    const country_id = parseInt(countryIdStr, 10)
    if (isNaN(country_id) || country_id <= 0) {
      throw new Error("A valid country selection is required.")
    }

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from("branches")
      .update({
        name,
        country_id,
        address,
        timezone
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/branches")
    return { success: true, error: "" }
  } catch (err: any) {
    console.error("Error updating branch:", err)
    return { success: false, error: err.message || "Failed to update branch." }
  }
}

/**
 * Delete a branch.
 */
export async function deleteBranch(branchId: number) {
  try {
    await verifyAdminOrSuperadmin()

    if (!branchId || branchId <= 0) throw new Error("Invalid branch ID.")

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from("branches")
      .delete()
      .eq("id", branchId)

    if (error) throw error

    revalidatePath("/admin/branches")
    return { success: true, error: "" }
  } catch (err: any) {
    console.error("Error deleting branch:", err)
    return { success: false, error: err.message || "Failed to delete branch." }
  }
}
