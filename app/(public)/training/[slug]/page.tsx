import * as React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, Check } from "lucide-react";

// Mock database for training programs
const trainingPrograms: Record<string, any> = {
  "functional-movement": {
    title: "Functional Movement",
    subtitle: "Move better, live stronger.",
    description: "Build a foundation of strength with movements that enhance your daily life and athletic performance. Our functional movement program focuses on mastering the basics before adding intensity.",
    benefits: ["Improved joint mobility and stability", "Injury prevention through proper mechanics", "Enhanced core strength and balance", "Better posture and daily movement efficiency"],
    takeaways: [
      "Master the fundamental human movement patterns.",
      "Increase your active range of motion safely.",
      "Build functional strength that translates to real-world activities.",
      "Correct muscular imbalances and asymmetries."
    ],
    image: "/images/home/functional_movement.png",
  },
  "elite-coaching": {
    title: "Elite Coaching",
    subtitle: "Uncompromising standards for uncompromising results.",
    description: "Train with industry-leading professionals who provide personalized guidance and unrelenting accountability. Our elite coaching program is designed for those who demand the absolute best from themselves.",
    benefits: ["1-on-1 personalized attention", "Customized, science-backed programming", "Real-time form correction", "Comprehensive progress tracking"],
    takeaways: [
      "Work exclusively with certified, elite-level trainers.",
      "Get a training block tailored specifically to your unique goals.",
      "Receive real-time feedback, adjustments, and motivation.",
      "Break through persistent plateaus and achieve new PRs."
    ],
    image: "/images/home/elite_coaching.png",
  },
  "nutrition-planning": {
    title: "Nutritional Planning",
    subtitle: "Fuel the machine. Optimize the results.",
    description: "Fuel your body with customized macronutrient strategies designed to optimize recovery and results. You can't out-train a bad diet, which is why our nutritional planning is as rigorous as our training.",
    benefits: ["Customized macronutrient targets", "Practical meal prep strategies", "Evidence-based supplement advice", "Weekly accountability check-ins"],
    takeaways: [
      "Understand exactly how to fuel your specific training style.",
      "Learn sustainable eating habits without miserable crash dieting.",
      "Optimize your post-workout recovery and daily energy levels.",
      "Achieve and maintain your body composition goals faster."
    ],
    image: "/images/home/nutrition_planning.png",
  }
};

export default async function TrainingProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = trainingPrograms[slug];

  if (!program) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-end pb-16 md:pb-24">
        <Image
          src={program.image}
          alt={program.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-900/50 to-zinc-900/30 dark:from-zinc-950 dark:via-black/60 dark:to-black/30 transition-colors duration-500" />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic mb-4 transition-colors duration-500">
              {program.title}
            </h1>
            <p className="text-lg md:text-xl text-zinc-800 dark:text-zinc-300 font-medium max-w-2xl transition-colors duration-500">
              {program.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Two-Column Grid */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative items-start">

            {/* Left Column: Title, Benefits, Form */}
            <div className="lg:col-span-7 flex flex-col gap-12">

              <div>
                <h2 className="text-3xl font-bold uppercase tracking-tight mb-6">About The Program</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors duration-500">
                  {program.description}
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold uppercase tracking-tight mb-6">Core Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.benefits.map((benefit: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300 hover:border-orange-500/50">
                      <CheckCircle2 className="w-6 h-6 text-orange-600 shrink-0" />
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 transition-colors duration-500">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation Form */}
              <div className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl mt-8 transition-colors duration-300">
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Book Your Consultation</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 transition-colors duration-500">Take the first step towards your goals. Fill out the form below and an elite coach will contact you.</p>

                <form className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="firstName" className="text-sm font-semibold uppercase tracking-wider text-zinc-500">First Name</label>
                      <input type="text" id="firstName" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 text-zinc-900 dark:text-zinc-100" placeholder="John" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="lastName" className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Last Name</label>
                      <input type="text" id="lastName" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 text-zinc-900 dark:text-zinc-100" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Email Address</label>
                    <input type="email" id="email" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 text-zinc-900 dark:text-zinc-100" placeholder="john@example.com" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="goals" className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Primary Goals</label>
                    <textarea id="goals" rows={4} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 resize-none text-zinc-900 dark:text-zinc-100" placeholder="Tell us what you want to achieve..."></textarea>
                  </div>

                  <button type="button" className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-widest py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/30">
                    Request Consultation
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Sticky Description / Key Takeaways */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-32 flex flex-col gap-8">

                <div className="bg-black text-white rounded-2xl overflow-hidden shadow-2xl">
                  <div className="bg-zinc-900 p-6 border-b border-zinc-800 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                    <h3 className="font-bold uppercase tracking-wider">Key Takeaways</h3>
                  </div>
                  <div className="p-8">
                    <ul className="flex flex-col gap-6">
                      {program.takeaways.map((takeaway: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-orange-500" />
                          </div>
                          <p className="text-zinc-300 leading-relaxed text-sm">
                            {takeaway}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-600 text-white p-8 rounded-2xl shadow-xl flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                  <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/20 transition-colors duration-500"></div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Ready to Start?</h3>
                  <p className="text-white/90 leading-relaxed">Our spots are extremely limited. Secure your consultation today before our roster fills up.</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
