
export default function NavItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="w-full p-2 bg-[var(--background-fixed-white)] text-[var(--content-primary)] rounded-[12px] font-semibold text-sm shadow-xs hover:bg-[var(--background-fixed-white)]/80 transition-discrete cursor-pointer" onClick={onClick}>
      {label}
    </button>
  );
}