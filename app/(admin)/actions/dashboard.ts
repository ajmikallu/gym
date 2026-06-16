'use server'

import { createClient } from "@/app/lib/supabase/server"
import { createAdminClient } from "@/app/lib/supabase/admin"

export async function getDashboardData() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required. Please log in.")
    }

    const role = (user.app_metadata?.assigned_role || "").toLowerCase()
    const adminClient = createAdminClient()

    if (role === 'superadmin') {
      // 1. Fetch counts
      const [
        { count: totalUsers },
        { count: totalBranches },
        { count: totalActivities },
        { count: totalTrainers }
      ] = await Promise.all([
        adminClient.from('profiles').select('*', { count: 'exact', head: true }),
        adminClient.from('branches').select('*', { count: 'exact', head: true }),
        adminClient.from('activities').select('*', { count: 'exact', head: true }),
        adminClient.from('trainers').select('*', { count: 'exact', head: true })
      ])

      // 2. Total revenue from memberships
      const { data: memberships } = await adminClient.from('memberships').select('price, purchase_date')
      const totalRevenue = memberships?.reduce((sum, m) => sum + Number(m.price), 0) || 0

      // 3. Recent audit logs with profiles
      const { data: logs } = await adminClient
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      const userIds = Array.from(new Set((logs || []).map(l => l.user_id).filter(Boolean)))
      let profilesMap: Record<string, string> = {}
      if (userIds.length > 0) {
        const { data: profiles } = await adminClient
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
        profilesMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.id]: p.full_name }), {})
      }
      const logsWithUser = (logs || []).map(l => ({
        ...l,
        user_name: l.user_id ? (profilesMap[l.user_id] || 'System/Unknown') : 'System/Unknown'
      }))

      // 4. Branch details with stats (number of memberships and trainers)
      const { data: branches } = await adminClient.from('branches').select('*, country:countries(name)')
      const { data: membershipsWithBranch } = await adminClient.from('memberships').select('branch_id')
      const { data: trainersWithBranch } = await adminClient.from('trainers').select('branch_id')

      const branchesWithStats = (branches || []).map(b => {
        const branchMembers = membershipsWithBranch?.filter(m => m.branch_id === b.id).length || 0
        const branchTrainers = trainersWithBranch?.filter(t => t.branch_id === b.id).length || 0
        return {
          ...b,
          membersCount: branchMembers,
          trainersCount: branchTrainers
        }
      })

      return {
        success: true,
        role,
        data: {
          metrics: {
            totalUsers: totalUsers || 0,
            totalBranches: totalBranches || 0,
            totalActivities: totalActivities || 0,
            totalTrainers: totalTrainers || 0,
            totalRevenue
          },
          auditLogs: logsWithUser,
          branches: branchesWithStats,
          memberships: memberships || []
        }
      }
    } 
    
    if (role === 'admin') {
      const [
        { count: totalUsers },
        { count: totalBranches },
        { count: totalTrainers }
      ] = await Promise.all([
        adminClient.from('profiles').select('*', { count: 'exact', head: true }),
        adminClient.from('branches').select('*', { count: 'exact', head: true }),
        adminClient.from('trainers').select('*', { count: 'exact', head: true })
      ])

      const { count: activeMemberships } = await adminClient
        .from('memberships')
        .select('*', { count: 'exact', head: true })
        .gte('expiry_date', new Date().toISOString().split('T')[0])

      // Recent Bookings
      const { data: recentBookings } = await adminClient
        .from('bookings')
        .select(`
          id,
          booking_time,
          status,
          user_id,
          slot:slots (
            start_time,
            activity:activities (name),
            branch:branches (name)
          )
        `)
        .order('booking_time', { ascending: false })
        .limit(10)

      const userIds = Array.from(new Set((recentBookings || []).map(b => b.user_id).filter(Boolean)))
      let profilesMap: Record<string, string> = {}
      if (userIds.length > 0) {
        const { data: profiles } = await adminClient
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds)
        profilesMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.id]: p.full_name }), {})
      }
      const bookingsWithUser = (recentBookings || []).map(b => ({
        ...b,
        user_name: profilesMap[b.user_id] || 'Unknown User'
      }))

      // Trainers list
      const { data: trainers } = await adminClient.from('trainers').select('*, branch:branches(name)')

      return {
        success: true,
        role,
        data: {
          metrics: {
            totalMembers: totalUsers || 0,
            totalBranches: totalBranches || 0,
            totalTrainers: totalTrainers || 0,
            activeMemberships: activeMemberships || 0
          },
          recentBookings: bookingsWithUser,
          trainers: trainers || []
        }
      }
    } 
    
    if (role === 'trainer') {
      // Find trainer row linked to logged-in user
      let trainerRow = null
      const { data: trainerByUid } = await adminClient.from('trainers').select('*').eq('user_id', user.id).maybeSingle()
      if (trainerByUid) {
        trainerRow = trainerByUid
      } else {
        const { data: trainerByEmail } = await adminClient.from('trainers').select('*').eq('email', user.email || '').maybeSingle()
        if (trainerByEmail) {
          trainerRow = trainerByEmail
          // Auto-link user_id
          await adminClient.from('trainers').update({ user_id: user.id }).eq('id', trainerByEmail.id)
        }
      }

      if (!trainerRow) {
        return {
          success: true,
          role,
          data: {
            trainerFound: false,
            metrics: {
              totalSlots: 0,
              totalBookings: 0
            },
            slots: [],
            bookings: []
          }
        }
      }

      // Query slots taught by trainer
      const { data: slots } = await adminClient
        .from('slots')
        .select(`
          *,
          activity:activities (name, description),
          branch:branches (name)
        `)
        .eq('trainer_id', trainerRow.id)
        .order('start_time', { ascending: true })

      const slotIds = (slots || []).map(s => s.id)
      let bookings: any[] = []
      if (slotIds.length > 0) {
        const { data: bookingsData } = await adminClient
          .from('bookings')
          .select(`
            *,
            slot:slots (id, start_time, activity:activities(name))
          `)
          .in('slot_id', slotIds)
          .order('booking_time', { ascending: false })
        bookings = bookingsData || []
      }

      const userIds = Array.from(new Set(bookings.map(b => b.user_id).filter(Boolean)))
      let profilesMap: Record<string, any> = {}
      if (userIds.length > 0) {
        const { data: profiles } = await adminClient
          .from('profiles')
          .select('id, full_name, age, height, weight')
          .in('id', userIds)
        profilesMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
      }

      const bookingsWithUser = bookings.map(b => ({
        ...b,
        user: profilesMap[b.user_id] || { full_name: 'Unknown Student' }
      }))

      // Branch name
      const { data: branch } = await adminClient.from('branches').select('name').eq('id', trainerRow.branch_id).single()

      return {
        success: true,
        role,
        data: {
          trainerFound: true,
          trainer: {
            ...trainerRow,
            branch_name: branch?.name || 'N/A'
          },
          metrics: {
            totalSlots: slots?.length || 0,
            totalBookings: bookings.length
          },
          slots: slots || [],
          bookings: bookingsWithUser
        }
      }
    }

    // Default response for other roles
    return {
      success: true,
      role,
      data: {
        message: `Welcome to the Gym Admin Portal. You have logged in as '${role}'.`
      }
    }

  } catch (error: any) {
    console.error("Dashboard server action error:", error)
    return {
      success: false,
      role: '',
      error: error.message || "Failed to load dashboard data."
    }
  }
}
