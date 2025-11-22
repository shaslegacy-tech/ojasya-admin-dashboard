import clsx from "clsx"

export default function PageTitle({
  title,
  subtitle,
  className,
}: {
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={clsx("relative z-10", className)}>
      <h2 className="page-title text-lg md:text-xl font-extrabold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="page-sub text-sm">
          {subtitle}
        </p>
      )}
    </div>
  )
}