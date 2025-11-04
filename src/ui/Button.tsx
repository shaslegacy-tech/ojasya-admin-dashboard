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
           '!text-white [&_*]:!text-white',
            'shadow-soft bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500',
            'hover:brightness-[1.06] hover:shadow-elevated active:brightness-95',
            'disabled:opacity-60 disabled:pointer-events-none'
        ],
        // primary
        variant === 'primary' && [
          'text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-900 shadow-soft',
          'dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
        ],
        // ghost
        variant === 'ghost' && [
          'text-slate-800 dark:text-white',
          '[&_*]:text-slate-800 dark:[&_*]:text-white',
          'hover:bg-slate-100 active:bg-slate-200',                /* ✅ visible hover */
          'dark:hover:bg-white/10 dark:active:bg-white/14',
          'disabled:opacity-50 disabled:pointer-events-none'
        ],
        // soft
        variant === 'soft' && [
         'text-slate-800 dark:text-white',
        '[&_*]:text-slate-800 dark:[&_*]:text-white',
        'bg-slate-100 hover:bg-slate-200 active:bg-slate-300',  /* ✅ stronger light mode */
        'dark:bg-white/10 dark:hover:bg-white/14 dark:active:bg-white/18',
        'ring-1 ring-black/10 dark:ring-white/10',
        'disabled:opacity-50 disabled:pointer-events-none'
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
