import { getBranches, getCountries } from "@/app/(admin)/actions/branches"
import { BranchesManager } from "@/app/components/admin/branches-manager"

export const metadata = {
  title: "Branch Management | Admin Dashboard",
  description: "View, edit, search, and administer physical gym branches, localization, addresses, and schedule settings.",
}

export default async function BranchesPage() {
  // Parallel server-side data fetching for branches and countries
  const [branchesResult, countriesResult] = await Promise.all([
    getBranches(),
    getCountries()
  ])

  const branches = branchesResult.success ? branchesResult.branches : []
  const countries = countriesResult.success ? countriesResult.countries : []

  // Clean error representation if data fetching fails
  const error = branchesResult.error || countriesResult.error

  return (
    <div className="flex-1 w-full space-y-6">
      {error && (
        <div className="p-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-xl mb-4">
          ⚠️ <strong>System Warning:</strong> {error}
        </div>
      )}
      
      <BranchesManager 
        initialBranches={branches} 
        countries={countries} 
      />
    </div>
  )
}
