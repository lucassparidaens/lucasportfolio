import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-[60px]" id="hero">
      <div className="max-w-[1200px] mx-auto px-8 w-full text-center">
        <div className="relative my-28 py-10 overflow-hidden">
          {/* Floating elements */}
          <div className="pointer-events-none absolute inset-0 z-[1]">
            <div className="absolute top-5 left-5 flex items-center gap-2 bg-white px-3 py-2 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[color:var(--glass-border)] animate-[floatRotate_3s_ease-in-out_infinite]">
              <img src="https://flagcdn.com/w40/nl.png" alt="Nederlandse vlag" className="w-5 h-[15px] rounded" />
              <span className="text-sm font-medium text-[color:var(--foreground)] whitespace-nowrap">Door een Nederlander, voor iedereen</span>
            </div>

            <div className="absolute top-[60px] right-20 w-[60px] h-[60px] rounded-full overflow-hidden border-[3px] border-white shadow-[0_8px_24px_rgba(91,141,239,0.2)] animate-[floatRotate_4s_ease-in-out_infinite]">
              <Image src="/lucas-memoji.svg" alt="Lucas Avatar" fill className="object-cover" />
            </div>

            <div className="absolute bottom-[100px] left-[60px] w-[60px] h-[60px] rounded-full overflow-hidden border-[3px] border-white shadow-[0_8px_24px_rgba(91,141,239,0.2)] animate-[floatRotate_4s_ease-in-out_infinite_reverse]" style={{animationDelay:"0.5s"}}>
              <Image src="/lucas-memoji.svg" alt="Lucas Avatar" fill className="object-cover" />
            </div>

            <div className="absolute text-[24px] opacity-60 top-[30%] right-[30%] animate-[pulseGlow_2s_ease-in-out_infinite]">⚡</div>
            <div className="absolute text-[24px] opacity-60 bottom-[40%] left-[25%] animate-[pulseGlow_2s_ease-in-out_infinite]" style={{animationDelay:"1.5s"}}>✨</div>
          </div>

          {/* Main content */}
          <div className="relative z-[2] text-center max-w-[800px] mx-auto px-6">
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] mb-6 tracking-tight text-[color:var(--foreground)]">
              Hi! Ik ben Lucas. {" "}
              <span className="bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent relative">
                Welkom in mijn portfolio!
              </span>
            </h1>
            <div className="mb-10">
              <p className="text-lg text-[color:var(--muted)] leading-[1.6] mb-2">
                De #1 fullstack developer voor gebruiksvriendelijke websites & apps.
              </p>
              <p className="text-lg text-[color:var(--muted)] leading-[1.6] hidden md:block">
                Van concept tot deployment - ik help je elke stap van de weg.
              </p>
            </div>

            <div className="flex gap-6 justify-center items-center mb-10 flex-wrap">
              <a href="#chat" className="inline-flex items-center gap-2 rounded-[24px] px-8 py-5 font-semibold text-lg text-white shadow-[0_8px_24px_rgba(91,141,239,0.3)] border-0 cursor-pointer transition-all bg-[linear-gradient(135deg,var(--primary),var(--accent))] hover:shadow-[0_12px_32px_rgba(91,141,239,0.4)] hover:-translate-y-0.5">
                <span className="whitespace-nowrap">Start een gesprek</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
              </a>
              <Link href="#projects" className="group relative inline-flex items-center gap-2 rounded-[24px] px-8 py-5 font-semibold text-lg border-2 border-[color:var(--glass-border)] bg-white text-[color:var(--foreground)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(91,141,239,0.3)] overflow-hidden">
                <span className="absolute inset-0 bg-[linear-gradient(135deg,var(--primary),var(--accent))] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2 group-hover:text-white">
                  Bekijk mijn werk
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 768px) {
          .md\\:block { display: none; }
        }
      `}</style>
    </section>
  );
}
