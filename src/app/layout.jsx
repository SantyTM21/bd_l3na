import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { getCurrentUser } from '@/lib/auth'
import { logout } from './login/login'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata = {
  title: 'ServiGo',
  description: 'Gestión de servicios y cuentas'
}

export default async function RootLayout({ children }) {
  const user = await getCurrentUser()

  return (
    <html lang='es'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className='border-b bg-white'>
          <div className='max-w-5xl mx-auto px-4 py-3 flex items-center justify-between'>
            <Link href='/' className='font-semibold text-shadow-blue-900'>
              ServiGo
            </Link>

            {user ? (
              <nav className='flex items-center gap-4 text-sm'>
                <Link href='/profile' className='text-blue-600 hover:underline'>
                  Perfil
                </Link>
                <Link href='/servicios' className='text-blue-600 hover:underline'>
                  Servicios
                </Link>
                <Link href='/cuentas' className='text-blue-600 hover:underline'>
                  Cuentas
                </Link>
                <form action={logout}>
                  <button
                    type='submit'
                    className='px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700'
                  >
                    Salir
                  </button>
                </form>
              </nav>
            ) : (
              <nav className='flex items-center gap-4 text-sm'>
                <Link href='/login' className='text-blue-600 hover:underline'>
                  Login
                </Link>
                <Link href='/register' className='text-blue-600 hover:underline'>
                  Registro
                </Link>
              </nav>
            )}
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  )
}
