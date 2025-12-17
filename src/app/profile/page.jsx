import { getCurrentUser } from '@/lib/auth'
import ProfileForm from './profile-form'
import { logout } from '../login/login'
import { redirect } from 'next/navigation'

export default async function ProfilePage({ searchParams }) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const sp = await searchParams
  const msg = typeof sp?.get === 'function' ? sp.get('msg') : sp?.msg

  return (
    <div className='max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow'>
      <h1 className='text-2xl font-bold mb-4'>Perfil</h1>

      <p className='mb-4 text-sm text-gray-700'>
        <span className='font-semibold'>Correo:</span> {user.Correo}
      </p>

      <ProfileForm user={user} msg={msg} />

      <hr className='my-4' />

      <div className='mb-4 text-sm'>
        <a href='/servicios' className='text-blue-600 hover:underline mr-2'>
          Mis servicios
        </a>
        |
        <a href='/cuentas' className='text-blue-600 hover:underline ml-2'>
          Mis cuentas bancarias
        </a>
      </div>

      <form action={logout}>
        <button
          type='submit'
          className='w-full py-2 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition'
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
