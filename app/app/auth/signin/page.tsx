
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { LoginForm } from '@/components/auth/login-form'

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Social Media Approval
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entre na sua conta para gerenciar conteúdos
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
