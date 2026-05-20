"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createUser } from "@/app/(admin)/actions/users"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"

const initialState = {
  success: false,
  error: "",
  userId: ""
}

export function AddUserForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createUser, initialState)

  // Trigger a client-side data refresh when creation succeeds
  useEffect(() => {
    if (state?.success) {
      router.refresh()
    }
  }, [state?.success, router])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>Create a new user and assign them a role.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md">
              User created successfully! ID: {state.userId}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="fullName">Full Name</label>
            <Input id="fullName" name="fullName" required placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              required
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="customer">Customer</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create User"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}