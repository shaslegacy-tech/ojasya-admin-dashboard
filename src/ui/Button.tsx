// src/ui/Button.tsx
import clsx from 'clsx'
import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type Variant =
  | 'brand'
  | 'soft'
  | 'ghost'
  | 'outline'
  | 'gray'
  | 'success'
  | 'danger'

type Size = 'sm' | 'md' | 'lg'

// Base props come from Framer Motion's button props to avoid onDrag type mismatch
type ButtonBaseProps = Omit<HTMLMotionProps<'button'>, 'ref'>

type Props = ButtonBaseProps & {
  variant?: Variant
  size?: Size
  animated?: boolean
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-2xl',
  md: 'h-10 px-4 text-sm rounded-2xl',
  lg: 'h-11 px-5 text-sm rounded-2xl',
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      variant = 'brand',
      size = 'md',
      className,
      disabled,
      animated = true,
      children,
      ...rest
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold transition-all ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring)/0.35)] ' +
      'active:translate-y-[0.5px] select-none'

    const brand = clsx(
      '!text-white [&_*]:!text-white',
      'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500',
      'shadow-md hover:brightness-105 hover:shadow-lg active:brightness-95',
      'disabled:opacity-60 disabled:pointer-events-none'
    )

    const soft = clsx(
      'text-slate-800 dark:text-white [&_*]:text-slate-800 dark:[&_*]:text-white',
      'bg-slate-100 hover:bg-slate-200 active:bg-slate-300',
      'dark:bg-white/10 dark:hover:bg-white/14 dark:active:bg-white/18',
      'ring-1 ring-black/10 dark:ring-white/10',
      'disabled:opacity-50 disabled:pointer-events-none'
    )

    const ghost = clsx(
      'text-slate-800 dark:text-white [&_*]:text-slate-800 dark:[&_*]:text-white',
      'bg-transparent hover:bg-slate-100 active:bg-slate-200',
      'dark:hover:bg-white/10 dark:active:bg-white/14',
      'disabled:opacity-50 disabled:pointer-events-none'
    )

    const outline = clsx(
      'text-slate-800 dark:text-white [&_*]:text-slate-800 dark:[&_*]:text-white',
      'bg-transparent ring-1 ring-slate-300 hover:bg-slate-100 active:bg-slate-200',
      'dark:ring-white/20 dark:hover:bg-white/10 dark:active:bg-white/14',
      'disabled:opacity-50 disabled:pointer-events-none'
    )

    const gray = clsx(
      'text-slate-800 dark:text-white [&_*]:text-slate-800 dark:[&_*]:text-white',
      'bg-slate-200 hover:bg-slate-300 active:bg-slate-400',
      'dark:bg-white/10 dark:hover:bg-white/14 dark:active:bg-white/18',
      'ring-1 ring-slate-300 dark:ring-white/10',
      'disabled:opacity-50 disabled:pointer-events-none'
    )

    const success = clsx(
      'text-white [&_*]:text-white',
      'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700',
      'shadow-sm',
      'disabled:opacity-60 disabled:pointer-events-none'
    )

    const danger = clsx(
      'text-white [&_*]:text-white',
      'bg-rose-500 hover:bg-rose-600 active:bg-rose-700',
      'shadow-sm',
      'disabled:opacity-60 disabled:pointer-events-none'
    )

    const styles =
      variant === 'brand' ? brand :
      variant === 'soft' ? soft :
      variant === 'ghost' ? ghost :
      variant === 'outline' ? outline :
      variant === 'gray' ? gray :
      variant === 'success' ? success :
      danger

    return (
      <motion.button
        ref={ref}
        // Only animate when enabled
        whileHover={animated && !disabled ? { y: -1 } : undefined}
        whileTap={animated && !disabled ? { y: 0 } : undefined}
        className={clsx(base, sizes[size], styles, className)}
        disabled={disabled}
        {...rest}
      >
        {children}
      </motion.button>
    )
  }
)

export default Button