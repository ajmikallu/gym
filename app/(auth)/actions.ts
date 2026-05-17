'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { log } from 'console'
import { jwtDecode } from 'jwt-decode'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)
  console.log(authData)
  if (error) {
    return { error: error.message }
  }

  let redirectTo = '/dashboard'

  if (authData.session) {
    try {
      const payload = jwtDecode(authData.session.access_token) as any
      console.log('payload', payload);

      // Custom claims can be placed at the root or inside app_metadata depending on Supabase version
      const role = payload.user_role || payload.app_metadata?.user_role
      console.log('Extracted role:', role)

      const allowedRoles = ['ADMIN', 'SUPERADMIN', 'TRAINER', 'BLOGGER']
      if (role && typeof role === 'string' && allowedRoles.includes(role.toUpperCase())) {
        redirectTo = '/admin'
      }
    } catch (e) {
      console.error('Error parsing token:', e)
    }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string,
      },
    },
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')

  if (authData.session) {
    let isAdmin = false
    try {
      const payload = jwtDecode(authData.session.access_token) as any
      const role = payload.user_role || payload.app_metadata?.user_role

      const allowedRoles = ['ADMIN', 'SUPERADMIN', 'TRAINER', 'BLOGGER']
      if (role && typeof role === 'string' && allowedRoles.includes(role.toUpperCase())) {
        isAdmin = true
      }
    } catch (e) {
      console.error('Error parsing token in register:', e)
    }

    if (isAdmin) {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  }

  // We redirect to login to ask the user to verify their email (or they just log in if verify isn't required)
  redirect('/login?message=Check your email to continue sign in process')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  // Note: you need to define a site url in your .env for the redirect to work smoothly, 
  // or pass a redirectTo parameter if needed.
  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
