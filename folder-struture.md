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
│
├── (auth)/               <-- Focused Auth Layout (No distractions)
│   ├── layout.tsx        (Centered card, Logo only)
│   ├── login/
│   │   └── page.tsx      (URL: /login)
│   └── register/
│       └── page.tsx      (URL: /register)
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
└── layout.tsx            <-- Global Root Layout (Only HTML/Body & Providers)   