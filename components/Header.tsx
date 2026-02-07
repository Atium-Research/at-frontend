import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-col gap-1 border-b border-gray-800/80 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
            <Image
              src="/atium.svg"
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-contain filter-[invert(1)_drop-shadow(0_0_6px_rgba(0,212,255,0.5))]"
            />
          </span>
          <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
            ATIUM RESEARCH
          </h1>
        </div>
      </div>
      <div
        className="h-0.5 w-54 rounded-full shadow-tron-glow-sm animate-tron-shimmer"
        aria-hidden
      />
    </header>
  );
}
