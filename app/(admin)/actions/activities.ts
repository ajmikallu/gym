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

/* ==========================================
   ACTIVITIES CRUD ACTIONS
   ========================================== */

/**
 * Fetch all activities, sorted by name.
 */
export async function getActivities() {
  try {
    const adminClient = createAdminClient()
    const { data: activities, error } = await adminClient
      .from("activities")
      .select("*")
      .order("name", { ascending: true })

    if (error) throw error
    return { success: true, activities: activities || [], error: "" }
  } catch (err: any) {
    console.error("Error fetching activities:", err)
    return { success: false, activities: [], error: err.message || "Failed to fetch activities." }
  }
}

/**
 * Create a new activity.
 */
export async function createActivity(prevState: any, formData: FormData) {
  try {
    await verifyAdminOrSuperadmin()

    const name = (formData.get("name") as string || "").trim()
    const description = (formData.get("description") as string || "").trim()
    const requiresSlot = formData.get("requires_slot") === "true" || formData.get("requires_slot") === "on"
    const allowsPt = formData.get("allows_pt") === "true" || formData.get("allows_pt") === "on"

    // Server-side validation
    if (!name) throw new Error("Activity name is required.")

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("activities")
      .insert({
        name,
        description,
        requires_slot: requiresSlot,
        allows_pt: allowsPt
      })
      .select()

    if (error) throw error

    revalidatePath("/admin/exercises")
    return { success: true, activity: data?.[0], error: "" }
  } catch (err: any) {
    console.error("Error creating activity:", err)
    return { success: false, activity: null, error: err.message || "Failed to create activity." }
  }
}

/**
 * Update an existing activity.
 */
export async function updateActivity(prevState: any, formData: FormData) {
  try {
    await verifyAdminOrSuperadmin()

    const idStr = formData.get("id") as string
    const name = (formData.get("name") as string || "").trim()
    const description = (formData.get("description") as string || "").trim()
    const requiresSlot = formData.get("requires_slot") === "true" || formData.get("requires_slot") === "on"
    const allowsPt = formData.get("allows_pt") === "true" || formData.get("allows_pt") === "on"

    // Server-side validation
    const id = parseInt(idStr, 10)
    if (isNaN(id) || id <= 0) throw new Error("Invalid activity ID.")
    if (!name) throw new Error("Activity name is required.")

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from("activities")
      .update({
        name,
        description,
        requires_slot: requiresSlot,
        allows_pt: allowsPt
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/exercises")
    return { success: true, error: "" }
  } catch (err: any) {
    console.error("Error updating activity:", err)
    return { success: false, error: err.message || "Failed to update activity." }
  }
}

/**
 * Delete an activity.
 */
export async function deleteActivity(activityId: number) {
  try {
    await verifyAdminOrSuperadmin()

    if (!activityId || activityId <= 0) throw new Error("Invalid activity ID.")

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from("activities")
      .delete()
      .eq("id", activityId)

    if (error) throw error

    revalidatePath("/admin/exercises")
    return { success: true, error: "" }
  } catch (err: any) {
    console.error("Error deleting activity:", err)
    return { success: false, error: err.message || "Failed to delete activity." }
  }
}

/* ==========================================
   ACTIVITY PRICING CRUD ACTIONS
   ========================================== */

/**
 * Fetch all activity pricings with activity and branch details.
 */
export async function getPricings() {
  try {
    const adminClient = createAdminClient()
    const { data: pricings, error } = await adminClient
      .from("activity_pricing")
      .select(`
        *,
        activity:activities (
          id,
          name,
          requires_slot,
          allows_pt
        ),
        branch:branches (
          id,
          name,
          address
        )
      `)
      .order("id", { ascending: true })

    if (error) throw error
    return { success: true, pricings: pricings || [], error: "" }
  } catch (err: any) {
    console.error("Error fetching pricings:", err)
    return { success: false, pricings: [], error: err.message || "Failed to fetch pricings." }
  }
}

/**
 * Create a new pricing plan.
 */
export async function createPricing(prevState: any, formData: FormData) {
  try {
    await verifyAdminOrSuperadmin()

    const activityIdStr = formData.get("activity_id") as string
    const branchIdStr = formData.get("branch_id") as string
    const durationDaysStr = formData.get("duration_days") as string
    const basePriceStr = formData.get("base_price") as string
    const ptAddonPriceStr = formData.get("pt_addon_price") as string

    // Parsing and validation
    const activity_id = parseInt(activityIdStr, 10)
    const branch_id = parseInt(branchIdStr, 10)
    const duration_days = parseInt(durationDaysStr, 10)
    const base_price = parseFloat(basePriceStr)
    const pt_addon_price = parseFloat(ptAddonPriceStr || "0")

    if (isNaN(activity_id) || activity_id <= 0) throw new Error("A valid activity is required.")
    if (isNaN(branch_id) || branch_id <= 0) throw new Error("A valid branch is required.")
    if (isNaN(duration_days) || duration_days <= 0) throw new Error("Duration in days must be greater than 0.")
    if (isNaN(base_price) || base_price < 0) throw new Error("Base price must be a valid non-negative number.")
    if (isNaN(pt_addon_price) || pt_addon_price < 0) throw new Error("PT addon price must be a valid non-negative number.")

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("activity_pricing")
      .insert({
        activity_id,
        branch_id,
        duration_days,
        base_price,
        pt_addon_price
      })
      .select()

    if (error) throw error

    revalidatePath("/admin/exercises")
    return { success: true, pricing: data?.[0], error: "" }
  } catch (err: any) {
    console.error("Error creating pricing plan:", err)
    return { success: false, pricing: null, error: err.message || "Failed to create pricing plan." }
  }
}

/**
 * Update an existing pricing plan.
 */
export async function updatePricing(prevState: any, formData: FormData) {
  try {
    await verifyAdminOrSuperadmin()

    const idStr = formData.get("id") as string
    const activityIdStr = formData.get("activity_id") as string
    const branchIdStr = formData.get("branch_id") as string
    const durationDaysStr = formData.get("duration_days") as string
    const basePriceStr = formData.get("base_price") as string
    const ptAddonPriceStr = formData.get("pt_addon_price") as string

    // Parsing and validation
    const id = parseInt(idStr, 10)
    const activity_id = parseInt(activityIdStr, 10)
    const branch_id = parseInt(branchIdStr, 10)
    const duration_days = parseInt(durationDaysStr, 10)
    const base_price = parseFloat(basePriceStr)
    const pt_addon_price = parseFloat(ptAddonPriceStr || "0")

    if (isNaN(id) || id <= 0) throw new Error("Invalid pricing plan ID.")
    if (isNaN(activity_id) || activity_id <= 0) throw new Error("A valid activity is required.")
    if (isNaN(branch_id) || branch_id <= 0) throw new Error("A valid branch is required.")
    if (isNaN(duration_days) || duration_days <= 0) throw new Error("Duration in days must be greater than 0.")
    if (isNaN(base_price) || base_price < 0) throw new Error("Base price must be a valid non-negative number.")
    if (isNaN(pt_addon_price) || pt_addon_price < 0) throw new Error("PT addon price must be a valid non-negative number.")

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from("activity_pricing")
      .update({
        activity_id,
        branch_id,
        duration_days,
        base_price,
        pt_addon_price
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/exercises")
    return { success: true, error: "" }
  } catch (err: any) {
    console.error("Error updating pricing plan:", err)
    return { success: false, error: err.message || "Failed to update pricing plan." }
  }
}

/**
 * Delete a pricing plan.
 */
export async function deletePricing(pricingId: number) {
  try {
    await verifyAdminOrSuperadmin()

    if (!pricingId || pricingId <= 0) throw new Error("Invalid pricing ID.")

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from("activity_pricing")
      .delete()
      .eq("id", pricingId)

    if (error) throw error

    revalidatePath("/admin/exercises")
    return { success: true, error: "" }
  } catch (err: any) {
    console.error("Error deleting pricing plan:", err)
    return { success: false, error: err.message || "Failed to delete pricing plan." }
  }
}
