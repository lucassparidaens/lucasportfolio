"use client";

import { FC, useCallback, useState } from "react";
import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import clsx from "clsx";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export const KEYCAP_TEXTURES = [
  {
    id: "frontend",
    name: "Frontend Development",
    path: "/goodwell_uv.png",
    knobColor: "#5B8DEF",
    skill: "HTML5, CSS3, JavaScript, React, Three.js",
    description: "Modern frontend ontwikkeling met HTML5, CSS3, JavaScript, React en 3D visualisaties met Three.js. Expert in responsive design en interactieve gebruikerservaringen.",
    tools: ["HTML5", "CSS3", "JavaScript", "React", "Three.js", "Visual Studio Code"],
    projects: ["Interactieve 3D Portfolio", "E-commerce Platforms", "Progressive Web Apps"]
  },
  {
    id: "ecommerce",
    name: "E-commerce Platforms",
    path: "/dreamboard_uv.png",
    knobColor: "#E44E21",
    skill: "Shopify, Magento, Marketplace Integration",
    description: "Expertise in e-commerce platforms en marketplace integraties. Van Shopify stores tot enterprise Magento oplossingen en multi-channel verkoop.",
    tools: ["Shopify", "Magento", "Bol.com", "Amazon", "MediaMarkt Saturn", "Kaufland", "Cdiscount"],
    projects: ["Multi-channel E-commerce", "Dropshipping Automation", "Marketplace Integration"]
  },
  {
    id: "design",
    name: "Design & UX/UI",
    path: "/cherrynavy_uv.png",
    knobColor: "#9AE6B4",
    skill: "Figma, Adobe Creative Suite, UX Design",
    description: "Volledige design pipeline van concept tot implementatie. Expert in Figma, Adobe Creative Suite en gebruikersgericht ontwerp voor optimale conversies.",
    tools: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Adobe After Effects", "Canva"],
    projects: ["Brand Identity Design", "Website Redesigns", "Mobile App Interfaces"]
  },
  { 
    id: "mobile", 
    name: "Mobile Development", 
    path: "/kick_uv.png", 
    knobColor: "#FD0A0A",
    skill: "Swift, Flutter, Cross-platform Apps",
    description: "Native en cross-platform mobile development. Van iOS apps met Swift tot Flutter voor Android en iOS, inclusief progressive web apps.",
    tools: ["Swift", "Flutter", "React Native", "Progressive Web Apps"],
    projects: ["iOS Native Apps", "Cross-platform Solutions", "Mobile E-commerce Apps"]
  },
  {
    id: "marketing",
    name: "Marketing & Growth",
    path: "/oldschool_uv.png",
    knobColor: "#B89D82",
    skill: "Digital Marketing, Ads, Email Automation",
    description: "Digitale marketing strategieën en growth hacking. Expert in Meta Ads, Google Ads, TikTok marketing en email automation voor maximale ROI.",
    tools: ["Meta Ads", "Google Ads", "TikTok Ads", "Pinterest", "Klaviyo", "Mailchimp", "Mailgun", "SEO/Analytics"],
    projects: ["Multi-platform Ad Campaigns", "Email Marketing Funnels", "UGC Content Strategy"]
  },
  {
    id: "ai",
    name: "AI & Automation",
    path: "/candykeys_uv.png",
    knobColor: "#F38785",
    skill: "AI Integration, Chatbots, Process Automation",
    description: "AI-gedreven oplossingen en intelligente automatisering. Van ChatGPT integraties tot custom AI workflows en chatbot development voor betere klantervaringen.",
    tools: ["ChatGPT", "Google Gemini", "Claude", "Mistral", "Grok", "Stitch", "Cursor"],
    projects: ["AI Chatbot Platform", "Process Automation", "Intelligent Content Generation"]
  },
  {
    id: "logistics",
    name: "Logistics & Operations",
    path: "/screen_uv.png",
    knobColor: "#6B73FF",
    skill: "Supply Chain, Process Optimization",
    description: "Supply chain management en proces optimalisatie. Expert in inbound/outbound logistics, inventory management en operationele efficiëntie voor e-commerce.",
    tools: ["Supply Chain Management", "Inbound/Outbound Processes", "Inventory Systems"],
    projects: ["E-commerce Fulfillment", "Supply Chain Optimization", "Automated Warehousing"]
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Interests",
    path: "/keycap_uv-1.png",
    knobColor: "#FF6B6B",
    skill: "Apple Products, Sports, Mental Health",
    description: "Persoonlijke interesses en specialisaties. Apple product specialist, passionate about voetbal, MMA/BJJ/Kickboxing en mental health awareness.",
    tools: ["Apple Ecosystem", "Football", "MMA/BJJ/Kickboxing", "Mental Health Advocacy"],
    projects: ["Apple Product Reviews", "Sports Content Creation", "Wellness Apps"]
  }
];

type KeycapTexture = (typeof KEYCAP_TEXTURES)[number];

/**
 * Props for `ColorChanger`.
 */
export type ColorChangerProps = SliceComponentProps<Content.ColorChangerSlice>;

/**
 * Component for "ColorChanger" Slices.
 */
const ColorChanger: FC<ColorChangerProps> = ({ slice }) => {
  const [selectedTextureId, setSelectedTextureId] = useState(
    KEYCAP_TEXTURES[0].id,
  );
  const [backgroundText, setBackroundText] = useState(KEYCAP_TEXTURES[0].name);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleTextureSelect(texture: KeycapTexture) {
    if (texture.id === selectedTextureId || isAnimating) return;

    setIsAnimating(true);
    setSelectedTextureId(texture.id);
    setBackroundText(
      KEYCAP_TEXTURES.find((t) => t.id === texture.id)?.name || "",
    );
  }

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative py-20 md:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-100"
      id="keycap-changer"
    >
      {/* SVG background */}
      <svg
        className="pointer-events-none absolute top-0 left-0 h-auto w-full mix-blend-overlay"
        viewBox="0 0 75 100"
      >
        <text
          fontSize={7}
          textAnchor="middle"
          dominantBaseline={"middle"}
          x="50%"
          y="50%"
          className="font-black-slanted fill-white/20 uppercase group-hover:fill-white/30 motion-safe:transition-all motion-safe:duration-700"
        >
          {Array.from({ length: 20 }, (_, i) => (
            <tspan key={i} x={`${(i + 1) * 10}%`} dy={i === 0 ? -50 : 6}>
              {Array.from({ length: 10 }, () => backgroundText).join(" ")}
            </tspan>
          ))}
        </text>
      </svg>
      {/* Large 3D Keyboard Display */}
      <div className="h-[70vh] min-h-[600px] max-h-[800px] mb-16 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-2xl">
        <Canvas
          camera={{ position: [0, 0.8, 1], fov: 35, zoom: 2.2 }}
          className="w-full h-full"
        >
          <Scene
            selectedTextureId={selectedTextureId}
            onAnimationComplete={handleAnimationComplete}
          />
        </Canvas>
      </div>
      <Bounded
        className="relative shrink-0"
        innerClassName="gap-6 lg:gap-8 flex flex-col lg:flex-row"
      >
        <div className="max-w-lg shrink-0">
          <h2 className="font-bold-slanted mb-4 text-4xl uppercase lg:mb-6 lg:text-6xl text-slate-800">
            Skills
            <br />
            Keycaps
          </h2>
          <div className="text-pretty lg:text-lg text-slate-600">
            <p className="mb-4 leading-relaxed">
              Verken mijn 8 hoofdexpertise gebieden door verschillende keycap sets te selecteren. 
              Van frontend development tot AI automation, van e-commerce platforms tot digital marketing - 
              elk gebied toont mijn passie voor technologie en innovatie.
            </p>
            <p className="text-base text-slate-500 leading-relaxed">
              Klik op een keycap set hieronder om de 3D keyboard te transformeren en ontdek 
              welke tools, technologieën en projecten ik gebruik in elk vakgebied.
            </p>
          </div>
          
          {/* Current Skill Info */}
          <div className="mt-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-lg">
            <h3 className="font-bold text-xl text-slate-800 mb-2">
              {KEYCAP_TEXTURES.find(t => t.id === selectedTextureId)?.name}
            </h3>
            <p className="text-sm text-[#5B8DEF] mb-3 font-semibold">
              {KEYCAP_TEXTURES.find(t => t.id === selectedTextureId)?.skill}
            </p>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {KEYCAP_TEXTURES.find(t => t.id === selectedTextureId)?.description}
            </p>
            
            {/* Tools & Technologies */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Tools & Technologieën:</h4>
              <div className="flex flex-wrap gap-2">
                {KEYCAP_TEXTURES.find(t => t.id === selectedTextureId)?.tools?.map((tool, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-700 font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Recent Projects */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Recente Projecten:</h4>
              <div className="flex flex-wrap gap-2">
                {KEYCAP_TEXTURES.find(t => t.id === selectedTextureId)?.projects?.map((project, index) => (
                  <span key={index} className="px-3 py-1 bg-gradient-to-r from-[#5B8DEF] to-[#9AE6B4] text-white rounded-full text-xs font-medium">
                    {project}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ul className="grid grow grid-cols-2 gap-4 rounded-2xl bg-white p-6 text-black shadow-xl border border-slate-200 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {KEYCAP_TEXTURES.map((texture) => (
            <li key={texture.id}>
              <button
                onClick={() => handleTextureSelect(texture)}
                disabled={isAnimating}
                className={clsx(
                  "flex flex-col items-center justify-center rounded-xl border-2 p-4 hover:scale-[1.02] motion-safe:transition-all motion-safe:duration-300 min-h-[140px] group",
                  selectedTextureId === texture.id
                    ? "border-[#5B8DEF] bg-gradient-to-br from-[#5B8DEF]/20 to-[#9AE6B4]/10 shadow-lg"
                    : "cursor-pointer border-slate-200 hover:border-[#5B8DEF] hover:shadow-md bg-slate-50 hover:bg-white",
                  isAnimating && "cursor-not-allowed opacity-50",
                )}
              >
                <div className="mb-2 overflow-hidden rounded border border-gray-200 bg-gray-100 w-full aspect-[3/2]">
                  <Image
                    src={texture.path}
                    alt={texture.name}
                    width={400}
                    height={255}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-slate-800 block mb-1 group-hover:text-[#5B8DEF] transition-colors">
                    {texture.name}
                  </span>
                  <span className="text-xs text-slate-500 block leading-tight">
                    {texture.tools?.slice(0, 2).join(', ')}
                    {texture.tools && texture.tools.length > 2 ? '...' : ''}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Bounded>
    </section>
  );
};

export default ColorChanger;
