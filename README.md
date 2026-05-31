This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## How to Add a New Role in the Future (e.g. `manager`)

If you ever need to add a new role to this Gym Management System, you will need to update both the Supabase PostgreSQL database schema (for access permissions and rules) and the Next.js frontend application (for routing, UI inputs, and layout access checks).

Follow this step-by-step checklist to implement the new role correctly:

### Step 1: PostgreSQL Database Configuration

Run the following queries inside your Supabase SQL Editor:

1. **Add the new role value to the `public.app_role` enum:**
   ```sql
   ALTER TYPE public.app_role ADD VALUE 'manager';
   ```

2. **Configure Role Permissions:**
   Map the capabilities the role has by inserting rows into the `public.role_permissions` table:
   ```sql
   INSERT INTO public.role_permissions (role, permission) VALUES
     ('manager', 'branches.read'),
     ('manager', 'memberships.read'),
     ('manager', 'slots.read'),
     ('manager', 'bookings.read');
   ```
   *(Check `public.app_permission` in `schema.sql` for the complete list of system permissions).*

3. **Define Creation Hierarchies:**
   Configure which existing roles are permitted to register or create accounts of this role inside the `public.role_hierarchy` table:
   ```sql
   INSERT INTO public.role_hierarchy (creator_role, creatable_role) VALUES
     ('superadmin', 'manager'),
     ('admin', 'manager');
   ```

---

### Step 2: Next.js Routing & Middleware Layouts

1. **Authentication Route Redirects:**
   Open `app/(auth)/actions.ts` and locate the `allowedRoles` array in both the `login` and `register` server actions. Add the new role (in **UPPERCASE**) to ensure they are directed to the Admin console (`/admin`) upon authentication:
   ```typescript
   const allowedRoles = ['ADMIN', 'SUPERADMIN', 'TRAINER', 'BLOGGER', 'MANAGER']
   ```

2. **Admin Route Gatekeeping Layout:**
   Open `app/(admin)/layout.tsx` and find the `allowedRoles` array. Add the role (in **UPPERCASE**) to authorize access to all `/admin/*` server-side pages and components:
   ```typescript
   const allowedRoles = ["ADMIN", "SUPERADMIN", "TRAINER", "BLOGGER", "MANAGER"];
   ```

---

### Step 3: Admin Forms & Dynamic User Tables

1. **New User Form Dropdown:**
   Open `app/components/admin/add-user-form.tsx`. Add a new select `<option>` for the role inside the form layout:
   ```tsx
   <option value="manager">Manager</option>
   ```

2. **User Filter Dropdown Options:**
   Open `app/(admin)/admin/users/user-table-client.tsx`. Add the option to the role filter select dropdown:
   ```tsx
   <option value="manager">Manager</option>
   ```

3. **Role Icon Mapping:**
   Open `app/(admin)/admin/users/user-table-client.tsx`, import a fitting icon from `lucide-react` (e.g. `Briefcase`), and map it to your new role inside `ROLE_ICONS`:
   ```typescript
   import { Briefcase } from "lucide-react"

   const ROLE_ICONS: Record<string, any> = {
     superadmin: ShieldAlert,
     admin: Award,
     trainer: UserCheck,
     customer: Users,
     manager: Briefcase,
   }
   ```
