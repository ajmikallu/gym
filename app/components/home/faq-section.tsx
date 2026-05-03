"use client";

import * as React from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Do I need prior experience to join?",
    answer: "Absolutely not. Our elite coaching staff is trained to work with individuals at all fitness levels, from absolute beginners to professional athletes. We will scale and modify every movement to fit your current capabilities while pushing you to improve."
  },
  {
    question: "What is included in the membership?",
    answer: "A standard ApexFit membership grants you unlimited access to our world-class facility, the recovery zone (including cold plunges and saunas), and the turf area. Personal training and specialized nutrition planning are available as premium add-ons."
  },
  {
    question: "How do I book a personal training session?",
    answer: "You can book your initial free consultation through our website. Once you are paired with a coach, you will schedule your ongoing sessions directly through our member app based on your customized training block."
  },
  {
    question: "Are your facilities crowded during peak hours?",
    answer: "We strictly cap our total membership to ensure the facility never becomes overcrowded. You will always have access to the equipment you need, even during our busiest hours (5 PM - 7 PM)."
  },
  {
    question: "Do you offer nutrition coaching without personal training?",
    answer: "Yes. Our Nutritional Planning program is available as a standalone service. You will receive customized macro targets, weekly check-ins, and meal prep strategies from our registered specialists."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 relative overflow-hidden">
      
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-orange-600/10 text-orange-600 rounded-full mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic mb-6 transition-colors duration-500">
            Frequently Asked <span className="text-orange-600">Questions</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium">
            Everything you need to know about training at ApexFit.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index}
                className={`group border rounded-2xl transition-all duration-500 overflow-hidden ${
                  isOpen 
                    ? "bg-white dark:bg-zinc-900 border-orange-500 shadow-lg shadow-orange-600/5" 
                    : "bg-white/50 dark:bg-black/40 border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className={`text-lg md:text-xl font-bold uppercase tracking-wide pr-8 transition-colors duration-300 ${isOpen ? "text-orange-600" : "text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600"}`}>
                    {faq.question}
                  </h3>
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? "bg-orange-600 text-white rotate-180" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-orange-600/20 group-hover:text-orange-600"}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                
                <div 
                  className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 md:px-8 pb-8 text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
