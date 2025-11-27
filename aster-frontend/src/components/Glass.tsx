import { LiquidGlassReact } from 'solid-glass/react';
import "solid-glass/style.css";

// Para padding personalizado, use <Glass padding="p-X"> ...
// Mesma coisa para gap

export default function Glass({ padding = 'p-6', gap, className, children, shadow = 'md' }: { padding?: string, gap?: string, className?: string, children: React.ReactNode, shadow?: string }) {
  return (
    <LiquidGlassReact
        width="fit-content"
        height="fit-content"
        shadowColor="rgba(255, 255, 255, 0.5)"
        shadowBlur={0.75}
        shadowSpread={0.45}
        frostBlur={30}
        borderRadius={48}
        className={`${className} ${padding} ${gap} shadow-${shadow} rounded-[48px] border border-[var(--background-fixed-white)]/60 bg-[var(--background-fixed-white)]/40 pointer-events-none select-none`}
        style={{ backdropFilter: 'blur(10px)' }}
    >
        <div className={`pointer-events-auto`}>
        {children}
        </div>
    </LiquidGlassReact>
  );
}