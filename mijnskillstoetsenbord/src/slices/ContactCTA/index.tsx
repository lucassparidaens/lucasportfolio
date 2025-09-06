"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";

/**
 * Props for `ContactCTA`.
 */
export type ContactCTAProps = SliceComponentProps<Content.ContactCtaSlice>;

/**
 * Component for "ContactCTA" Slices.
 */
const ContactCTA: FC<ContactCTAProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="portfolio-section"
    >
      <FadeIn>
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-bold-slanted text-6xl uppercase md:text-8xl text-slate-800 mb-6">
            Laten we
            <br />
            Samenwerken
          </h2>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Geïnteresseerd in mijn skills en werkwijze? Ik ben altijd open voor interessante projecten 
            en samenwerkingen. Laten we praten over hoe ik jouw ideeën tot leven kan brengen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="mailto:lucas@example.com"
              className="portfolio-btn-primary inline-flex items-center gap-2 text-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9Z"/>
              </svg>
              Start een gesprek
            </Link>
            
            <Link 
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold text-slate-600 border-2 border-slate-300 rounded-full hover:border-[#5B8DEF] hover:text-[#5B8DEF] transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              Ga naar portfolio
            </Link>
          </div>

          {/* Skills Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-white/50 border border-slate-200">
              <div className="text-3xl font-bold text-[#5B8DEF] mb-1">6+</div>
              <div className="text-sm font-medium text-slate-600">Expert Skills</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 border border-slate-200">
              <div className="text-3xl font-bold text-[#9AE6B4] mb-1">50+</div>
              <div className="text-sm font-medium text-slate-600">Projecten</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 border border-slate-200">
              <div className="text-3xl font-bold text-[#5B8DEF] mb-1">5+</div>
              <div className="text-sm font-medium text-slate-600">Jaar Ervaring</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 border border-slate-200">
              <div className="text-3xl font-bold text-[#9AE6B4] mb-1">100%</div>
              <div className="text-sm font-medium text-slate-600">Tevredenheid</div>
            </div>
          </div>
        </div>
      </FadeIn>
    </Bounded>
  );
};

export default ContactCTA;
