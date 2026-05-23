"use client"

import * as React from "react"
import { useState, useTransition } from "react"
import {
  Activity as ActivityIcon,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Zap,
  Sparkles,
  RefreshCw,
  X,
  Clock,
  Briefcase
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { createMembership, updateMembership, deleteMembership } from "./actions"

interface Catalog {
  branches: Array<{ id: number; name: string; address: string }>
  activities: Array<{ id: number; name: string; description: string; allows_pt: boolean }>
  pricings: Array<{ id: number; activity_id: number; branch_id: number; duration_days: number; base_price: number; pt_addon_price: number }>
  trainers: Array<{ id: number; name: string; branch_id: number; specialization: string }>
  trainerActivities?: Array<{ trainer_id: number; activity_id: number }>
}

interface Membership {
  id: number
  user_id: string
  activity_id: number
  branch_id: number
  start_date: string
  expiry_date: string
  duration_days: number
  has_pt: boolean
  trainer_id: number | null
  purchase_date: string
  price: number
  activity?: { id: number; name: string; description: string; allows_pt: boolean } | null
  branch?: { id: number; name: string; address: string } | null
  trainer?: { id: number; name: string; specialization: string } | null
}

interface MembershipTabProps {
  initialMemberships: Membership[]
  catalog: Catalog
}

export function MembershipTab({ initialMemberships, catalog }: MembershipTabProps) {
  const [isPending, startTransition] = useTransition()
  const [memberships, setMemberships] = useState<Membership[]>(initialMemberships)

  // Create Membership state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [selectedActivity, setSelectedActivity] = useState<string>("")
  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  )
  const [selectedDuration, setSelectedDuration] = useState<string>("30")
  const [hasPt, setHasPt] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState<string>("")

  // Advanced Edit state for inline updates
  const [editingMembershipId, setEditingMembershipId] = useState<number | null>(null)
  const [editStartDate, setEditStartDate] = useState<string>("")
  const [editDuration, setEditDuration] = useState<string>("30")
  const [editHasPt, setEditHasPt] = useState(false)
  const [editTrainer, setEditTrainer] = useState<string>("")

  // Notification states
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Find matching pricing details
  const getPricing = (bId: number, aId: number, days: number) => {
    return catalog.pricings.find(
      p => p.branch_id === bId && p.activity_id === aId && p.duration_days === days
    )
  }

  // Calculate current purchase price dynamically
  const currentPricing = getPricing(
    parseInt(selectedBranch),
    parseInt(selectedActivity),
    parseInt(selectedDuration)
  )

  const calculatedBasePrice = currentPricing ? parseFloat(currentPricing.base_price.toString()) : 0
  const calculatedPtPrice = currentPricing ? parseFloat(currentPricing.pt_addon_price.toString()) : 0
  const calculatedTotalPrice = calculatedBasePrice + (hasPt ? calculatedPtPrice : 0)

  // Calculate edit price dynamically
  const getEditPricingForMembership = (m: Membership, daysStr: string) => {
    return getPricing(m.branch_id, m.activity_id, parseInt(daysStr))
  }

  // Handle purchase submission
  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!selectedBranch || !selectedActivity || !selectedStartDate) {
      setMessage({ type: "error", text: "Please supply all required program options." })
      return
    }

    const activityObj = catalog.activities.find(a => a.id === parseInt(selectedActivity))
    if (hasPt && activityObj?.allows_pt && !selectedTrainer) {
      setMessage({ type: "error", text: "Please select an available personal trainer." })
      return
    }

    startTransition(async () => {
      const res = await createMembership({
        activityId: parseInt(selectedActivity),
        branchId: parseInt(selectedBranch),
        startDate: selectedStartDate,
        durationDays: parseInt(selectedDuration),
        hasPt,
        trainerId: hasPt ? parseInt(selectedTrainer) : null,
        price: calculatedTotalPrice
      })

      if (res.success) {
        setMessage({ type: "success", text: "Successfully subscribed! Welcome to ApexFit." })

        // Fetch new lists
        const newM: Membership = {
          id: res.membership.id,
          user_id: res.membership.user_id,
          activity_id: res.membership.activity_id,
          branch_id: res.membership.branch_id,
          start_date: res.membership.start_date,
          expiry_date: res.membership.expiry_date,
          duration_days: res.membership.duration_days,
          has_pt: res.membership.has_pt,
          trainer_id: res.membership.trainer_id,
          purchase_date: res.membership.purchase_date,
          price: res.membership.price,
          activity: catalog.activities.find(a => a.id === res.membership.activity_id),
          branch: catalog.branches.find(b => b.id === res.membership.branch_id),
          trainer: catalog.trainers.find(t => t.id === res.membership.trainer_id)
        }
        setMemberships([newM, ...memberships])

        // Reset state
        setShowCreateForm(false)
        setSelectedBranch("")
        setSelectedActivity("")
        setSelectedStartDate(new Date().toISOString().split("T")[0])
        setSelectedDuration("30")
        setHasPt(false)
        setSelectedTrainer("")
      } else {
        setMessage({ type: "error", text: res.error || "Failed to complete purchase." })
      }
    })
  }

  // Handle cancel/delete membership
  const handleCancel = (id: number) => {
    if (!confirm("Are you sure you want to cancel and delete this membership? This cannot be undone.")) {
      return
    }
    setMessage(null)

    startTransition(async () => {
      const res = await deleteMembership(id)
      if (res.success) {
        setMemberships(memberships.filter(m => m.id !== id))
        setMessage({ type: "success", text: "Membership successfully cancelled and removed." })
      } else {
        setMessage({ type: "error", text: res.error || "Failed to cancel membership." })
      }
    })
  }

  // Handle comprehensive update submission
  const handleUpdate = (m: Membership) => {
    setMessage(null)

    if (!editStartDate) {
      setMessage({ type: "error", text: "Please enter a valid plan activation start date." })
      return
    }

    const editPricing = getEditPricingForMembership(m, editDuration)
    const base = editPricing ? parseFloat(editPricing.base_price.toString()) : parseFloat(m.price.toString())
    const ptVal = editPricing ? parseFloat(editPricing.pt_addon_price.toString()) : 0
    const newPrice = base + (editHasPt ? ptVal : 0)

    if (editHasPt && !editTrainer) {
      setMessage({ type: "error", text: "Please select an available personal coach." })
      return
    }

    startTransition(async () => {
      const res = await updateMembership({
        id: m.id,
        startDate: editStartDate,
        durationDays: parseInt(editDuration),
        hasPt: editHasPt,
        trainerId: editHasPt ? parseInt(editTrainer) : null,
        price: newPrice
      })

      if (res.success) {
        // Calculate new expiry date for optimistic update UI
        const sDate = new Date(editStartDate)
        const expiryDate = new Date(sDate)
        expiryDate.setDate(expiryDate.getDate() + parseInt(editDuration))

        setMemberships(memberships.map(item => {
          if (item.id === m.id) {
            return {
              ...item,
              start_date: editStartDate,
              expiry_date: expiryDate.toISOString().split("T")[0],
              duration_days: parseInt(editDuration),
              has_pt: editHasPt,
              trainer_id: editHasPt ? parseInt(editTrainer) : null,
              price: newPrice,
              trainer: editHasPt ? catalog.trainers.find(t => t.id === parseInt(editTrainer)) : null
            }
          }
          return item
        }))
        setEditingMembershipId(null)
        setMessage({ type: "success", text: "Subscription details updated successfully!" })
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update membership." })
      }
    })
  }

  // Helper to determine status badges
  const getStatusBadge = (m: Membership) => {
    const todayStr = new Date().toISOString().split("T")[0]
    if (todayStr < m.start_date) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50">
          Pending
        </span>
      )
    } else if (todayStr > m.expiry_date) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700">
          Expired
        </span>
      )
    } else {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50">
          Active
        </span>
      )
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Alert Header Notification */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm transition-all duration-300 animate-in slide-in-from-top-2 ${message.type === "success"
          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400"
          : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-400"
          }`}>
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold text-sm">{message.type === "success" ? "Success" : "Error Notification"}</p>
            <p className="text-xs opacity-90 mt-0.5">{message.text}</p>
          </div>
          <button onClick={() => setMessage(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            My Gym Memberships
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
            Manage your branches, active activation timelines, duration programs, and custom coaching addons.
          </p>
        </div>

        {!showCreateForm && (
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-orange-600 text-white hover:bg-orange-700 font-semibold gap-2 shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            New Program Subscription
          </Button>
        )}
      </div>

      {/* CREATE FORM: Purchasing / Subscribing new Plan */}
      {showCreateForm && (
        <Card className="border-orange-200/50 dark:border-orange-950 bg-orange-50/10 dark:bg-orange-950/5 animate-in slide-in-from-top-3 duration-300">
          <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Zap className="w-5 h-5" />
                Select New Training Plan
              </CardTitle>
              <CardDescription className="text-xs">Configure your gym tier, branch location, start dates, and personal coaches.</CardDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreateForm(false)}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <form onSubmit={handlePurchase}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">

              {/* Select Branch and Activity */}
              <div className="space-y-4">

                {/* Branch Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">Select Gym Branch</label>
                  <select
                    required
                    value={selectedBranch}
                    onChange={(e) => {
                      setSelectedBranch(e.target.value)
                      setSelectedTrainer("")
                    }}
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">-- Choose Club Location --</option>
                    {catalog.branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Activity Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">Choose Sport/Program</label>
                  <select
                    required
                    value={selectedActivity}
                    onChange={(e) => {
                      setSelectedActivity(e.target.value)
                      setHasPt(false)
                      setSelectedTrainer("")
                    }}
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">-- Select Sport Activity --</option>
                    {catalog.activities.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  {selectedActivity && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                      {catalog.activities.find(a => a.id === parseInt(selectedActivity))?.description}
                    </p>
                  )}
                </div>

                {/* Dynamic Activation Start Date Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    Desired Plan Activation Date
                  </label>
                  <Input
                    type="date"
                    required
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                    className="h-11 rounded-xl border-zinc-300 dark:border-zinc-800 focus:ring-orange-500"
                  />
                </div>

                {/* Duration select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    Plan Duration Terms
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { days: "30", label: "30 Days" },
                      { days: "90", label: "90 Days" },
                      { days: "365", label: "365 Days" }
                    ].map(item => (
                      <button
                        key={item.days}
                        type="button"
                        onClick={() => setSelectedDuration(item.days)}
                        className={`py-2 px-3 text-xs font-bold border rounded-xl transition-all duration-200 ${selectedDuration === item.days
                          ? "bg-orange-600 border-orange-600 text-white shadow-sm"
                          : "bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* PT Addon Details & Dynamic Billing Calculation */}
              <div className="space-y-6 p-5 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-900 rounded-2xl flex flex-col justify-between">

                {/* PT Addon Selection */}
                <div className="space-y-4">
                  {selectedActivity && catalog.activities.find(a => a.id === parseInt(selectedActivity))?.allows_pt ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          id="ptCheckbox"
                          checked={hasPt}
                          onChange={(e) => setHasPt(e.target.checked)}
                          className="h-4.5 w-4.5 rounded border-zinc-300 dark:border-zinc-800 text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                        <label htmlFor="ptCheckbox" className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 cursor-pointer">
                          Add Personal Coach (+ ${calculatedPtPrice})
                        </label>
                      </div>

                      {hasPt && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                          <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">Available branch trainers</label>
                          <select
                            required
                            value={selectedTrainer}
                            onChange={(e) => setSelectedTrainer(e.target.value)}
                            className="flex h-10 w-full items-center justify-between rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">-- Choose Coach --</option>
                            {catalog.trainers
                              .filter(t =>
                                t.branch_id === parseInt(selectedBranch) &&
                                (catalog.trainerActivities || []).some(
                                  ta => ta.trainer_id === t.id && ta.activity_id === parseInt(selectedActivity)
                                )
                              )
                              .map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ) : selectedActivity ? (
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800/30 rounded-xl text-center text-xs text-zinc-400">
                      Personal Coach Addon is not available for this program.
                    </div>
                  ) : (
                    <div className="text-center text-xs text-zinc-400 py-4">
                      Select branch & activity to configure trainer settings.
                    </div>
                  )}
                </div>

                {/* Price Breakdown display */}
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Base Program Fee:</span>
                    <span>${calculatedBasePrice.toFixed(2)}</span>
                  </div>
                  {hasPt && (
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>Personal Coach Addon:</span>
                      <span>+ ${calculatedPtPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm font-bold border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-2.5">
                    <span>Total Plan Fee:</span>
                    <span className="text-orange-600 dark:text-orange-400 text-lg">${calculatedTotalPrice.toFixed(2)}</span>
                  </div>
                </div>

              </div>

            </CardContent>
            <CardFooter className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 px-6 py-4 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Instantly activated upon confirmation.</span>
              <Button
                type="submit"
                disabled={isPending || !selectedBranch || !selectedActivity}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 shadow-md transition-all duration-200"
              >
                {isPending ? "Validating Purchase..." : "Confirm & Subscribe"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* READ SECTION: List Current User Memberships */}
      <div className="space-y-4">
        {memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white/70 dark:bg-zinc-900/70 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center backdrop-blur-md">
            <ActivityIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No active memberships found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Select one of ApexFit's state of the art programs to purchase your first membership.
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2 px-4 shadow-sm"
            >
              Get Started Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberships.map((m) => {
              const isExpired = new Date(m.expiry_date) < new Date()
              const isEditing = editingMembershipId === m.id

              // Find active editing pricing details
              const editingPricing = getEditPricingForMembership(m, editDuration)
              const editBase = editingPricing ? parseFloat(editingPricing.base_price.toString()) : parseFloat(m.price.toString())
              const editPtVal = editingPricing ? parseFloat(editingPricing.pt_addon_price.toString()) : 0
              const editTotal = editBase + (editHasPt ? editPtVal : 0)

              return (
                <Card
                  key={m.id}
                  className={`shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden relative ${isExpired ? "opacity-60 grayscale-[40%]" : "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md"
                    }`}
                >

                  {/* Status Tag Overlay */}
                  <div className="absolute right-4 top-4">
                    {getStatusBadge(m)}
                  </div>

                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 pr-20">
                      <Zap className="w-4 h-4 text-orange-600" />
                      {m.activity?.name || "Premium Program"}
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {m.branch?.name || "ApexFit Club"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-4 text-xs text-zinc-600 dark:text-zinc-400">

                    {/* Program Duration & Purchase Date Metadata */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                      <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300">
                        <Clock className="w-3 h-3 text-orange-500" />
                        {m.duration_days} Days Plan
                      </span>
                      <span>
                        Purchased: {m.purchase_date}
                      </span>
                    </div>

                    {/* Date Metrics or Edit Term Inputs */}
                    {isEditing ? (
                      <div className="space-y-3 p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-900 rounded-xl animate-in slide-in-from-top-2 duration-150">

                        {/* Edit Start Date */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 block uppercase">Plan Activation Date</label>
                          <Input
                            type="date"
                            required
                            value={editStartDate}
                            onChange={(e) => setEditStartDate(e.target.value)}
                            className="h-9 rounded-lg text-xs"
                          />
                        </div>

                        {/* Edit Duration days */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 block uppercase">Subscription term</label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {["30", "90", "365"].map(days => (
                              <button
                                key={days}
                                type="button"
                                onClick={() => setEditDuration(days)}
                                className={`py-1.5 px-2 text-[10px] font-bold border rounded-lg transition-all duration-150 ${editDuration === days
                                  ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-sm"
                                  : "bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"
                                  }`}
                              >
                                {days} Days
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-100 dark:border-zinc-900">
                        <div>
                          <span className="text-[10px] font-bold text-zinc-400 block">START DATE</span>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{m.start_date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-zinc-400 block">EXPIRY DATE</span>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{m.expiry_date}</span>
                        </div>
                      </div>
                    )}

                    {/* PT Addon Details or Editing */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">Personal Coaching Support</span>

                      {isEditing ? (
                        <div className="space-y-3 p-3 bg-orange-50/20 dark:bg-orange-950/5 border border-orange-200/40 dark:border-orange-900/30 rounded-xl animate-in slide-in-from-top-2 duration-150">

                          {/* Edit Checkbox */}
                          {m.activity?.allows_pt ? (
                            <>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`editPtCheck-${m.id}`}
                                  checked={editHasPt}
                                  onChange={(e) => setEditHasPt(e.target.checked)}
                                  className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-800 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                />
                                <label htmlFor={`editPtCheck-${m.id}`} className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                  Add Coach (+ ${editPtVal})
                                </label>
                              </div>

                              {editHasPt && (
                                <div className="space-y-1.5 animate-in slide-in-from-top-1">
                                  <label className="text-[10px] font-bold text-zinc-400 block">Select Coach</label>
                                  <select
                                    required
                                    value={editTrainer}
                                    onChange={(e) => setEditTrainer(e.target.value)}
                                    className="flex h-9 w-full items-center justify-between rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 py-1.5 text-xs"
                                  >
                                    <option value="">-- Choose Coach --</option>
                                    {catalog.trainers
                                      .filter(t =>
                                        t.branch_id === m.branch_id &&
                                        (catalog.trainerActivities || []).some(
                                          ta => ta.trainer_id === t.id && ta.activity_id === m.activity_id
                                        )
                                      )
                                      .map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                                      ))}
                                  </select>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] text-zinc-400 italic block text-center py-2">
                              Coaching Addon not available for this activity.
                            </span>
                          )}

                          {/* Dynamic Billing Adjusted Total */}
                          <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-2 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-zinc-500">Recalculated Price:</span>
                            <span className="font-bold text-orange-600 dark:text-orange-400 text-sm">${editTotal.toFixed(2)}</span>
                          </div>

                          {/* Action controls */}
                          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingMembershipId(null)}
                              className="h-8 text-zinc-500 text-xs px-2.5"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              disabled={isPending}
                              onClick={() => handleUpdate(m)}
                              className="h-8 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs px-3 font-semibold"
                            >
                              Save Changes
                            </Button>
                          </div>

                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-100 dark:border-zinc-900">
                          {m.has_pt && m.trainer ? (
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
                              <div>
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">{m.trainer.name}</span>
                                <span className="text-[10px] text-zinc-400 block">Coach Addon ({m.trainer.specialization})</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-zinc-500">No personal trainer assigned.</span>
                          )}

                          {/* UPDATE Action Button */}
                          {!isExpired && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingMembershipId(m.id)
                                setEditStartDate(m.start_date)
                                setEditDuration(m.duration_days.toString())
                                setEditHasPt(m.has_pt)
                                setEditTrainer(m.trainer_id?.toString() || "")
                              }}
                              className="h-7 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2"
                            >
                              Edit Plan Settings
                            </Button>
                          )}
                        </div>
                      )}

                    </div>

                  </CardContent>

                  <CardFooter className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 px-4 py-3 flex items-center justify-between font-medium">
                    <div className="flex items-center gap-1 font-bold text-zinc-900 dark:text-zinc-50">
                      <DollarSign className="w-4 h-4 text-zinc-400" />
                      <span className="text-base">{parseFloat(m.price.toString()).toFixed(2)}</span>
                    </div>

                    {/* DELETE Action Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleCancel(m.id)}
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 h-8 gap-1.5 text-xs px-2.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isExpired ? "Delete Record" : "Cancel Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
