"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { 
  MapPin, 
  Globe, 
  Building2, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  AlertCircle, 
  Check, 
  Clock 
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { createBranch, updateBranch, deleteBranch } from "@/app/(admin)/actions/branches"

interface Country {
  id: number
  name: string
  currency_code: string
  default_tax_rate: number
}

interface Branch {
  id: number
  name: string
  country_id: number
  address: string
  timezone: string
  country?: Country
}

interface BranchesManagerProps {
  initialBranches: Branch[]
  countries: Country[]
}

const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney"
]

export function BranchesManager({ initialBranches, countries }: BranchesManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountryFilter, setSelectedCountryFilter] = useState("all")

  // Modals state
  const [activeModal, setActiveModal] = useState<"create" | "edit" | "delete" | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Form field states
  const [branchName, setBranchName] = useState("")
  const [branchAddress, setBranchAddress] = useState("")
  const [branchCountryId, setBranchCountryId] = useState("")
  const [branchTimezone, setBranchTimezone] = useState("America/New_York")

  // Filtered branches
  const filteredBranches = initialBranches.filter((branch) => {
    const matchesSearch = 
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.timezone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.country?.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCountry = 
      selectedCountryFilter === "all" || 
      branch.country_id.toString() === selectedCountryFilter

    return matchesSearch && matchesCountry
  })

  // Calculate Metrics
  const totalBranches = initialBranches.length
  const uniqueCountries = new Set(initialBranches.map(b => b.country_id)).size
  const timezoneCount = new Set(initialBranches.map(b => b.timezone)).size

  // Modal open handlers
  const openCreateModal = () => {
    setBranchName("")
    setBranchAddress("")
    setBranchCountryId(countries[0]?.id.toString() || "")
    setBranchTimezone("America/New_York")
    setFormError("")
    setFormSuccess("")
    setActiveModal("create")
  }

  const openEditModal = (branch: Branch) => {
    setSelectedBranch(branch)
    setBranchName(branch.name)
    setBranchAddress(branch.address)
    setBranchCountryId(branch.country_id.toString())
    setBranchTimezone(branch.timezone)
    setFormError("")
    setFormSuccess("")
    setActiveModal("edit")
  }

  const openDeleteModal = (branch: Branch) => {
    setSelectedBranch(branch)
    setFormError("")
    setFormSuccess("")
    setActiveModal("delete")
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedBranch(null)
    setFormError("")
    setFormSuccess("")
  }

  // Action handlers
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")

    if (!branchName.trim()) {
      setFormError("Branch name is required.")
      return
    }
    if (!branchAddress.trim()) {
      setFormError("Address is required.")
      return
    }
    if (!branchCountryId) {
      setFormError("Country is required.")
      return
    }
    if (!branchTimezone) {
      setFormError("Timezone is required.")
      return
    }

    const formData = new FormData()
    formData.append("name", branchName)
    formData.append("address", branchAddress)
    formData.append("country_id", branchCountryId)
    formData.append("timezone", branchTimezone)

    startTransition(async () => {
      const res = await createBranch(null, formData)
      if (res.success) {
        setFormSuccess("Branch created successfully!")
        router.refresh()
        setTimeout(() => closeModal(), 1000)
      } else {
        setFormError(res.error || "Failed to create branch.")
      }
    })
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedBranch) return
    setFormError("")
    setFormSuccess("")

    if (!branchName.trim()) {
      setFormError("Branch name is required.")
      return
    }
    if (!branchAddress.trim()) {
      setFormError("Address is required.")
      return
    }
    if (!branchCountryId) {
      setFormError("Country is required.")
      return
    }
    if (!branchTimezone) {
      setFormError("Timezone is required.")
      return
    }

    const formData = new FormData()
    formData.append("id", selectedBranch.id.toString())
    formData.append("name", branchName)
    formData.append("address", branchAddress)
    formData.append("country_id", branchCountryId)
    formData.append("timezone", branchTimezone)

    startTransition(async () => {
      const res = await updateBranch(null, formData)
      if (res.success) {
        setFormSuccess("Branch updated successfully!")
        router.refresh()
        setTimeout(() => closeModal(), 1000)
      } else {
        setFormError(res.error || "Failed to update branch.")
      }
    })
  }

  const handleDeleteSubmit = async () => {
    if (!selectedBranch) return
    setFormError("")
    setFormSuccess("")

    startTransition(async () => {
      const res = await deleteBranch(selectedBranch.id)
      if (res.success) {
        setFormSuccess("Branch deleted successfully!")
        router.refresh()
        setTimeout(() => closeModal(), 1000)
      } else {
        setFormError(res.error || "Failed to delete branch.")
      }
    })
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Gym Branches</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your physical gym branches, localization, address settings, and local timezones.
          </p>
        </div>
        <Button 
          onClick={openCreateModal} 
          className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition duration-200 py-6 px-5 font-semibold text-base flex items-center gap-2 rounded-xl shadow-lg hover:shadow-xl self-start md:self-auto shrink-0"
        >
          <Plus className="w-5 h-5" />
          Add Branch
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-lg transition duration-300 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 dark:bg-indigo-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Branches</CardTitle>
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-500 group-hover:scale-110 transition duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{totalBranches}</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Across all locations</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-lg transition duration-300 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600 dark:bg-emerald-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Active Countries</CardTitle>
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{uniqueCountries}</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Geographic regions served</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-lg transition duration-300 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-600 dark:bg-amber-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Timezones</CardTitle>
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{timezoneCount}</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Operating local schedules</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card: Search, filter & Table */}
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
        <CardHeader className="pb-4 border-b border-zinc-150 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/60">
          <div>
            <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-150">All Branches</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400">
              Search, filter, edit, or delete existing branches. Changes sync instantly.
            </CardDescription>
          </div>
          
          {/* Filters controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <Input
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100 rounded-xl"
              />
            </div>

            {/* Country filter dropdown */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              <select
                value={selectedCountryFilter}
                onChange={(e) => setSelectedCountryFilter(e.target.value)}
                className="pl-9 pr-8 py-2 w-full sm:w-44 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-700 dark:text-zinc-300 appearance-none h-[38px]"
              >
                <option value="all">All Countries</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm border-collapse">
              <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="h-12 px-6 text-left align-middle">ID</th>
                  <th className="h-12 px-6 text-left align-middle">Name</th>
                  <th className="h-12 px-6 text-left align-middle">Country</th>
                  <th className="h-12 px-6 text-left align-middle">Address</th>
                  <th className="h-12 px-6 text-left align-middle">Timezone</th>
                  <th className="h-12 px-6 text-right align-middle pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filteredBranches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-32 text-center text-zinc-400 dark:text-zinc-500 font-medium">
                      No branches found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBranches.map((branch) => (
                    <tr 
                      key={branch.id} 
                      className="group hover:bg-zinc-50/55 dark:hover:bg-zinc-900/30 transition duration-150"
                    >
                      <td className="p-6 align-middle font-mono text-xs text-zinc-400 dark:text-zinc-500">
                        #{branch.id}
                      </td>
                      <td className="p-6 align-middle font-semibold text-zinc-900 dark:text-zinc-50">
                        {branch.name}
                      </td>
                      <td className="p-6 align-middle">
                        <span className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 gap-1.5 shadow-sm">
                          <Globe className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                          {branch.country?.name || `ID: ${branch.country_id}`}
                        </span>
                      </td>
                      <td className="p-6 align-middle text-zinc-600 dark:text-zinc-300 max-w-xs truncate">
                        {branch.address}
                      </td>
                      <td className="p-6 align-middle text-zinc-600 dark:text-zinc-300 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {branch.timezone}
                        </span>
                      </td>
                      <td className="p-6 align-middle text-right pr-8">
                        <div className="flex items-center justify-end gap-2.5">
                          <Button
                            onClick={() => openEditModal(branch)}
                            size="icon"
                            variant="ghost"
                            className="w-9 h-9 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-50 rounded-xl transition duration-150"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => openDeleteModal(branch)}
                            size="icon"
                            variant="ghost"
                            className="w-9 h-9 border border-red-200/60 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl transition duration-150"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CREATE & EDIT FORM DIALOGS */}
      {(activeModal === "create" || activeModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphic backdrop */}
          <div 
            onClick={closeModal} 
            className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm transition duration-300"
          ></div>
          
          {/* Modal Card Content */}
          <Card className="w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl relative z-10 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transform scale-100 transition duration-300">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {activeModal === "create" ? "Add New Branch" : "Edit Branch"}
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Fill in the branch details below. All fields are required.
                </CardDescription>
              </div>
              <Button 
                onClick={closeModal} 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 rounded-xl hover:bg-zinc-150 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </Button>
            </CardHeader>
            
            <form onSubmit={activeModal === "create" ? handleCreateSubmit : handleEditSubmit}>
              <CardContent className="p-6 space-y-5">
                {/* Status Banners */}
                {formError && (
                  <div className="p-4 text-sm text-red-800 dark:text-red-250 bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/60 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="font-semibold">{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="p-4 text-sm text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/85 dark:border-emerald-900/50 rounded-xl flex items-start gap-2.5">
                    <Check className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="font-semibold">{formSuccess}</span>
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="branch-name">
                    <Building2 className="w-4 h-4 text-zinc-400" />
                    Branch Name
                  </label>
                  <Input 
                    id="branch-name" 
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    required 
                    placeholder="e.g. ApexFit East Coast" 
                    className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="branch-country">
                    <Globe className="w-4 h-4 text-zinc-400" />
                    Country Location
                  </label>
                  <select
                    id="branch-country"
                    value={branchCountryId}
                    onChange={(e) => setBranchCountryId(e.target.value)}
                    required
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-800 dark:text-zinc-200"
                  >
                    {countries.length === 0 ? (
                      <option value="">No countries configured</option>
                    ) : (
                      countries.map((c) => (
                        <option key={c.id} value={c.id.toString()}>
                          {c.name} ({c.currency_code})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="branch-address">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    Physical Address
                  </label>
                  <Input 
                    id="branch-address" 
                    value={branchAddress}
                    onChange={(e) => setBranchAddress(e.target.value)}
                    required 
                    placeholder="e.g. 56 Main Avenue, Suite 400" 
                    className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="branch-timezone">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    Timezone Schedule
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="branch-timezone-select"
                      value={COMMON_TIMEZONES.includes(branchTimezone) ? branchTimezone : "custom"}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val !== "custom") setBranchTimezone(val)
                      }}
                      className="flex-1 h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-800 dark:text-zinc-200"
                    >
                      {COMMON_TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                      <option value="custom">Other (Specify manually)</option>
                    </select>
                  </div>
                  {(!COMMON_TIMEZONES.includes(branchTimezone) || branchTimezone === "custom") && (
                    <Input 
                      id="branch-timezone" 
                      value={branchTimezone === "custom" ? "" : branchTimezone}
                      onChange={(e) => setBranchTimezone(e.target.value)}
                      required 
                      placeholder="e.g. Asia/Tokyo" 
                      className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 mt-2"
                    />
                  )}
                </div>
              </CardContent>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  onClick={closeModal} 
                  variant="ghost" 
                  disabled={isPending}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-5"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending || countries.length === 0}
                  className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl px-6 font-semibold flex items-center gap-1.5 shadow-md shadow-zinc-900/10 min-w-[120px] justify-center h-10"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    activeModal === "create" ? "Add Branch" : "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {activeModal === "delete" && selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={closeModal} 
            className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm transition duration-300"
          ></div>
          
          <Card className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl relative z-10 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transform scale-100 transition duration-300">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between bg-red-50/20 dark:bg-red-950/10">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
                <CardTitle className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">Delete Branch</CardTitle>
              </div>
              <Button 
                onClick={closeModal} 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 rounded-xl hover:bg-zinc-150 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4">
              {formError && (
                <div className="p-4 text-sm text-red-800 dark:text-red-250 bg-red-50 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/60 rounded-xl">
                  <span className="font-semibold">{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-4 text-sm text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/85 dark:border-emerald-900/50 rounded-xl">
                  <span className="font-semibold">{formSuccess}</span>
                </div>
              )}

              <p className="text-zinc-600 dark:text-zinc-350 text-base leading-relaxed">
                Are you absolutely sure you want to delete the branch <strong className="text-zinc-900 dark:text-zinc-100 font-bold">"{selectedBranch.name}"</strong>?
              </p>
              
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 rounded-xl text-sm text-amber-800 dark:text-amber-400 font-medium">
                ⚠️ <strong>Warning:</strong> Deleting this branch will cascade and permanently delete associated pricing, trainers, trainer assignments, and active memberships! This action is irreversible.
              </div>
            </CardContent>

            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 flex items-center justify-end gap-3">
              <Button 
                type="button" 
                onClick={closeModal} 
                variant="ghost" 
                disabled={isPending}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-5"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteSubmit} 
                disabled={isPending}
                className="bg-red-650 dark:bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 font-semibold flex items-center gap-1.5 shadow-md shadow-red-900/10 min-w-[120px] justify-center h-10"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
