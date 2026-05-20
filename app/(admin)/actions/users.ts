'use server'

import { createAdminClient } from '@/app/lib/supabase/admin'
import { createClient } from '@/app/lib/supabase/server'


// Allowed roles for server-side validation
const ALLOWED_ROLES = ['admin', 'trainer', 'customer'];

export async function createUser(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) throw new Error("Unauthorized access request.")

    const callerRole = session.user?.app_metadata?.assigned_role || session.user?.role || 'customer'

    const targetRole = (formData.get('role') as string || '').trim()
    const email = (formData.get('email') as string || '').trim()
    const password = formData.get('password') as string || ''
    const fullName = (formData.get('fullName') as string || '').trim()

    // Server-side validation and sanitization
    if (!ALLOWED_ROLES.includes(targetRole)) {
      throw new Error("Invalid role specified.")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      throw new Error("A valid email address is required.")
    }

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long.")
    }

    if (!fullName) {
      throw new Error("Full name is required.")
    }

    // 1. Data-Driven Hierarchy Guard Check
    const { data: isAllowed, error: rpcError } = await supabase.rpc('can_create_role', {
      caller: callerRole,
      target: targetRole
    })

    if (rpcError || !isAllowed) {
      throw new Error(`Unauthorized: Role '${callerRole}' cannot create a '${targetRole}'.`)
    }

    // 2. Atomic System-Protected Creation
    const adminSupabase = createAdminClient()
    const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }, // Publicly readable metadata
      app_metadata: { assigned_role: targetRole }  // Core system configuration metadata
    })

    if (authError) throw new Error(authError.message)
 
    return { success: true, userId: authUser.user.id, error: "" }
 
  } catch (error: any) {
    return { success: false, userId: "", error: error.message || "An unexpected error occurred." }
  }
}