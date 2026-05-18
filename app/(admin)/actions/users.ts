'use server'

import { createAdminClient } from '@/app/lib/supabase/admin'
import { createClient } from '@/app/lib/supabase/server'
import { jwtDecode } from 'jwt-decode'

export async function createUser(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) throw new Error("Unauthorized access request.")

    const payload = jwtDecode(session.access_token) as any
    const callerRole = payload.user_role || payload.app_metadata?.assigned_role || 'customer'

    const targetRole = formData.get('role') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

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

    return { success: true, userId: authUser.user.id }

  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." }
  }
}
