import { createClient } from "@/app/lib/supabase/server"
import { redirect } from "next/navigation"
import { getMembershipDashboardData } from "../actions"
import { MembershipTab } from "../membership-tab"

/**
 * MembershipPage Component
 * 
 * The standalone page for managing gym memberships, subscriptions, and coaches.
 * Fetches relevant database details and passes them into the interactive MembershipTab component.
 * 
 * @returns {Promise<JSX.Element>} The rendered Membership page
 */
export default async function MembershipPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { user } = session
  
  // Safe, pre-verified server-side role retrieval
  const role = user?.app_metadata?.assigned_role || user?.role || "customer"
  const isCustomer = role === "customer"

  // Only customers are authorized to access and manage memberships
  if (!isCustomer) {
    redirect("/dashboard")
  }

  const dataRes = await getMembershipDashboardData()
  let memberships: any[] = []
  let catalog: any = { branches: [], activities: [], pricings: [], trainers: [] }

  if (dataRes.success) {
    memberships = dataRes.memberships || []
    catalog = dataRes.catalog || catalog
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <MembershipTab
        initialMemberships={memberships}
        catalog={catalog}
      />
    </div>
  )
}
