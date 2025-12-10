import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <main className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='max-w-md w-full mx-4 p-6 bg-white rounded shadow'>
          <h1 className='text-2xl font-bold mb-4'>ServiGo</h1>
          <p className='text-sm text-gray-700'>
            <Link href='/login' className='text-blue-600 hover:underline'>
              Iniciar sesión
            </Link>{' '}
            o{' '}
            <Link href='/register' className='text-blue-600 hover:underline'>
              Crear cuenta
            </Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='max-w-md w-full mx-4 p-6 bg-white rounded shadow'>
        <h1 className='text-2xl font-bold mb-4'>Bienvenido</h1>
        <nav className='text-sm text-gray-700 space-x-2'>
          <Link href='/profile' className='text-blue-600 hover:underline'>
            Perfil
          </Link>
          <span>|</span>
          <Link href='/servicios' className='text-blue-600 hover:underline'>
            Servicios
          </Link>
          <span>|</span>
          <Link href='/cuentas' className='text-blue-600 hover:underline'>
            Cuentas
          </Link>
        </nav>
      </div>
    </main>
  )
}
