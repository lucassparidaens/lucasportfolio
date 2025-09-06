"use client";

import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";

/**
 * Props for `PurchaseButton`.
 */
export type PurchaseButtonProps =
  SliceComponentProps<Content.PurchaseButtonSlice>;

/**
 * Component for "PurchaseButton" Slices.
 */
const PurchaseButton: FC<PurchaseButtonProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-gradient-to-br from-slate-50 to-slate-100"
      innerClassName="flex flex-col gap-8 items-center text-center"
    >
      <FadeIn>
        <h2
          id="portfolio-cta"
          className="font-bold-slanted text-6xl uppercase md:text-8xl text-slate-800"
        >
          Klaar voor
          <br />
          Samenwerking?
        </h2>
      </FadeIn>

      <FadeIn>
        <div className="max-w-2xl text-xl text-slate-600 leading-relaxed">
          <p>
            Nu je mijn skills hebt verkend, laten we praten over hoe ik jouw volgende project 
            tot een succes kan maken. Van concept tot deployment - ik begeleid je door het hele proces.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/#contact"
            className="group relative flex h-16 transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#5B8DEF] to-[#9AE6B4] px-8 py-4 font-semibold text-white will-change-transform hover:shadow-lg hover:shadow-[#5B8DEF]/25 focus:ring-2 focus:ring-[#5B8DEF] focus:ring-offset-2 focus:outline-none motion-safe:transition-all motion-safe:duration-300 md:text-lg before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:ease-out hover:before:translate-x-[100%] motion-safe:before:transition-transform motion-safe:before:duration-700"
          >
            <span className="font-bold-slanted relative z-10 flex items-center gap-3 text-xl uppercase tracking-wide">
              Start Project
              <svg className="size-5 group-hover:translate-x-1 motion-safe:transition-transform motion-safe:duration-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 text-lg font-semibold text-slate-600 border-2 border-slate-300 rounded-full hover:border-[#5B8DEF] hover:text-[#5B8DEF] transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Bekijk Portfolio
          </Link>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 max-w-lg">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Gratis consultatie
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Binnen 24u reactie
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            100% tevredenheid
          </span>
        </div>
      </FadeIn>
    </Bounded>
  );
};

export default PurchaseButton;