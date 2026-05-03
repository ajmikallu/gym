# Project Structure

```text
app/
├── (public)/          <-- Shared Public Layout
│   ├── layout.tsx        (Navbar, Footer, SEO wrapper)
│   ├── page.tsx          (URL: /)
│   ├── about/
│   │   └── page.tsx      (URL: /about)
│   └── blog/
│       ├── [slug]/
│       │   └── page.tsx  (URL: /blog/my-post)
│       └── page.tsx      (URL: /blog)
├── components/           <-- UI Building Blocks
│   ├── ui/               <-- Generic components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── carousel.tsx
│   │   └── navigation-menu.tsx
│   ├── auth/             <-- Authentication forms
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── forgot-password-form.tsx
│   ├── home/             <-- Feature-specific (HeroBanner, Stats, etc.)
│   │   └── hero-banner.tsx
│   └── shared/           <-- Shared across layouts
│       └── navbar.tsx
│
├── (auth)/               <-- Focused Auth Layout (Split screen)
│   ├── layout.tsx        (Split screen with branding and forms)
│   ├── login/
│   │   └── page.tsx      (URL: /login)
│   ├── register/
│   │   └── page.tsx      (URL: /register)
│   └── forgot-password/
│       └── page.tsx      (URL: /forgot-password)
│
├── (user)/          <-- Logged-in User Experience
│   ├── layout.tsx        (Sidebar, User Nav, Notifications)
│   └── user/
│       └── [slug]/              
│           └── page.tsx      (URL: /user/slug) 
│   └── dashboard/        
│       └── page.tsx      (URL: /dashboard)
│   └── settings/
│       └── page.tsx      (URL: /settings)
│
├── (admin)/              <-- High-Privilege Internal Tools
│   ├── layout.tsx        (Admin Sidebar, Data Overviews)
│   └── admin/              
│       └── page.tsx      (URL: /admin)
│       └── users/              
│           └── page.tsx      (URL: /admin/users)
│       └── exercises/              
│           └── page.tsx      (URL: /admin/exercises)
│
├── layout.tsx            <-- Global Root Layout (Only HTML/Body & Providers)  
├── page.tsx
├── lib/                  <-- Shared utilities (Supabase client, Utils)
│   └── utils.ts          <-- Utility functions (cn, twMerge)
├── hooks/ 
├── components.json       <-- Shadcn UI configuration
```