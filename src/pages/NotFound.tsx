import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { ArrowLeft, Home, LifeBuoy } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="relative grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-10">
      {/* Ambient blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-400/25 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      />

      {/* Card */}
      <motion.div
        className="glass relative w-full max-w-3xl overflow-hidden rounded-3xl p-8 shadow-elevated ring-1 ring-black/10 dark:ring-white/10"
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* top sheen */}
        <div className="pointer-events-none absolute inset-x-0 -top-28 h-40 bg-gradient-to-b from-white/30 to-transparent dark:from-white/10" />

        <div className="flex flex-col items-center text-center">
          {/* 404 headline with animated gradient */}
          <motion.h1
            className="text-[52px] md:text-[72px] font-extrabold leading-none tracking-tight"
            initial={{ letterSpacing: '-.02em' }}
            animate={{ letterSpacing: ['-.02em', '-.01em', '-.02em'] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #6366f1, #a78bfa, #22d3ee, #60a5fa)',
                backgroundSize: '200% 200%',
                display: 'inline-block',
              }}
            >
              <motion.span
                style={{ display: 'inline-block' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              >
                404
              </motion.span>
            </span>
          </motion.h1>

          <p className="mt-3 text-xl font-semibold">Page not found</p>
          <p className="mt-2 max-w-xl text-sm text-muted">
            The page you’re looking for doesn’t exist, has moved, or is unavailable.
          </p>

          {/* Action row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="brand"
              size="lg"
              onClick={() => navigate('/')}
              className="min-w-[160px]"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate(-1)}
              className="min-w-[160px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            <Button
              variant="soft"
              size="lg"
              onClick={() => navigate('/support')}
              className="min-w-[160px]"
            >
              <LifeBuoy className="h-4 w-4" />
              Contact Support
            </Button>
          </div>

          {/* Divider */}
          <div className="hr mt-8 w-full" />

          {/* Quick tips / links */}
          <div className="mt-6 grid w-full grid-cols-1 gap-3 text-left md:grid-cols-3">
            {[
              { title: 'Dashboard', desc: 'Return to your main overview', href: '/' },
              { title: 'Users', desc: 'Manage your customers & teams', href: '/users' },
              { title: 'Billing', desc: 'View invoices & plans', href: '/billing' },
            ].map((i) => (
              <button
                key={i.title}
                onClick={() => navigate(i.href)}
                className="group rounded-2xl px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                <div className="text-sm font-semibold">{i.title}</div>
                <div className="text-xs text-subtle">{i.desc}</div>
                <div className="mt-2 h-px w-0 bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-all group-hover:w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* corner orbs */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-fuchsia-500/25 blur-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        />
      </motion.div>
    </div>
  )
}