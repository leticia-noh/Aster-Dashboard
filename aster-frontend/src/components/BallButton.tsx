export default function BallButton({ variant = "white", label, onClick }: { variant: string; label: string; onClick: () => void }) {    // variant = "white" ou "glass"
  return (
    <button className={`min-w-9 min-h-9 px-2 ${variant === "glass" ? "bg-[var(--background-fixed-white)]/45" : "bg-[var(--background-fixed-white)] text-[var(--content-primary)] hover:bg-[var(--background-fixed-white)]/80"} rounded-[80px] font-bold text-sm shadow-md transition-discrete cursor-pointer`} onClick={onClick}>
      {label}
    </button>
  );
}
