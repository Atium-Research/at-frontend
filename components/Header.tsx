export default function Header() {
  return (
    <header className="flex flex-col gap-1 border-b border-gray-800/80 pb-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
          ATIUM RESEARCH
        </h1>
      </div>
      <div
        className="h-0.5 w-42 rounded-full shadow-tron-glow-sm animate-tron-shimmer"
        aria-hidden
      />
      <p className="text-xs text-gray-500 tracking-wide">
        Agentic quant workflows
      </p>
    </header>
  );
}
