import { createAdminClient } from '@/app/lib/supabase/admin'
import { AddUserForm } from '@/app/components/admin/add-user-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { UserTableClient } from './user-table-client'

export const metadata = {
  title: 'User Management',
}

export default async function UsersPage() {
  const adminSupabase = createAdminClient()
  
  // Fetch users using the admin API
  const { data: usersData, error } = await adminSupabase.auth.admin.listUsers()
  
  const users = usersData?.users || []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                A list of all users in the system including their roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-destructive">Failed to load users: {error.message}</div>
              ) : (
                <UserTableClient initialUsers={users} />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <AddUserForm />
        </div>
      </div>
    </div>
  )
}