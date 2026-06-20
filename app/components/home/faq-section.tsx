"use client";

import * as React from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-24 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 relative overflow-hidden">

      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center justify-center p-3 bg-orange-600/10 text-orange-600 rounded-full mb-6 transition-all duration-700 transform ${isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-75"}`}>
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic mb-6 transition-colors duration-500 transition-all duration-700 delay-100 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
            Frequently Asked <span className="text-orange-600">Questions</span>
          </h2>
          <p className={`text-lg text-zinc-600 dark:text-zinc-400 font-medium transition-all duration-700 delay-200 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
            Everything you need to know about training at ApexFit.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const value = `item-${index}`;

            return (
              <AccordionItem
                key={index}
                value={value}
                style={{
                  transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms"
                }}
                className={`group border rounded-2xl overflow-hidden bg-white/50 dark:bg-black/40 border-zinc-200 dark:border-zinc-800 data-open:bg-white data-open:dark:bg-zinc-900 data-open:border-orange-500 data-open:shadow-lg data-open:shadow-orange-600/5 hover:border-orange-500/50 transform transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
              >
                <AccordionTrigger className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left focus:outline-none hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden">
                  <span className="text-lg md:text-xl font-bold uppercase tracking-wide pr-8 transition-colors duration-300 text-zinc-900 dark:text-zinc-100 group-hover/accordion-trigger:text-orange-600 group-aria-expanded/accordion-trigger:text-orange-600">
                    {faq.question}
                  </span>
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover/accordion-trigger:bg-orange-600/20 group-hover/accordion-trigger:text-orange-600 group-aria-expanded/accordion-trigger:bg-orange-600 group-aria-expanded/accordion-trigger:text-white group-aria-expanded/accordion-trigger:rotate-180">
                    <Plus className="w-5 h-5 pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
                    <Minus className="w-5 h-5 pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 md:px-8 pb-8 text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

      </div>
    </section>
  );
}

