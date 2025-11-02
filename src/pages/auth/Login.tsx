import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../../store/auth'
import { useLocation, useNavigate } from 'react-router-dom'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
type FormValues = z.infer<typeof schema>

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })
  const navigate = useNavigate()
  const location = useLocation() as any
  const login = useAuthStore(s => s.login)

  const onSubmit = async (values: FormValues) => {
    await login(values.email, values.password)
    const dest = location?.state?.from?.pathname ?? '/'
    navigate(dest, { replace: true })
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-slate-400 mb-6">Sign in to your admin dashboard</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-xl bg-white text-slate-900 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
