"use client"

import * as React from "react"
import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Weight,
  Ruler,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Plus,
  X,
  Flame,
  Info,
  Calendar
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
import { updateProfile, resetHealthMetrics } from "./actions"

interface Profile {
  id: string
  full_name: string | null
  age: number | null
  height: number | null
  weight: number | null
  allergies: string[] | null
  updated_at: string | null
}

interface ProfileEditorProps {
  profile: Profile
}

const COMMON_ALLERGIES = [
  "Peanuts",
  "Dairy",
  "Gluten",
  "Soy",
  "Eggs",
  "Shellfish",
  "Tree Nuts",
  "Fish"
]

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // State variables for form
  const [fullName, setFullName] = useState(profile.full_name || "")
  const [age, setAge] = useState<string>(profile.age?.toString() || "")
  const [height, setHeight] = useState<string>(profile.height?.toString() || "")
  const [weight, setWeight] = useState<string>(profile.weight?.toString() || "")
  const [allergies, setAllergies] = useState<string[]>(profile.allergies || [])
  const [newAllergy, setNewAllergy] = useState("")

  // Notification states
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Clear messages automatically
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Calculate BMI metrics
  const hNum = parseFloat(height)
  const wNum = parseFloat(weight)
  const heightM = hNum ? hNum / 100 : 0
  const bmi = wNum && heightM ? parseFloat((wNum / (heightM * heightM)).toFixed(1)) : null

  // BMI Category description and coloring
  let bmiCategory = { label: "Unknown", color: "text-zinc-400 bg-zinc-100 dark:bg-zinc-800", border: "border-zinc-200 dark:border-zinc-800", pct: 0 }
  if (bmi) {
    if (bmi < 18.5) {
      bmiCategory = {
        label: "Underweight",
        color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30",
        border: "border-cyan-200 dark:border-cyan-900/50",
        pct: Math.min((bmi / 40) * 100, 100)
      }
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      bmiCategory = {
        label: "Normal Weight",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-900/50",
        pct: Math.min((bmi / 40) * 100, 100)
      }
    } else if (bmi >= 25 && bmi <= 29.9) {
      bmiCategory = {
        label: "Overweight",
        color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-900/50",
        pct: Math.min((bmi / 40) * 100, 100)
      }
    } else {
      bmiCategory = {
        label: "Obese",
        color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30",
        border: "border-rose-200 dark:border-rose-900/50",
        pct: Math.min((bmi / 40) * 100, 100)
      }
    }
  }

  // Handle Allergy Management
  const addAllergy = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (allergies.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      setNewAllergy("")
      return
    }
    setAllergies([...allergies, trimmed])
    setNewAllergy("")
  }

  const removeAllergy = (indexToRemove: number) => {
    setAllergies(allergies.filter((_, idx) => idx !== indexToRemove))
  }

  // Handle Update Profile
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!fullName.trim()) {
      setMessage({ type: "error", text: "Full name is required." })
      return
    }

    startTransition(async () => {
      const res = await updateProfile({
        fullName,
        age: age ? parseInt(age) : null,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        allergies
      })

      if (res.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" })
        router.refresh()
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update profile." })
      }
    })
  }

  // Handle Reset / Delete Metrics (CRUD Delete aspect)
  const handleResetMetrics = () => {
    if (!confirm("Are you sure you want to delete and reset your health metrics (Age, Height, Weight, Allergies)?")) {
      return
    }

    startTransition(async () => {
      const res = await resetHealthMetrics()
      if (res.success) {
        setAge("")
        setHeight("")
        setWeight("")
        setAllergies([])
        setMessage({ type: "success", text: "Health profile metrics successfully deleted/reset." })
        router.refresh()
      } else {
        setMessage({ type: "error", text: res.error || "Failed to reset metrics." })
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header Title & Subtitle */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            ApexFit Health Profile
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage your personal metrics, body composition data, and allergen safety details.
          </p>
        </div>
        
        {/* Safe Metrics Eraser Button */}
        <Button 
          type="button" 
          variant="outline" 
          disabled={isPending}
          onClick={handleResetMetrics}
          className="self-start md:self-center border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-950 dark:hover:bg-rose-950/20 text-rose-500 gap-2 transition-all font-medium duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Clear Health Profile
        </Button>
      </div>

      {/* Floating Status Notification */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm transition-all duration-300 animate-in slide-in-from-top-2 ${
          message.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400" 
            : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-400"
        }`}>
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-sm">{message.type === "success" ? "Success" : "Error occurred"}</p>
            <p className="text-xs opacity-90 mt-0.5">{message.text}</p>
          </div>
        </div>
      )}

      {/* Responsive Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Editor Form (CRUD Create/Update) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Personal Parameters</CardTitle>
                  <CardDescription className="text-xs">Update your primary account attributes and credentials.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 block" htmlFor="fullName">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input 
                    id="fullName" 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="E.g., Alexander Mercer"
                    className="pl-4 h-11 border-zinc-300 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white transition-all bg-white dark:bg-zinc-950"
                  />
                </div>
              </div>

              {/* Age, Height, Weight Row */}
              <div className="grid grid-cols-3 gap-4">
                
                {/* Age */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5" htmlFor="age">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    Age
                  </label>
                  <Input 
                    id="age" 
                    type="number" 
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Yrs"
                    className="h-11 border-zinc-300 dark:border-zinc-800 focus:ring-2 bg-white dark:bg-zinc-950"
                  />
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5" htmlFor="height">
                    <Ruler className="w-4 h-4 text-zinc-400" />
                    Height
                  </label>
                  <div className="relative">
                    <Input 
                      id="height" 
                      type="number" 
                      step="0.1"
                      min="50"
                      max="300"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="cm"
                      className="h-11 border-zinc-300 dark:border-zinc-800 focus:ring-2 bg-white dark:bg-zinc-950 pr-8"
                    />
                    <span className="absolute right-3 top-3 text-xs text-zinc-400 font-medium pointer-events-none">cm</span>
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5" htmlFor="weight">
                    <Weight className="w-4 h-4 text-zinc-400" />
                    Weight
                  </label>
                  <div className="relative">
                    <Input 
                      id="weight" 
                      type="number" 
                      step="0.1"
                      min="10"
                      max="500"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="kg"
                      className="h-11 border-zinc-300 dark:border-zinc-800 focus:ring-2 bg-white dark:bg-zinc-950 pr-8"
                    />
                    <span className="absolute right-3 top-3 text-xs text-zinc-400 font-medium pointer-events-none">kg</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Allergies Tag System */}
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Dietary Allergies & Food Sensitivities
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Let trainers design personalized nutrition plans around your allergen profile.</p>
                </div>

                {/* Add Custom Allergy Input */}
                <div className="flex gap-2">
                  <Input 
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addAllergy(newAllergy)
                      }
                    }}
                    placeholder="Enter an allergen (e.g., Peanuts)"
                    className="h-10 border-zinc-300 dark:border-zinc-800 focus:ring-2 bg-white dark:bg-zinc-950 flex-1"
                  />
                  <Button 
                    type="button"
                    onClick={() => addAllergy(newAllergy)}
                    className="h-10 px-4 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Suggested Allergies for Fast Seeding */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Quick Add Suggestions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_ALLERGIES.map((allergy) => {
                      const isAdded = allergies.some(a => a.toLowerCase() === allergy.toLowerCase())
                      return (
                        <button
                          key={allergy}
                          type="button"
                          disabled={isAdded}
                          onClick={() => addAllergy(allergy)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-150 font-medium ${
                            isAdded
                              ? "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200/50 dark:border-zinc-800/30 text-zinc-400 cursor-not-allowed"
                              : "bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {allergy}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Active Allergies List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Current Allergen List</span>
                  {allergies.length === 0 ? (
                    <div className="p-3 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-600 text-xs">
                      No dietary allergies identified. Profile is clear.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-900 rounded-xl">
                      {allergies.map((allergy, index) => (
                        <span 
                          key={`${allergy}-${index}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-400 animate-in zoom-in-95 duration-150"
                        >
                          {allergy}
                          <button 
                            type="button" 
                            onClick={() => removeAllergy(index)}
                            className="p-0.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-500 hover:text-amber-800 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </CardContent>
            <CardFooter className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 px-6 py-4 flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {profile.updated_at ? `Last saved: ${new Date(profile.updated_at).toLocaleString()}` : "Not updated yet"}
              </span>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 font-semibold px-6 shadow-md transition-all duration-200"
              >
                {isPending ? "Saving changes..." : "Save Profile"}
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/* Column 2: Advanced BMI Calculator & Diagnostics (CRUD Read Visualizations) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: BMI Insights */}
          <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Body Mass Index (BMI)</CardTitle>
                  <CardDescription className="text-xs">Dynamic health metrics evaluated based on your parameters.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Metric Indicator Circle */}
              <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-100 dark:border-zinc-900 relative">
                
                {bmi ? (
                  <>
                    <span className="text-5xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-50 animate-in zoom-in duration-300">
                      {bmi}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border mt-3 transition-all duration-300 ${bmiCategory.color} ${bmiCategory.border}`}>
                      {bmiCategory.label}
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-4">
                    <Info className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mb-2" />
                    <span className="text-sm font-semibold text-zinc-400">Complete metrics to display BMI</span>
                    <span className="text-xs text-zinc-500 mt-1">Please insert valid Height and Weight values.</span>
                  </div>
                )}
              </div>

              {/* BMI Custom Horizontal Gauge */}
              {bmi && (
                <div className="space-y-2.5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                    <span>UNDERWEIGHT (15.0)</span>
                    <span>OBESE (40.0)</span>
                  </div>
                  
                  {/* Visual Slider Bar */}
                  <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full relative overflow-hidden">
                    {/* The pointer pin */}
                    <div 
                      className="absolute top-0 bottom-0 w-2.5 bg-zinc-950 dark:bg-white rounded-full ring-2 ring-white dark:ring-zinc-950 transition-all duration-500 ease-out"
                      style={{ left: `${Math.max(10, Math.min(bmiCategory.pct, 90))}%` }}
                    />
                    
                    {/* Gradient colored sections behind */}
                    <div className="h-full w-full flex opacity-30">
                      <div className="h-full flex-1 bg-cyan-400" />
                      <div className="h-full flex-1 bg-emerald-400" />
                      <div className="h-full flex-1 bg-amber-400" />
                      <div className="h-full flex-1 bg-rose-400" />
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center italic pt-1">
                    Normal weight parameters are situated inside the <strong className="text-emerald-600 dark:text-emerald-400">18.5 – 24.9</strong> category.
                  </p>
                </div>
              )}

              {/* Ideal Weight range panel */}
              {hNum ? (
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Calculated Health Targets</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Ideal Weight Range:</span>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {(18.5 * heightM * heightM).toFixed(1)}kg – {(24.9 * heightM * heightM).toFixed(1)}kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Daily Basal Metabolic Rate estimate:</span>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {wNum ? `${(10 * wNum + 6.25 * hNum - 5 * (parseInt(age) || 30) + 5).toFixed(0)} kcal` : "N/A"}
                    </span>
                  </div>
                </div>
              ) : null}

            </CardContent>
          </Card>

          {/* Card: Gym Membership Quick Overview (CRUD Read Context) */}
          <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 dark:from-zinc-900 dark:to-black text-white overflow-hidden relative">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
              <Flame className="w-56 h-56 text-zinc-50" />
            </div>
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-white/10 text-white shrink-0">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-bold">ApexFit Tier</CardTitle>
                  <CardDescription className="text-zinc-400 text-xs">Your active performance metrics and athletic tier.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">Athletic Status</span>
                <p className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                  Elite Athlete Tier
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Completed Sessions</span>
                  <span className="text-lg font-extrabold text-white">24 Workouts</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Trainer Guidance</span>
                  <span className="text-lg font-extrabold text-white">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  )
}
