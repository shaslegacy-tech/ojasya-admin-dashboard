// src/ui/SectionTitle.tsx
import clsx from "clsx"

type SectionTitleProps = {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  hint?: string
  className?: string
}

export default function SectionTitle({ icon: Icon, label, hint, className }: SectionTitleProps) {
  return (
    <div className={clsx("relative z-10 flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="h-8 w-8 grid place-items-center rounded-xl bg-black/5 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/10">
            <Icon className="h-4 w-4 opacity-80" aria-hidden="true" />
          </div>
        )}
        <div>
          {/* hooks for CSS overrides */}
          <h3 className="section-title text-sm font-semibold tracking-wide">
            {label}
          </h3>
          {hint && (
            <p className="section-sub text-xs">
              {hint}
            </p>
          )}
        </div>
      </div>

      <div className="hidden xl:block h-[2px] w-24 rounded-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 opacity-60" />
    </div>
  )
}