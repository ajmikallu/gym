import { getActivities, getPricings } from "@/app/(admin)/actions/activities"
import { getBranches } from "@/app/(admin)/actions/branches"
import { ActivitiesManager } from "@/app/components/admin/activities-manager"

export const metadata = {
  title: "Activities & Pricing Plan Management | Admin Dashboard",
  description: "View, edit, search, and administer physical gym activities, class types, localized pricing and membership schedules.",
}

export default async function ExercisesPage() {
  // Parallel server-side data fetching for activities, branches, and pricings
  const [activitiesResult, branchesResult, pricingsResult] = await Promise.all([
    getActivities(),
    getBranches(),
    getPricings()
  ])

  const activities = activitiesResult.success ? activitiesResult.activities : []
  const branches = branchesResult.success ? branchesResult.branches : []
  const pricings = pricingsResult.success ? pricingsResult.pricings : []

  // Collect error representations
  const error = activitiesResult.error || branchesResult.error || pricingsResult.error

  return (
    <div className="flex-1 w-full space-y-6">
      {error && (
        <div className="p-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-xl mb-4">
          ⚠️ <strong>System Warning:</strong> {error}
        </div>
      )}
      
      <ActivitiesManager 
        initialActivities={activities} 
        initialPricings={pricings}
        branches={branches} 
      />
    </div>
  )
}