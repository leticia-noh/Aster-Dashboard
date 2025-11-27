export default function Button({ variant = "white", label, onClick }: { variant: string; label: string; onClick: () => void }) {    // variant = "white" ou "black"
  return (
    <button className={`min-w-32 py-2 px-8 ${variant === "black" ? "bg-[var(--background-fixed-black)] text-[var(--content-inverse)] hover:bg-[var(--background-fixed-black)]/80" : "bg-[var(--background-fixed-white)] text-[var(--content-primary)] hover:bg-[var(--background-fixed-white)]/80"} rounded-[80px] font-semibold text-sm shadow-md transition-discrete cursor-pointer`} onClick={onClick}>
      {label}
    </button>
  );
}