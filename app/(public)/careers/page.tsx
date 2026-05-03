import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Briefcase } from "lucide-react";

export const metadata = {
  title: "Careers | ApexFit",
  description: "Join the ApexFit team and help us forge elite fitness.",
};

const jobOpenings = [
  {
    title: "Senior Personal Trainer",
    department: "Coaching",
    location: "Metropolis, NY",
    type: "Full-Time",
  },
  {
    title: "Nutrition Specialist",
    department: "Wellness",
    location: "Metropolis, NY",
    type: "Part-Time",
  },
  {
    title: "Front Desk Associate",
    department: "Operations",
    location: "Metropolis, NY",
    type: "Full-Time",
  },
  {
    title: "Group Fitness Instructor",
    department: "Coaching",
    location: "Metropolis, NY",
    type: "Contract",
  },
];

export default function CareersPage() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-black pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/careers/hero.png"
          alt="ApexFit Team"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">
            Join The <span className="text-orange-500">ApexFit</span> Team
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-medium">
            We are always looking for passionate, driven individuals to help us redefine elite fitness and transform lives.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase italic tracking-tight text-black dark:text-white mb-12">
            Why Work With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-4 text-orange-600">Elite Standards</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                We demand the best from our team, and in return, we provide an environment that fosters continuous growth and excellence.
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-4 text-orange-600">Impactful Work</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Every role at ApexFit directly contributes to transforming our members' lives through health and fitness.
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-4 text-orange-600">World-Class Facility</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Work in a state-of-the-art facility surrounded by industry-leading equipment and a supportive community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-24 px-6 md:px-12 max-w-[1000px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase italic tracking-tight text-black dark:text-white mb-4">
              Open Positions
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Find your next opportunity at ApexFit.
            </p>
          </div>
          <Link href="mailto:careers@apexfit.com" className="shrink-0 bg-orange-600 text-white px-6 py-3 rounded-md font-bold hover:bg-orange-700 transition-colors inline-flex items-center">
            Send General Application <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {jobOpenings.map((job, idx) => (
            <div key={idx} className="group p-6 md:p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-orange-500 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md hover:shadow-orange-600/5">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" /> {job.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {job.type}
                    </span>
                  </div>
                </div>
              </div>
              <Link href={`mailto:careers@apexfit.com?subject=Application for ${job.title}`} className="shrink-0 text-orange-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
