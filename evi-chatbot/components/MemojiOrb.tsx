import Image from "next/image";

export default function MemojiOrb({ size = 48 }: { size?: number }) {
  const dimension = `${size}px`;
  return (
    <div
      className="relative"
      style={{ width: dimension, height: dimension }}
    >
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(91,141,239,0.3),rgba(154,230,180,0.3),rgba(91,141,239,0.3))] blur-md opacity-70 animate-[rotateSlow_12s_linear_infinite]" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(91,141,239,0.35),transparent_60%)] blur" />
      <div className="relative w-full h-full rounded-full overflow-hidden border border-white/80 shadow-[0_8px_24px_rgba(91,141,239,0.35)] animate-[floatY_6s_ease-in-out_infinite]">
        <Image src="/lucas-memoji.svg" alt="Lucas Memoji" fill className="object-cover" />
      </div>
    </div>
  );
}
