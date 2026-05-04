import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react";

const FEATURED_POST = {
  title: "The Science of Hypertrophy: Building Muscle Effectively",
  excerpt: "Discover the latest research on muscle growth, optimal volume, and recovery strategies to maximize your gains in the gym. Stop guessing and start progressing with science-backed protocols.",
  category: "Training",
  date: "May 1, 2026",
  readTime: "8 min read",
  image: "/images/hero/hero-banner-1.png",
  slug: "science-of-hypertrophy",
};

const BLOG_POSTS = [
  {
    id: 1,
    title: "Mastering the Deadlift: Form over Ego",
    excerpt: "A comprehensive guide to perfecting your deadlift technique, preventing injury, and pulling more weight safely.",
    category: "Technique",
    date: "April 28, 2026",
    readTime: "5 min read",
    image: "/images/home/deadlift.png",
    slug: "mastering-the-deadlift",
  },
  {
    id: 2,
    title: "Explosive Power: The Benefits of Box Jumps",
    excerpt: "Why plyometrics should be a staple in your routine, regardless of your athletic background.",
    category: "Performance",
    date: "April 20, 2026",
    readTime: "4 min read",
    image: "/images/home/boxjump.png",
    slug: "benefits-of-box-jumps",
  },
  {
    id: 3,
    title: "Pre and Post Workout Nutrition Planning",
    excerpt: "Fueling your workouts correctly can make or break your results. Here is what you need to know about macros and timing.",
    category: "Nutrition",
    date: "April 15, 2026",
    readTime: "7 min read",
    image: "/images/home/nutrition_planning.png",
    slug: "workout-nutrition-planning",
  },
  {
    id: 4,
    title: "Why You Need Elite Coaching",
    excerpt: "The difference between working out and training with purpose. How an expert coach accelerates your progress.",
    category: "Mindset",
    date: "April 10, 2026",
    readTime: "6 min read",
    image: "/images/home/elite_coaching.png",
    slug: "why-you-need-elite-coaching",
  },
  {
    id: 5,
    title: "Functional Movement Patterns for Everyday Life",
    excerpt: "Training for longevity. Master the core functional movements that translate directly to a better, pain-free life outside the gym.",
    category: "Recovery",
    date: "April 2, 2026",
    readTime: "5 min read",
    image: "/images/home/functional_movement.png",
    slug: "functional-movement-patterns",
  },
  {
    id: 6,
    title: "The Mental Game: Building Iron Discipline",
    excerpt: "Motivation is fleeting, discipline is permanent. Strategies to stay consistent when you don't feel like training.",
    category: "Mindset",
    date: "March 25, 2026",
    readTime: "6 min read",
    image: "/images/hero/hero-banner-2.png",
    slug: "building-iron-discipline",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 mt-10">
            The <span className="text-orange-600">Forge</span> Journal
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl font-medium">
            Insights, training guides, nutritional strategies, and the science of peak performance. Stay sharp, stay informed.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-20 group relative rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/20 border border-zinc-800 bg-zinc-900 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-video lg:aspect-auto h-full w-full overflow-hidden">
              <Image
                src={FEATURED_POST.image}
                alt={FEATURED_POST.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                priority
              />
              <div className="absolute top-4 left-4 z-10 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm">
                Featured
              </div>
            </div>
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center text-gray-400 text-sm font-medium mb-4 space-x-4">
                <span className="text-orange-500 font-bold uppercase tracking-wide">{FEATURED_POST.category}</span>
                <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-2"/> {FEATURED_POST.date}</span>
                <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-2"/> {FEATURED_POST.readTime}</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 hover:text-orange-500 transition-colors">
                <Link href={`/blog/${FEATURED_POST.slug}`}>{FEATURED_POST.title}</Link>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                {FEATURED_POST.excerpt}
              </p>
              <div>
                <Link 
                  href={`/blog/${FEATURED_POST.slug}`}
                  className="inline-flex items-center text-orange-500 font-bold uppercase tracking-wider hover:text-orange-400 transition-colors group/link"
                >
                  Read Full Article <ArrowRightIcon className="ml-2 w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts Grid */}
        <h3 className="text-3xl md:text-4xl font-bold uppercase italic tracking-tighter mb-10 border-b border-zinc-800 pb-4">
          Latest Articles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors duration-300">
              <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 left-4 z-10 bg-zinc-800/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm border border-zinc-700">
                  {post.category}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-gray-500 text-xs font-medium mb-3 space-x-4">
                  <span className="flex items-center"><CalendarIcon className="w-3 h-3 mr-1"/> {post.date}</span>
                  <span className="flex items-center"><ClockIcon className="w-3 h-3 mr-1"/> {post.readTime}</span>
                </div>
                <h4 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h4>
                <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm text-white font-bold uppercase tracking-wider hover:text-orange-500 transition-colors"
                  >
                    Read More <ArrowRightIcon className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}