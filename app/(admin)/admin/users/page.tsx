import { createAdminClient } from '@/app/lib/supabase/admin'
import { AddUserForm } from '@/app/components/admin/add-user-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'

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
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={4} className="h-24 text-center">
                            No users found.
                          </td>
                        </tr>
                      )}
                      {users.map((user) => (
                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle font-medium">
                            {user.user_metadata?.full_name || 'N/A'}
                          </td>
                          <td className="p-4 align-middle">
                            {user.email}
                          </td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors">
                              {user.app_metadata?.assigned_role || 'customer'}
                            </span>
                          </td>
                          <td className="p-4 align-middle text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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