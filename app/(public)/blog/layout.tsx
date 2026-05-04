import React from "react";
import Image from "next/image";
import Link from "next/link";

const LATEST_BLOGS = [
  { id: 1, title: "Explosive Power: Box Jumps", image: "/images/home/boxjump.png", slug: "benefits-of-box-jumps", date: "Apr 20" },
  { id: 2, title: "Workout Nutrition Planning", image: "/images/home/nutrition_planning.png", slug: "workout-nutrition-planning", date: "Apr 15" },
  { id: 3, title: "Building Iron Discipline", image: "/images/hero/hero-banner-2.png", slug: "building-iron-discipline", date: "Mar 25" },
];

const AUTHOR = {
  name: "Marcus Forge",
  role: "Head Coach & Founder",
  bio: "Former professional fighter turned elite strength and conditioning coach. Marcus has spent over a decade forging champions.",
  image: "/images/home/boxing-hero.png",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            {children}
          </div>

          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-10">
            
            {/* Latest Blogs Widget */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold uppercase italic border-b border-zinc-800 pb-4 mb-6 text-white">
                Latest Articles
              </h3>
              <div className="space-y-6">
                {LATEST_BLOGS.map((blog) => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="flex items-center group">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-800 group-hover:border-orange-500 transition-colors">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="text-xs text-orange-500 font-bold mb-1 uppercase tracking-wider">{blog.date}</p>
                      <h4 className="text-sm font-bold leading-tight text-gray-200 group-hover:text-white transition-colors">
                        {blog.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Profile Widget */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-xl text-center">
              <h3 className="text-xl font-bold uppercase italic border-b border-zinc-800 pb-4 mb-6 text-left text-white">
                About the Author
              </h3>
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-5 border-4 border-zinc-800 shadow-inner">
                <Image
                  src={AUTHOR.image}
                  alt={AUTHOR.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-1">{AUTHOR.name}</h4>
              <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-4">{AUTHOR.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {AUTHOR.bio}
              </p>
              <Link 
                href="/about"
                className="inline-block w-full py-3 bg-zinc-900 hover:bg-orange-600 hover:text-white border border-zinc-800 hover:border-orange-500 transition-all duration-300 rounded-lg text-sm font-bold uppercase tracking-wider text-gray-300"
              >
                View Full Profile
              </Link>
            </div>

            {/* His Blogs / Author's Posts */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold uppercase italic border-b border-zinc-800 pb-4 mb-6 text-white">
                More from {AUTHOR.name.split(" ")[0]}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/blog/mastering-the-deadlift" className="block text-sm font-medium text-gray-400 hover:text-orange-500 transition-colors line-clamp-2 border-l-2 border-transparent hover:border-orange-500 pl-3">
                    Mastering the Deadlift: Form over Ego
                  </Link>
                </li>
                <li>
                  <Link href="/blog/why-you-need-elite-coaching" className="block text-sm font-medium text-gray-400 hover:text-orange-500 transition-colors line-clamp-2 border-l-2 border-transparent hover:border-orange-500 pl-3">
                    Why You Need Elite Coaching
                  </Link>
                </li>
                <li>
                  <Link href="/blog/functional-movement-patterns" className="block text-sm font-medium text-gray-400 hover:text-orange-500 transition-colors line-clamp-2 border-l-2 border-transparent hover:border-orange-500 pl-3">
                    Functional Movement Patterns for Everyday Life
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
