# Guide: Managing Roles and Permissions (RBAC)

This document explains how to add new roles or permissions to your Supabase RBAC system. The system relies on PostgreSQL ENUMs and custom tables, meaning any changes to the available roles or permissions require structural database updates.

## 1. Adding a New Role

If you want to add a new role (e.g., `manager`), you need to update the `app_role` ENUM.

**SQL Command:**
```sql
ALTER TYPE public.app_role ADD VALUE 'manager';
```
*Note: Adding an enum value is irreversible unless you drop and recreate the type or manipulate the underlying system catalog.*

## 2. Adding a New Permission

If you build a new feature (e.g., `reports`) and need to restrict access, you must add a new permission to the `app_permission` ENUM.

**SQL Command:**
```sql
ALTER TYPE public.app_permission ADD VALUE 'reports.read';
ALTER TYPE public.app_permission ADD VALUE 'reports.create';
```

## 3. Mapping Permissions to Roles

Once your new role or new permission exists, you must map them in the `role_permissions` table. This tells the system *what* each role is allowed to do.

**SQL Command:**
```sql
-- Give the 'manager' role permission to read and create reports
INSERT INTO public.role_permissions (role, permission) VALUES
  ('manager', 'reports.read'),
  ('manager', 'reports.create'),
  ('manager', 'branches.read'); -- Managers can also read branches

-- Give the existing 'superadmin' role the new report permissions
INSERT INTO public.role_permissions (role, permission) VALUES
  ('superadmin', 'reports.read'),
  ('superadmin', 'reports.create');
```

## 4. Assigning a Role to a User

When you want to grant a user a specific role, you insert or update a record in the `user_roles` table. 

**SQL Command:**
```sql
-- Replace the UUID with the actual user's Auth ID
INSERT INTO public.user_roles (user_id, role) 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'manager')
ON CONFLICT (user_id, role) DO NOTHING;
```
*Because of our Auth Hook (`custom_access_token_hook`), the next time this user logs in or refreshes their session, their JWT will automatically contain `"user_role": "manager"`.*

## 5. Using the Permission in Row Level Security (RLS)

Now that everything is set up, you can use the `authorize()` function in your RLS policies to restrict database operations. 

**SQL Command:**
```sql
-- Assume you created a 'reports' table
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow users with 'reports.read' permission to SELECT
CREATE POLICY "Authorized users can read reports" 
ON public.reports 
FOR SELECT TO authenticated 
USING ( public.authorize('reports.read') );

-- Allow users with 'reports.create' permission to INSERT
CREATE POLICY "Authorized users can create reports" 
ON public.reports 
FOR INSERT TO authenticated 
WITH CHECK ( public.authorize('reports.create') );
```

## Summary Checklist for New Features
When adding a new restricted feature, always ask yourself:
1. Do I need a new role? -> `ALTER TYPE public.app_role ADD VALUE...`
2. Do I need new permissions? -> `ALTER TYPE public.app_permission ADD VALUE...`
3. Have I mapped the permissions? -> `INSERT INTO role_permissions...`
4. Is my RLS policy checking it? -> `USING ( authorize('my_new.permission') )`

## 6. Advanced Topics & Best Practices

When designing roles and policies, keep these critical patterns in mind:

### Performance in `authorize()`
Always use `EXISTS` instead of `COUNT(*)` when checking permissions in your `authorize()` function. `EXISTS` short-circuits and stops searching as soon as it finds a match, which is significantly faster for database queries running inside RLS.

### Handling Null Claims
Ensure your auth hook safely defaults missing roles (e.g., to `"customer"`) and your `authorize` function gracefully handles the string `'null'` using `NULLIF(..., 'null')` to avoid casting errors when no role is found.

### Scoped RLS Policies (Contextual Permissions)
A user might have a generic permission like `bookings.read`, but that doesn't always mean they should read *all* bookings across the system. For example, a `trainer` should only see bookings for their assigned slots. 

Combine the `authorize()` check with a contextual `JOIN` or `EXISTS` clause:
```sql
CREATE POLICY "Trainers can read bookings for their slots" 
ON public.bookings FOR SELECT TO authenticated 
USING ( 
  authorize('bookings.read') AND EXISTS (
    SELECT 1 FROM slots 
    JOIN trainers ON trainers.id = slots.trainer_id
    WHERE slots.id = bookings.slot_id AND trainers.user_id = auth.uid()
  )
);
```

### Audit Logging
For sensitive actions (like deleting a membership or updating prices), always consider adding an `audit_logs` table. You can use PostgreSQL triggers to automatically write a record to the `audit_logs` table whenever a restricted table is inserted, updated, or deleted.

### Concurrency and Race Conditions
When dealing with limited resources (like `max_capacity` on a gym slot), do not rely solely on the frontend or standard RLS to prevent overbooking. Use a PostgreSQL trigger or a database constraint to explicitly enforce limits at the database level. 

Additionally, for temporal constraints like preventing overlapping active subscriptions, use an exclusion constraint with the `btree_gist` extension:
```sql
CONSTRAINT prevent_overlapping_memberships EXCLUDE USING gist (
  user_id WITH =,
  activity_id WITH =,
  daterange(start_date, expiry_date, '[]') WITH &&
)
```
This guarantees data integrity even during high-traffic concurrent booking attempts.
