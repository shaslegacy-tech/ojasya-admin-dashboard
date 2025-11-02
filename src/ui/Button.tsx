import clsx from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'brand' | 'primary' | 'ghost' | 'soft'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
        'active:translate-y-[0.5px]',
        size === 'sm' && 'text-xs px-3 py-1.5',
        size === 'md' && 'text-sm px-4 py-2',
        size === 'lg' && 'text-base px-5 py-2.5',
        // brand
        variant === 'brand' && [
          'text-white shadow-soft',
          'bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500',
          'hover:brightness-[1.06] hover:shadow-elevated active:brightness-95',
          'dark:from-violet-400 dark:via-indigo-400 dark:to-sky-400',
          'dark:text-[rgb(10,14,28)]'
        ],
        // primary
        variant === 'primary' && [
          'text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-900 shadow-soft',
          'dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
        ],
        // ghost
        variant === 'ghost' && [
          '!text-slate-800 [&_*]:!text-slate-800',
          'dark:!text-white dark:[&_*]:!text-white',

          'bg-black/5 hover:bg-black/10 active:bg-black/15',
          'dark:bg-white/10 dark:hover:bg-white/14 dark:active:bg-white/20',

          'backdrop-blur-md',
          'disabled:opacity-50 disabled:pointer-events-none'
        ],
        // soft
        variant === 'soft' && [
          'text-slate-900 bg-surface/70 hover:bg-surface/80 active:bg-surface/90',
          'dark:text-white dark:bg-white/10 dark:hover:bg-white/14 dark:active:bg-white/18',
          'backdrop-blur'
        ],
        'disabled:opacity-60 disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
