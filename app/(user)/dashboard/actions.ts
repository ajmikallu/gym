'use server'

import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"
import { revalidatePath } from "next/cache"

// Automatically seed sample data if tables are empty
export async function seedSampleDataIfNeeded() {
  try {
    const adminClient = createAdminClient()

    // 1. Check/Seed countries
    const { data: countries } = await adminClient.from("countries").select("id")
    let countryId = countries?.[0]?.id
    if (!countries || countries.length === 0) {
      const { data: newCountry } = await adminClient
        .from("countries")
        .insert({ name: "United States", currency_code: "USD", default_tax_rate: 8.25 })
        .select()
      countryId = newCountry?.[0]?.id
    }

    if (!countryId) return

    // 2. Check/Seed branches
    const { data: branches } = await adminClient.from("branches").select("id")
    let branchIds = branches?.map(b => b.id) || []
    if (!branches || branches.length === 0) {
      const { data: newBranches } = await adminClient
        .from("branches")
        .insert([
          { name: "ApexFit Downtown", country_id: countryId, address: "123 Main St, Downtown", timezone: "America/New_York" },
          { name: "ApexFit Marina", country_id: countryId, address: "456 Marina Blvd, Waterfront", timezone: "America/New_York" }
        ])
        .select()
      branchIds = newBranches?.map(b => b.id) || []
    }

    // 3. Check/Seed activities
    const { data: activities } = await adminClient.from("activities").select("id")
    let activityIds = activities?.map(a => a.id) || []
    if (!activities || activities.length === 0) {
      const { data: newActivities } = await adminClient
        .from("activities")
        .insert([
          { name: "CrossFit Elite", requires_slot: true, allows_pt: true, description: "High-intensity functional conditioning." },
          { name: "Powerlifting Foundations", requires_slot: false, allows_pt: true, description: "Build maximal strength with barbell foundations." },
          { name: "Yoga & Recovery", requires_slot: true, allows_pt: false, description: "Restore mobility, mindfulness, and flexibility." }
        ])
        .select()
      activityIds = newActivities?.map(a => a.id) || []
    }

    // 4. Check/Seed activity_pricing
    const { data: pricings } = await adminClient.from("activity_pricing").select("id")
    if ((!pricings || pricings.length === 0) && branchIds.length > 0 && activityIds.length > 0) {
      const newPricings: any[] = []
      branchIds.forEach(branchId => {
        activityIds.forEach(activityId => {
          newPricings.push(
            { activity_id: activityId, branch_id: branchId, duration_days: 30, base_price: 99.00, pt_addon_price: 150.00 },
            { activity_id: activityId, branch_id: branchId, duration_days: 90, base_price: 249.00, pt_addon_price: 400.00 },
            { activity_id: activityId, branch_id: branchId, duration_days: 365, base_price: 799.00, pt_addon_price: 1200.00 }
          )
        })
      })
      await adminClient.from("activity_pricing").insert(newPricings)
    }

    // 5. Check/Seed trainers
    const { data: trainers } = await adminClient.from("trainers").select("id")
    if ((!trainers || trainers.length === 0) && branchIds.length > 0 && activityIds.length > 0) {
      const { data: newTrainers } = await adminClient
        .from("trainers")
        .insert([
          { name: "Coach Mike Irons", email: "mike@apexfit.com", branch_id: branchIds[0], specialization: "Strength & Conditioning" },
          { name: "Coach Sarah Flex", email: "sarah@apexfit.com", branch_id: branchIds[0], specialization: "Functional Training" },
          { name: "Emma Zen", email: "emma@apexfit.com", branch_id: branchIds[1], specialization: "Yoga & Mindfulness" }
        ])
        .select()
      
      if (newTrainers && newTrainers.length > 0) {
        // Link trainer activities
        await adminClient.from("trainer_activities").insert([
          { trainer_id: newTrainers[0].id, activity_id: activityIds[1] }, // Mike -> Powerlifting
          { trainer_id: newTrainers[1].id, activity_id: activityIds[0] }, // Sarah -> CrossFit
          { trainer_id: newTrainers[2].id, activity_id: activityIds[2] }  // Emma -> Yoga
        ])
      }
    }
  } catch (error) {
    console.error("Seeding error (can be ignored if already seeded):", error)
  }
}

export async function getMembershipDashboardData() {
  try {
    await seedSampleDataIfNeeded()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Fetch user's memberships
    const { data: memberships, error: mError } = await supabase
      .from("memberships")
      .select(`
        *,
        activity:activities(id, name, description, allows_pt),
        branch:branches(id, name, address),
        trainer:trainers(id, name, specialization)
      `)
      .eq("user_id", user.id)
      .order("purchase_date", { ascending: false })

    if (mError) throw mError

    // Fetch catalog to subscribe
    const { data: branches } = await supabase.from("branches").select("*")
    const { data: activities } = await supabase.from("activities").select("*")
    const { data: pricings } = await supabase.from("activity_pricing").select("*")
    const { data: trainers } = await supabase.from("trainers").select("id, name, branch_id, specialization")

    return {
      success: true,
      memberships: (memberships || []) as any[],
      catalog: {
        branches: branches || [],
        activities: activities || [],
        pricings: pricings || [],
        trainers: trainers || []
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to load membership data." }
  }
}

export async function createMembership(formData: {
  activityId: number
  branchId: number
  startDate: string
  durationDays: number
  hasPt: boolean
  trainerId: number | null
  price: number
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Calculate dates based on input start date
    const sDate = new Date(formData.startDate)
    const expiryDate = new Date(sDate)
    expiryDate.setDate(expiryDate.getDate() + formData.durationDays)

    const adminClient = createAdminClient()

    // Insert membership securely using the admin client to bypass default RLS insert locks
    const { data, error } = await adminClient
      .from("memberships")
      .insert({
        user_id: user.id,
        activity_id: formData.activityId,
        branch_id: formData.branchId,
        start_date: formData.startDate,
        expiry_date: expiryDate.toISOString().split('T')[0],
        duration_days: formData.durationDays,
        has_pt: formData.hasPt,
        trainer_id: formData.hasPt ? formData.trainerId : null,
        price: formData.price,
        purchase_date: new Date().toISOString().split('T')[0]
      })
      .select()

    if (error) {
      // Catch duplicate/overlapping memberships constraint error
      if (error.code === "23P01" || error.message?.includes("overlapping") || error.message?.includes("exclude")) {
        return { success: false, error: "You already have an active membership for this activity during this time range!" }
      }
      throw error
    }

    revalidatePath("/dashboard")
    return { success: true, membership: data?.[0] }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to subscribe." }
  }
}

export async function updateMembership(formData: {
  id: number
  startDate: string
  durationDays: number
  hasPt: boolean
  trainerId: number | null
  price: number
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Calculate expiry date based on new start date and duration
    const sDate = new Date(formData.startDate)
    const expiryDate = new Date(sDate)
    expiryDate.setDate(expiryDate.getDate() + formData.durationDays)

    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from("memberships")
      .update({
        start_date: formData.startDate,
        expiry_date: expiryDate.toISOString().split('T')[0],
        duration_days: formData.durationDays,
        has_pt: formData.hasPt,
        trainer_id: formData.hasPt ? formData.trainerId : null,
        price: formData.price
      })
      .eq("id", formData.id)
      .eq("user_id", user.id)

    if (error) {
      if (error.code === "23P01" || error.message?.includes("overlapping") || error.message?.includes("exclude")) {
        return { success: false, error: "Updating this plan would cause overlapping memberships for this activity!" }
      }
      throw error
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update membership." }
  }
}

export async function deleteMembership(membershipId: number) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from("memberships")
      .delete()
      .eq("id", membershipId)
      .eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to cancel membership." }
  }
}
