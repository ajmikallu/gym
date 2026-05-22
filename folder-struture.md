# Project Structure

```text
app/
├── (public)/              <-- Shared Public Layout
│   ├── layout.tsx         (Navbar, Footer, SEO wrapper)
│   ├── page.tsx           (URL: /)
│   ├── about/
│   │   ├── page.tsx       (URL: /about)
│   │   ├── facility/      (URL: /about/facility)
│   │   └── trainers/      (URL: /about/trainers)
│   ├── blog/
│   │   ├── layout.tsx     (Blog layout with sidebar)
│   │   ├── page.tsx       (URL: /blog)
│   │   └── [slug]/
│   │       └── page.tsx   (URL: /blog/my-post)
│   ├── boxing/
│   │   └── page.tsx       (URL: /boxing)
│   ├── careers/
│   │   └── page.tsx       (URL: /careers)
│   ├── consultation/
│   │   └── page.tsx       (URL: /consultation)
│   └── training/
│       └── [slug]/
│           └── page.tsx   (URL: /training/my-program)
│
├── components/            <-- UI Building Blocks
│   ├── auth/              <-- Authentication forms
│   │   ├── forgot-password-form.tsx
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── home/              <-- Feature-specific sections
│   │   ├── boxing-section.tsx
│   │   ├── faq-section.tsx
│   │   ├── features-programs.tsx
│   │   ├── hero-banner.tsx
│   │   ├── mission-vision.tsx
│   │   └── personal-training.tsx
│   ├── shared/            <-- Shared across layouts
│   │   ├── footer.tsx
│   │   ├── navbar.tsx
│   │   └── theme-toggle.tsx
│   ├── theme-provider.tsx <-- Next Themes provider
│   └── ui/                <-- Generic components (shadcn/ui)
│       ├── button.tsx
│       ├── carousel.tsx
│       └── navigation-menu.tsx
│
├── (auth)/                <-- Focused Auth Layout (Split screen)
│   ├── layout.tsx         (Split screen with branding and forms)
│   ├── actions.ts         (Server actions for authentication)
│   ├── login/
│   │   └── page.tsx       (URL: /login)
│   ├── register/
│   │   └── page.tsx       (URL: /register)
│   └── forgot-password/
│       └── page.tsx       (URL: /forgot-password)
│
├── (user)/                <-- Logged-in User Experience
│   ├── layout.tsx         (Sidebar, User Nav, Notifications)
│   ├── dashboard/        
│   │   ├── page.tsx       (URL: /dashboard)
│   │   ├── actions.ts     (Server actions for membership CRUD operations)
│   │   ├── dashboard-client.tsx (Interactive tabs selector dashboard)
│   │   └── membership-tab.tsx (Premium client CRUD membership tab)
│   ├── settings/
│   │   └── page.tsx       (URL: /settings)
│   └── user/
│       └── [slug]/              
│           ├── page.tsx       (URL: /user/slug) 
│           ├── actions.ts     (Server actions for profile update/reset)
│           └── profile-editor.tsx (Premium client CRUD profile manager)
│
├── (admin)/               <-- High-Privilege Internal Tools
│   ├── layout.tsx         (Admin Sidebar, Data Overviews)
│   ├── actions/
│   │   └── users.ts       (Server actions for user management)
│   └── admin/              
│       ├── page.tsx       (URL: /admin)
│       ├── exercises/              
│       │   └── page.tsx   (URL: /admin/exercises)
│       └── users/              
│           └── page.tsx   (URL: /admin/users)
│
├── globals.css            <-- Global Styles
├── layout.tsx             <-- Global Root Layout (Only HTML/Body & Providers)  
├── hooks/                 <-- Custom React Hooks
├── lib/                   <-- Shared utilities
│   └── utils.ts           <-- Utility functions (cn, twMerge)
└── components.json        <-- Shadcn UI configuration
```