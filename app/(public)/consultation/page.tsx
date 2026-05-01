import * as React from "react";
import { ArrowRight, CheckCircle2, Clock, Calendar, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Free Consultation | ApexFit",
  description: "Schedule your free fitness consultation with ApexFit.",
};

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pb-24">
      
      {/* Header Banner */}
      <div className="w-full bg-zinc-900 py-16 md:py-24 border-b border-zinc-800">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white uppercase italic mb-4">
              Schedule Your <span className="text-orange-600">Free Consultation</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 font-medium">
              Take the first step towards unlocking your elite potential. No commitments, just a raw assessment of where you are and where you want to be.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Side: What to expect */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-6">What to Expect</h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
                Your consultation is a dedicated 45-minute session with one of our elite coaches. We'll dive deep into your fitness history, current lifestyle, and ultimate goals to map out a clear path forward.
              </p>
              
              <ul className="flex flex-col gap-6">
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-orange-600/10 text-orange-600 shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase mb-1">Goal Assessment</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">We'll discuss exactly what you want to achieve, whether it's dropping body fat, building muscle, or improving performance.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-orange-600/10 text-orange-600 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase mb-1">Movement Screen</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">A quick, non-strenuous assessment to identify any muscular imbalances or mobility restrictions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-orange-600/10 text-orange-600 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase mb-1">Action Plan</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Walk away with a high-level roadmap of the training frequency and nutrition habits required to hit your targets.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-zinc-900 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-orange-600/20">
                <Clock className="w-48 h-48" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter relative z-10 mb-2">Time is Ticking</h3>
              <p className="text-zinc-300 relative z-10">Stop waiting for Monday. The best time to start was yesterday. The next best time is right now.</p>
            </div>
          </div>

          {/* Right Side: The Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl transition-colors duration-300">
              <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">Secure Your Spot</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-10">Fill out your details below. Our team will contact you within 24 hours to confirm your time slot.</p>
              
              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-sm font-bold uppercase tracking-wider text-zinc-500">First Name</label>
                    <input type="text" id="firstName" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 text-zinc-900 dark:text-zinc-100" placeholder="John" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-sm font-bold uppercase tracking-wider text-zinc-500">Last Name</label>
                    <input type="text" id="lastName" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 text-zinc-900 dark:text-zinc-100" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                    <input type="email" id="email" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 text-zinc-900 dark:text-zinc-100" placeholder="john@example.com" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-zinc-500">Phone Number</label>
                    <input type="tel" id="phone" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 text-zinc-900 dark:text-zinc-100" placeholder="(555) 123-4567" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="program" className="text-sm font-bold uppercase tracking-wider text-zinc-500">Program of Interest</label>
                  <select id="program" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 text-zinc-900 dark:text-zinc-100 appearance-none cursor-pointer">
                    <option value="personal-training">Personal Training</option>
                    <option value="functional-movement">Functional Movement</option>
                    <option value="elite-coaching">Elite Coaching</option>
                    <option value="nutrition">Nutritional Planning</option>
                    <option value="undecided">Not sure yet</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="goals" className="text-sm font-bold uppercase tracking-wider text-zinc-500">Primary Goals & Background</label>
                  <textarea id="goals" rows={5} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors duration-300 resize-none text-zinc-900 dark:text-zinc-100" placeholder="Tell us briefly about your fitness journey and what you want to achieve..."></textarea>
                </div>
                
                <button type="button" className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-widest py-5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-xl hover:shadow-orange-600/30 w-full text-lg group">
                  Submit Request
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
