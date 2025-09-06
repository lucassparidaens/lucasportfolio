"use client";

import { useState } from "react";
import Link from "next/link";
import { LuMenu, LuX } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import clsx from "clsx";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto min-w-[480px] max-w-[95vw]">
      <nav className="flex items-center justify-between gap-12 h-16 px-6 bg-white/90 backdrop-blur-[20px] border border-gray-200/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[50px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
        {/* Logo */}
        <Link
          href="http://localhost:8000"
          className="flex items-center gap-2 text-xl font-extrabold text-slate-800 transition-colors hover:text-[#5B8DEF] tracking-tight ml-2"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img 
              src="/lucas-memoji.svg" 
              alt="Lucas Memoji" 
              className="w-full h-full object-cover"
            />
          </div>
          <span>LUCAS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="http://localhost:8000" className="text-sm font-semibold text-slate-600 hover:text-[#5B8DEF] transition-colors tracking-wide">
                HOME
              </Link>
            </li>
            <li>
              <Link href="http://localhost:8000#projects" className="text-sm font-semibold text-slate-600 hover:text-[#5B8DEF] transition-colors tracking-wide">
                PROJECTS
              </Link>
            </li>
            <li>
              <Link href="#keycap-changer" className="text-sm font-semibold text-[#5B8DEF] tracking-wide">
                SKILLS
              </Link>
            </li>
            <li>
              <Link href="http://localhost:8000/lucas-ai.html" className="text-sm font-semibold text-slate-600 hover:text-[#5B8DEF] transition-colors tracking-wide">
                LUCAS AI
              </Link>
            </li>
            <li>
              <Link href="http://localhost:8000#contact" className="text-sm font-semibold text-slate-600 hover:text-[#5B8DEF] transition-colors tracking-wide">
                CONTACT
              </Link>
            </li>
          </ul>
          
          <Link 
            href="http://localhost:8000#contact" 
            className="bg-gradient-to-r from-[#5B8DEF] to-[#9AE6B4] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-[#5B8DEF]/25 transition-all duration-200 tracking-wide"
          >
            LET&apos;S TALK
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="md:hidden flex size-12 cursor-pointer items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
            <LuMenu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className="motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
            <DialogContent className="motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:slide-out-to-right motion-safe:data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 h-full w-3/4 bg-white p-4 shadow-lg ease-in-out motion-safe:transition motion-safe:data-[state=closed]:duration-300 motion-safe:data-[state=open]:duration-500 sm:max-w-sm">
              <DialogTitle className="sr-only">Menu</DialogTitle>
              <DialogDescription className="sr-only">Navigation menu</DialogDescription>
              <DialogClose className="ml-auto flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:text-black motion-safe:transition">
                <LuX className="size-5" />
                <span className="sr-only">Close menu</span>
              </DialogClose>
              <nav className="mt-8">
                <ul className="space-y-4">
                  <NavbarLink
                    href="http://localhost:8000"
                    title="HOME"
                    description="Terug naar hoofdpagina"
                    onClick={() => setOpen(false)}
                  />
                  <NavbarLink
                    href="http://localhost:8000#projects"
                    title="PROJECTS"
                    description="Bekijk mijn werk"
                    onClick={() => setOpen(false)}
                  />
                  <NavbarLink
                    href="#keycap-changer"
                    title="SKILLS"
                    description="Interactieve skills showcase"
                    onClick={() => setOpen(false)}
                  />
                  <NavbarLink
                    href="http://localhost:8000/lucas-ai.html"
                    title="LUCAS AI"
                    description="AI chatbot ervaring"
                    onClick={() => setOpen(false)}
                  />
                  <NavbarLink
                    href="http://localhost:8000#contact"
                    title="CONTACT"
                    description="Laten we praten"
                    onClick={() => setOpen(false)}
                  />
                </ul>
              </nav>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </nav>
    </header>
  );
}

type NavbarLinkProps = {
  href: string;
  title: string;
  description: string;
  onClick: () => void;
};

function NavbarLink({ href, title, description, onClick }: NavbarLinkProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="group flex items-center rounded-xl p-4 hover:bg-[#5B8DEF]/10 motion-safe:transition"
      >
        <div className="flex grow flex-col gap-1">
          <span className="text-lg font-semibold text-slate-800 group-hover:text-[#5B8DEF] motion-safe:transition tracking-wide">
            {title}
          </span>
          <span className="text-sm text-slate-500">{description}</span>
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-[#5B8DEF] group-hover:text-white motion-safe:transition">
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
      </Link>
    </li>
  );
}
