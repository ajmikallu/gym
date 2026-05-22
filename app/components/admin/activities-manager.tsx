"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Dumbbell,
  Receipt,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Briefcase,
  HelpCircle,
  Sparkles,
  Percent
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { 
  createActivity, 
  updateActivity, 
  deleteActivity, 
  createPricing, 
  updatePricing, 
  deletePricing 
} from "@/app/(admin)/actions/activities"

interface Activity {
  id: number
  name: string
  requires_slot: boolean
  allows_pt: boolean
  description: string | null
}

interface Branch {
  id: number
  name: string
  address: string
}

interface Pricing {
  id: number
  activity_id: number
  branch_id: number
  duration_days: number
  base_price: number
  pt_addon_price: number
  activity?: Activity
  branch?: Branch
}

interface ActivitiesManagerProps {
  initialActivities: Activity[]
  initialPricings: Pricing[]
  branches: Branch[]
}

export function ActivitiesManager({ initialActivities, initialPricings, branches }: ActivitiesManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Tabs state
  const [activeTab, setActiveTab] = useState<"activities" | "pricing">("activities")

  // Search and filter states
  const [activitySearch, setActivitySearch] = useState("")
  const [pricingSearch, setPricingSearch] = useState("")
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("all")

  // Modals state
  const [activeModal, setActiveModal] = useState<"create_activity" | "edit_activity" | "delete_activity" | "create_pricing" | "edit_pricing" | "delete_pricing" | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedPricing, setSelectedPricing] = useState<Pricing | null>(null)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Activity form states
  const [activityName, setActivityName] = useState("")
  const [activityDescription, setActivityDescription] = useState("")
  const [activityRequiresSlot, setActivityRequiresSlot] = useState(false)
  const [activityAllowsPt, setActivityAllowsPt] = useState(false)

  // Pricing form states
  const [pricingActivityId, setPricingActivityId] = useState("")
  const [pricingBranchId, setPricingBranchId] = useState("")
  const [pricingDurationDays, setPricingDurationDays] = useState("30")
  const [pricingBasePrice, setPricingBasePrice] = useState("")
  const [pricingPtAddonPrice, setPricingPtAddonPrice] = useState("")

  // Filtered lists
  const filteredActivities = initialActivities.filter((act) => {
    return act.name.toLowerCase().includes(activitySearch.toLowerCase()) ||
      (act.description || "").toLowerCase().includes(activitySearch.toLowerCase())
  })

  const filteredPricings = initialPricings.filter((pr) => {
    const matchesSearch = 
      (pr.activity?.name || "").toLowerCase().includes(pricingSearch.toLowerCase()) ||
      (pr.branch?.name || "").toLowerCase().includes(pricingSearch.toLowerCase())

    const matchesBranch = 
      selectedBranchFilter === "all" || 
      pr.branch_id.toString() === selectedBranchFilter

    return matchesSearch && matchesBranch
  })

  // Calculate Metrics
  const totalActivities = initialActivities.length
  const totalPricings = initialPricings.length
  const requiresSlotCount = initialActivities.filter(a => a.requires_slot).length
  const allowsPtCount = initialActivities.filter(a => a.allows_pt).length

  // Modal open handlers
  const openCreateActivityModal = () => {
    setActivityName("")
    setActivityDescription("")
    setActivityRequiresSlot(false)
    setActivityAllowsPt(false)
    setFormError("")
    setFormSuccess("")
    setActiveModal("create_activity")
  }

  const openEditActivityModal = (activity: Activity) => {
    setSelectedActivity(activity)
    setActivityName(activity.name)
    setActivityDescription(activity.description || "")
    setActivityRequiresSlot(activity.requires_slot)
    setActivityAllowsPt(activity.allows_pt)
    setFormError("")
    setFormSuccess("")
    setActiveModal("edit_activity")
  }

  const openDeleteActivityModal = (activity: Activity) => {
    setSelectedActivity(activity)
    setFormError("")
    setFormSuccess("")
    setActiveModal("delete_activity")
  }

  const openCreatePricingModal = () => {
    setPricingActivityId(initialActivities[0]?.id.toString() || "")
    setPricingBranchId(branches[0]?.id.toString() || "")
    setPricingDurationDays("30")
    setPricingBasePrice("")
    setPricingPtAddonPrice("")
    setFormError("")
    setFormSuccess("")
    setActiveModal("create_pricing")
  }

  const openEditPricingModal = (pricing: Pricing) => {
    setSelectedPricing(pricing)
    setPricingActivityId(pricing.activity_id.toString())
    setPricingBranchId(pricing.branch_id.toString())
    setPricingDurationDays(pricing.duration_days.toString())
    setPricingBasePrice(pricing.base_price.toString())
    setPricingPtAddonPrice(pricing.pt_addon_price.toString())
    setFormError("")
    setFormSuccess("")
    setActiveModal("edit_pricing")
  }

  const openDeletePricingModal = (pricing: Pricing) => {
    setSelectedPricing(pricing)
    setFormError("")
    setFormSuccess("")
    setActiveModal("delete_pricing")
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedActivity(null)
    setSelectedPricing(null)
    setFormError("")
    setFormSuccess("")
  }

  // Submit handlers
  const handleCreateActivitySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")

    if (!activityName.trim()) {
      setFormError("Activity name is required.")
      return
    }

    const formData = new FormData()
    formData.append("name", activityName)
    formData.append("description", activityDescription)
    formData.append("requires_slot", activityRequiresSlot ? "true" : "false")
    formData.append("allows_pt", activityAllowsPt ? "true" : "false")

    startTransition(async () => {
      const res = await createActivity(null, formData)
      if (res.success) {
        setFormSuccess("Activity created successfully!")
        router.refresh()
        setTimeout(() => closeModal(), 1000)
      } else {
        setFormError(res.error || "Failed to create activity.")
      }
    })
  }

  const handleEditActivitySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedActivity) return
    setFormError("")
    setFormSuccess("")

    if (!activityName.trim()) {
      setFormError("Activity name is required.")
      return
    }

    const formData = new FormData()
    formData.append("id", selectedActivity.id.toString())
    formData.append("name", activityName)
    formData.append("description", activityDescription)
    formData.append("requires_slot", activityRequiresSlot ? "true" : "false")
    formData.append("allows_pt", activityAllowsPt ? "true" : "false")

    startTransition(async () => {
      const res = await updateActivity(null, formData)
      if (res.success) {
        setFormSuccess("Activity updated successfully!")
        router.refresh()
        setTimeout(() => closeModal(), 1000)
      } else {
        setFormError(res.error || "Failed to update activity.")
      }
    })
  }

  const handleDeleteActivitySubmit = async () => {
    if (!selectedActivity) return
    setFormError("")
    setFormSuccess("")

    startTransition(async () => {
      const res = await deleteActivity(selectedActivity.id)
      if (res.success) {
        setFormSuccess("Activity deleted successfully!")
        router.refresh()
        setTimeout(() => closeModal(), 1000)
      } else {
        setFormError(res.error || "Failed to delete activity.")
      }
    })
  }

  const handleCreatePricingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")

    if (!pricingActivityId) {
      setFormError("Activity selection is required.")
      return
    }
    if (!pricingBranchId) {
      setFormError("Branch selection is required.")
      return
    }
    if (!pricingDurationDays || parseInt(pricingDurationDays, 10) <= 0) {
      setFormError("Duration in days must be greater than 0.")
      return
    }
    if (!pricingBasePrice || parseFloat(pricingBasePrice) < 0) {
      setFormError("Base price must be a valid non-negative number.")
      return
    }

    const formData = new FormData()
    formData.append("activity_id", pricingActivityId)
    formData.append("branch_id", pricingBranchId)
    formData.append("duration_days", pricingDurationDays)
    formData.append("base_price", pricingBasePrice)
    formData.append("pt_addon_price", pricingPtAddonPrice || "0")

    startTransition(async () => {
      const res = await createPricing(null, formData)
      if (res.success) {
        setFormSuccess("Pricing plan created successfully!")
        router.refresh()
        setTimeout(() => closeModal(), 1000)
      } else {
        setFormError(res.error || "Failed to create pricing plan.")
      }
    })
  }

  const handleEditPricingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedPricing) return
    setFormError("")
    setFormSuccess("")

    if (!pricingActivityId) {
      setFormError("Activity selection is required.")
      return
    }
    if (!pricingBranchId) {
      setFormError("Branch selection is required.")
      return
    }
    if (!pricingDurationDays || parseInt(pricingDurationDays, 10) <= 0) {
      setFormError("Duration in days must be greater than 0.")
      return
    }
    if (!pricingBasePrice || parseFloat(pricingBasePrice) < 0) {
      setFormError("Base price must be a valid non-negative number.")
      return
    }

    const formData = new FormData()
    formData.append("id", selectedPricing.id.toString())
    formData.append("activity_id", pricingActivityId)
    formData.append("branch_id", pricingBranchId)
    formData.append("duration_days", pricingDurationDays)
    formData.append("base_price", pricingBasePrice)
    formData.append("pt_addon_price", pricingPtAddonPrice || "0")

    startTransition(async () => {
      const res = await updatePricing(null, formData)
      if (res.success) {
        setFormSuccess("Pricing plan updated successfully!")
        router.refresh()
        setTimeout(() => closeModal(), 1000)
      } else {
        setFormError(res.error || "Failed to update pricing plan.")
      }
    })
  }

  const handleDeletePricingSubmit = async () => {
    if (!selectedPricing) return
    setFormError("")
    setFormSuccess("")

    startTransition(async () => {
      const res = await deletePricing(selectedPricing.id)
      if (res.success) {
        setFormSuccess("Pricing plan deleted successfully!")
        router.refresh()
        setTimeout(() => closeModal(), 1000)
      } else {
        setFormError(res.error || "Failed to delete pricing plan.")
      }
    })
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Activities & Local Pricing</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Configure available classes, exercise programs, capacity limitations, and branch-specific membership pricing structures.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 self-start md:self-auto shrink-0">
          <Button 
            onClick={activeTab === "activities" ? openCreateActivityModal : openCreatePricingModal}
            className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition duration-200 py-6 px-5 font-semibold text-base flex items-center gap-2 rounded-xl shadow-lg hover:shadow-xl shrink-0"
          >
            <Plus className="w-5 h-5" />
            {activeTab === "activities" ? "Add Activity" : "Add Price Plan"}
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-lg transition duration-300 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 dark:bg-indigo-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Activities</CardTitle>
            <Dumbbell className="w-5 h-5 text-indigo-600 dark:text-indigo-500 group-hover:scale-110 transition duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{totalActivities}</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Active class formats</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-lg transition duration-300 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600 dark:bg-emerald-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Pricing Packages</CardTitle>
            <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{totalPricings}</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Schedules across branches</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-lg transition duration-300 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-600 dark:bg-amber-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Requires Booking</CardTitle>
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{requiresSlotCount}</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Capacity-constrained classes</p>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-lg transition duration-300 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-600 dark:bg-pink-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Allows PT Coaching</CardTitle>
            <Briefcase className="w-5 h-5 text-pink-600 dark:text-pink-500 group-hover:scale-110 transition duration-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{allowsPtCount}</div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Personal Training eligible</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6">
        <button
          onClick={() => setActiveTab("activities")}
          className={`pb-4 text-base font-bold flex items-center gap-2 border-b-2 transition duration-200 ${
            activeTab === "activities"
              ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50"
              : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-350"
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          Gym Activities
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          className={`pb-4 text-base font-bold flex items-center gap-2 border-b-2 transition duration-200 ${
            activeTab === "pricing"
              ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50"
              : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-350"
          }`}
        >
          <Receipt className="w-5 h-5" />
          Pricing Schedules
        </button>
      </div>

      {/* ACTIVITIES TAB VIEW */}
      {activeTab === "activities" && (
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
          <CardHeader className="pb-4 border-b border-zinc-150 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/60">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-150">All Activities</CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">
                Configure physical activities. Changes sync instantly across scheduling features.
              </CardDescription>
            </div>
            
            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <Input
                placeholder="Search activities..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100 rounded-xl"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm border-collapse">
                <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs font-semibold">
                  <tr>
                    <th className="h-12 px-6 text-left align-middle w-16">ID</th>
                    <th className="h-12 px-6 text-left align-middle">Name</th>
                    <th className="h-12 px-6 text-left align-middle">Description</th>
                    <th className="h-12 px-6 text-center align-middle">Requires Slot Booking</th>
                    <th className="h-12 px-6 text-center align-middle">Allows Personal Trainer</th>
                    <th className="h-12 px-6 text-right align-middle pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="h-32 text-center text-zinc-400 dark:text-zinc-500 font-medium">
                        No activities found.
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((activity) => (
                      <tr 
                        key={activity.id} 
                        className="group hover:bg-zinc-50/55 dark:hover:bg-zinc-900/30 transition duration-150"
                      >
                        <td className="p-6 align-middle font-mono text-xs text-zinc-400 dark:text-zinc-500">
                          #{activity.id}
                        </td>
                        <td className="p-6 align-middle font-semibold text-zinc-900 dark:text-zinc-50">
                          {activity.name}
                        </td>
                        <td className="p-6 align-middle text-zinc-500 dark:text-zinc-400 max-w-sm truncate">
                          {activity.description || <span className="italic text-zinc-300 dark:text-zinc-650">No description provided</span>}
                        </td>
                        <td className="p-6 align-middle text-center">
                          {activity.requires_slot ? (
                            <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-400 shadow-sm gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-500 animate-pulse"></span>
                              Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-650 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                              Open Access
                            </span>
                          )}
                        </td>
                        <td className="p-6 align-middle text-center">
                          {activity.allows_pt ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400 shadow-sm">
                              Eligible
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-650 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                              No PT Addon
                            </span>
                          )}
                        </td>
                        <td className="p-6 align-middle text-right pr-8">
                          <div className="flex items-center justify-end gap-2.5">
                            <Button
                              onClick={() => openEditActivityModal(activity)}
                              size="icon"
                              variant="ghost"
                              className="w-9 h-9 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-50 rounded-xl transition duration-150"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeleteActivityModal(activity)}
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
      )}

      {/* PRICING PLANS TAB VIEW */}
      {activeTab === "pricing" && (
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
          <CardHeader className="pb-4 border-b border-zinc-150 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/60">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-150">Localized Pricing Schedules</CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">
                Manage branch rates and personal training package rates.
              </CardDescription>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <Input
                  placeholder="Search pricing..."
                  value={pricingSearch}
                  onChange={(e) => setPricingSearch(e.target.value)}
                  className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-100 rounded-xl"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                <select
                  value={selectedBranchFilter}
                  onChange={(e) => setSelectedBranchFilter(e.target.value)}
                  className="pl-9 pr-8 py-2 w-full sm:w-44 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-700 dark:text-zinc-300 appearance-none h-[38px]"
                >
                  <option value="all">All Branches</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id.toString()}>
                      {b.name}
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
                    <th className="h-12 px-6 text-left align-middle w-16">ID</th>
                    <th className="h-12 px-6 text-left align-middle">Activity Program</th>
                    <th className="h-12 px-6 text-left align-middle">Physical Branch</th>
                    <th className="h-12 px-6 text-center align-middle">Duration Packages</th>
                    <th className="h-12 px-6 text-right align-middle">Base Membership Price</th>
                    <th className="h-12 px-6 text-right align-middle">PT Coaching Addon</th>
                    <th className="h-12 px-6 text-right align-middle pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {filteredPricings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-32 text-center text-zinc-400 dark:text-zinc-500 font-medium">
                        No pricing plan configured. Click "Add Price Plan" to create one!
                      </td>
                    </tr>
                  ) : (
                    filteredPricings.map((pricing) => (
                      <tr 
                        key={pricing.id} 
                        className="group hover:bg-zinc-50/55 dark:hover:bg-zinc-900/30 transition duration-150"
                      >
                        <td className="p-6 align-middle font-mono text-xs text-zinc-400 dark:text-zinc-500">
                          #{pricing.id}
                        </td>
                        <td className="p-6 align-middle">
                          <span className="inline-flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                            <Dumbbell className="w-4 h-4 text-zinc-400" />
                            {pricing.activity?.name || `Activity #${pricing.activity_id}`}
                          </span>
                        </td>
                        <td className="p-6 align-middle font-medium text-zinc-700 dark:text-zinc-300">
                          {pricing.branch?.name || `Branch #${pricing.branch_id}`}
                        </td>
                        <td className="p-6 align-middle text-center">
                          <span className="inline-flex items-center rounded-full border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 shadow-sm gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {pricing.duration_days} Days
                          </span>
                        </td>
                        <td className="p-6 align-middle text-right font-extrabold text-zinc-900 dark:text-zinc-100">
                          ${Number(pricing.base_price).toFixed(2)}
                        </td>
                        <td className="p-6 align-middle text-right">
                          {pricing.activity?.allows_pt ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              +${Number(pricing.pt_addon_price).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-zinc-300 dark:text-zinc-700 italic text-xs">
                              PT Not Allowed
                            </span>
                          )}
                        </td>
                        <td className="p-6 align-middle text-right pr-8">
                          <div className="flex items-center justify-end gap-2.5">
                            <Button
                              onClick={() => openEditPricingModal(pricing)}
                              size="icon"
                              variant="ghost"
                              className="w-9 h-9 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-50 rounded-xl transition duration-150"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => openDeletePricingModal(pricing)}
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
      )}

      {/* ACTIVITIES DIALOGS (CREATE & EDIT) */}
      {(activeModal === "create_activity" || activeModal === "edit_activity") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={closeModal} className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm"></div>
          
          <Card className="w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl relative z-10 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {activeModal === "create_activity" ? "Add Gym Activity" : "Edit Gym Activity"}
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Specify details for the class format.
                </CardDescription>
              </div>
              <Button onClick={closeModal} variant="ghost" size="icon" className="w-9 h-9 rounded-xl">
                <X className="w-5 h-5 text-zinc-500" />
              </Button>
            </CardHeader>
            
            <form onSubmit={activeModal === "create_activity" ? handleCreateActivitySubmit : handleEditActivitySubmit}>
              <CardContent className="p-6 space-y-5">
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

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="act-name">
                    <Dumbbell className="w-4 h-4 text-zinc-400" />
                    Activity Name
                  </label>
                  <Input 
                    id="act-name" 
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    required 
                    placeholder="e.g. CrossFit, Powerlifting, Yoga" 
                    className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="act-desc">
                    Description
                  </label>
                  <textarea
                    id="act-desc"
                    value={activityDescription}
                    onChange={(e) => setActivityDescription(e.target.value)}
                    placeholder="Brief description of requirements, style, or intensity..."
                    rows={3}
                    className="flex w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-800 dark:text-zinc-200"
                  />
                </div>

                {/* Checkboxes / Switches */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3 border border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-950/80 transition duration-150 select-none">
                    <input
                      type="checkbox"
                      checked={activityRequiresSlot}
                      onChange={(e) => setActivityRequiresSlot(e.target.checked)}
                      className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Requires Booking</span>
                      <span className="text-xxs text-zinc-400 mt-0.5">Capacity constraint</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-950/80 transition duration-150 select-none">
                    <input
                      type="checkbox"
                      checked={activityAllowsPt}
                      onChange={(e) => setActivityAllowsPt(e.target.checked)}
                      className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Allows Coaching</span>
                      <span className="text-xxs text-zinc-400 mt-0.5">PT addon eligible</span>
                    </div>
                  </label>
                </div>
              </CardContent>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 flex items-center justify-end gap-3">
                <Button type="button" onClick={closeModal} variant="ghost" disabled={isPending} className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-5">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl px-6 font-semibold flex items-center gap-1.5 shadow-md min-w-[120px] justify-center h-10">
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    activeModal === "create_activity" ? "Add Activity" : "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* PRICING DIALOGS (CREATE & EDIT) */}
      {(activeModal === "create_pricing" || activeModal === "edit_pricing") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={closeModal} className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm"></div>
          
          <Card className="w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl relative z-10 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {activeModal === "create_pricing" ? "Configure Price Plan" : "Edit Price Plan"}
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1">
                  Define durations and local branch rates.
                </CardDescription>
              </div>
              <Button onClick={closeModal} variant="ghost" size="icon" className="w-9 h-9 rounded-xl">
                <X className="w-5 h-5 text-zinc-500" />
              </Button>
            </CardHeader>
            
            <form onSubmit={activeModal === "create_pricing" ? handleCreatePricingSubmit : handleEditPricingSubmit}>
              <CardContent className="p-6 space-y-5">
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

                {/* Activity Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="pr-activity">
                    <Dumbbell className="w-4 h-4 text-zinc-400" />
                    Activity Program
                  </label>
                  <select
                    id="pr-activity"
                    value={pricingActivityId}
                    onChange={(e) => setPricingActivityId(e.target.value)}
                    required
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-800 dark:text-zinc-200 animate-none"
                  >
                    {initialActivities.length === 0 ? (
                      <option value="">No activities available. Create one first!</option>
                    ) : (
                      initialActivities.map((a) => (
                        <option key={a.id} value={a.id.toString()}>
                          {a.name} {a.allows_pt ? "(Allows PT)" : ""}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Branch Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="pr-branch">
                    <Briefcase className="w-4 h-4 text-zinc-400" />
                    Physical Gym Branch
                  </label>
                  <select
                    id="pr-branch"
                    value={pricingBranchId}
                    onChange={(e) => setPricingBranchId(e.target.value)}
                    required
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-800 dark:text-zinc-200 animate-none"
                  >
                    {branches.length === 0 ? (
                      <option value="">No branches available. Create one first!</option>
                    ) : (
                      branches.map((b) => (
                        <option key={b.id} value={b.id.toString()}>
                          {b.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Duration days */}
                  <div className="space-y-2 col-span-1">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="pr-duration">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      Duration
                    </label>
                    <select
                      id="pr-duration"
                      value={pricingDurationDays}
                      onChange={(e) => setPricingDurationDays(e.target.value)}
                      required
                      className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none"
                    >
                      <option value="30">30 Days</option>
                      <option value="90">90 Days</option>
                      <option value="180">180 Days</option>
                      <option value="365">365 Days</option>
                    </select>
                  </div>

                  {/* Base Membership Price */}
                  <div className="space-y-2 col-span-1">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="pr-baseprice">
                      Base Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">$</span>
                      <Input
                        id="pr-baseprice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={pricingBasePrice}
                        onChange={(e) => setPricingBasePrice(e.target.value)}
                        required
                        placeholder="99.00"
                        className="pl-7 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* PT Addon price (only show/enable if selected activity allows PT) */}
                  <div className="space-y-2 col-span-1">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5" htmlFor="pr-ptprice">
                      PT Addon
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">$</span>
                      <Input
                        id="pr-ptprice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={pricingPtAddonPrice}
                        onChange={(e) => setPricingPtAddonPrice(e.target.value)}
                        disabled={
                          !initialActivities.find(a => a.id.toString() === pricingActivityId)?.allows_pt
                        }
                        placeholder={
                          initialActivities.find(a => a.id.toString() === pricingActivityId)?.allows_pt
                            ? "150.00"
                            : "N/A"
                        }
                        className="pl-7 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {!initialActivities.find(a => a.id.toString() === pricingActivityId)?.allows_pt && (
                  <p className="text-xxs text-zinc-400 dark:text-zinc-500 italic">
                    ℹ️ Personal Training (PT) coaching addon price is disabled because the selected activity does not allow personal coaching.
                  </p>
                )}
              </CardContent>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 flex items-center justify-end gap-3">
                <Button type="button" onClick={closeModal} variant="ghost" disabled={isPending} className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-5">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || initialActivities.length === 0 || branches.length === 0} className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl px-6 font-semibold flex items-center gap-1.5 shadow-md min-w-[120px] justify-center h-10">
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    activeModal === "create_pricing" ? "Add Pricing" : "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* DELETE CONFIRMATIONS (ACTIVITY) */}
      {activeModal === "delete_activity" && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={closeModal} className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm"></div>
          
          <Card className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl relative z-10 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between bg-red-50/20 dark:bg-red-950/10">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
                <CardTitle className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">Delete Activity</CardTitle>
              </div>
              <Button onClick={closeModal} variant="ghost" size="icon" className="w-9 h-9 rounded-xl">
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
                Are you absolutely sure you want to delete the activity <strong className="text-zinc-900 dark:text-zinc-100 font-bold">"{selectedActivity.name}"</strong>?
              </p>
              
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 rounded-xl text-sm text-amber-800 dark:text-amber-400 font-medium">
                ⚠️ <strong>Warning:</strong> Deleting this activity will permanently delete all associated localized pricing plans, class slot allocations, and active client memberships! This action cannot be undone.
              </div>
            </CardContent>

            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 flex items-center justify-end gap-3">
              <Button type="button" onClick={closeModal} variant="ghost" disabled={isPending} className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-5">
                Cancel
              </Button>
              <Button onClick={handleDeleteActivitySubmit} disabled={isPending} className="bg-red-650 dark:bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 font-semibold flex items-center gap-1.5 shadow-md min-w-[120px] justify-center h-10">
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

      {/* DELETE CONFIRMATIONS (PRICING) */}
      {activeModal === "delete_pricing" && selectedPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={closeModal} className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm"></div>
          
          <Card className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl relative z-10 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between bg-red-50/20 dark:bg-red-950/10">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
                <CardTitle className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">Delete Price Plan</CardTitle>
              </div>
              <Button onClick={closeModal} variant="ghost" size="icon" className="w-9 h-9 rounded-xl">
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
                Are you sure you want to delete the pricing plan for <strong className="text-zinc-900 dark:text-zinc-100 font-bold">"{selectedPricing.activity?.name}"</strong> at branch <strong className="text-zinc-900 dark:text-zinc-100 font-bold">"{selectedPricing.branch?.name}"</strong>?
              </p>
              
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-250/70 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-400 font-medium">
                Note: This will delete this specific localized pricing schedule. Clients won't be able to buy new memberships for this program at this branch under this package.
              </div>
            </CardContent>

            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60 flex items-center justify-end gap-3">
              <Button type="button" onClick={closeModal} variant="ghost" disabled={isPending} className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-5">
                Cancel
              </Button>
              <Button onClick={handleDeletePricingSubmit} disabled={isPending} className="bg-red-650 dark:bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 font-semibold flex items-center gap-1.5 shadow-md min-w-[120px] justify-center h-10">
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
