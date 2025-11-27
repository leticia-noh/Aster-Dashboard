export default function ListButton({label, onClick}: {label: string, onClick?: () => void}) {
    return (
    <div className="w-full bg-[var(--background-fixed-white)] rounded-xl font-semibold text-sm p-4 shadow-xs hover:bg-[var(--background-fixed-white)]/85 transition-colors cursor-pointer" onClick={onClick}>
        {label}
    </div>
    );
}