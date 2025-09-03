"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Play } from "lucide-react";
import { Button } from "./ui/button";
import MemojiOrb from "./MemojiOrb";

export type ChatShellSize = "compact" | "cozy" | "full";

export default function ChatShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [size, setSize] = useState<ChatShellSize>("cozy");

  const sizeClass =
    size === "compact"
      ? "max-w-[640px]"
      : size === "cozy"
      ? "max-w-[900px]"
      : "max-w-[1200px]";

  return (
    <div className={`relative mx-auto w-full ${sizeClass}`}>
      {/* Macintosh-inspired shell */}
      <div className="relative rounded-[12px] border border-neutral-300 bg-[#f2f0e6] shadow-[inset_-2px_-2px_4px_#d0cfc8,inset_2px_2px_4px_#ffffff,0_12px_24px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Titlebar */}
        <div className="h-[22px] flex items-center border-b border-neutral-400" style={{background:"repeating-linear-gradient(0deg,#ffffff 0px,#ffffff 1px,#000000 1px,#000000 2px)"}}>
          <div className="flex items-center gap-1 px-2">
            <div className="w-[12px] h-[12px] border border-black bg-neutral-300 flex items-center justify-center text-[8px] cursor-pointer">×</div>
            <div className="w-[12px] h-[12px] border border-black bg-neutral-300" />
            <div className="w-[12px] h-[12px] border border-black bg-neutral-300" />
          </div>
          <div className="text-center text-[10px] font-bold leading-none flex-1 pr-10">Lucas EVI</div>
          <div className="flex items-center gap-1 pr-2">
            <Button
              variant="ghost"
              className="rounded-full h-7 w-7 p-0"
              onClick={() => setSize(size === "full" ? "compact" : size === "cozy" ? "full" : "cozy")}
              title="Toggle size"
            >
              {size === "full" ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </Button>
            <Button
              className="rounded-full h-7 px-3"
              onClick={() => {
                window.dispatchEvent(new Event("lucas:start-call"));
              }}
            >
              <Play className="size-4 mr-1" /> Start
            </Button>
          </div>
        </div>

        {/* Screen area */}
        <div className="bg-black p-2">
          <div className="rounded-md p-2 bg-white min-h-[400px] border border-black/20 relative">
            <div className="absolute top-2 left-2">
              <MemojiOrb size={36} />
            </div>
            {children}
          </div>
        </div>

        {/* Base */}
        <div className="w-[120px] h-[28px] mx-auto bg-[#f2f0e6] rounded-b-[8px] shadow-[inset_-1px_-1px_2px_#d0cfc8,inset_1px_1px_2px_#ffffff]" />
      </div>
    </div>
  );
}
