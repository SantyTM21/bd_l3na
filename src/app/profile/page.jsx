import { getCurrentUser } from '@/lib/auth'
import { updateProfile } from './profile'
import { logout } from '../login/login'
import { redirect } from 'next/navigation'

export default async function ProfilePage({ searchParams }) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const sp = await searchParams
  const msg = typeof sp?.get === 'function' ? sp.get('msg') : sp?.msg
  const fecha = user.FechaNacimiento
    ? new Date(user.FechaNacimiento).toISOString().slice(0, 10)
    : ''

  return (
    <div className='max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow'>
      <h1 className='text-2xl font-bold mb-4'>Perfil</h1>

      <p className='mb-4 text-sm text-gray-700'>
        <span className='font-semibold'>Correo:</span> {user.Correo}
      </p>

      <form action={updateProfile} className='space-y-3 mb-4'>
        <input
          name='nombre'
          defaultValue={user.Nombre}
          placeholder='Nombre'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <input
          name='apellido'
          defaultValue={user.Apellido}
          placeholder='Apellido'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <input
          name='celular'
          defaultValue={user.Celular || ''}
          placeholder='Celular'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <input
          type='date'
          name='fechaNacimiento'
          defaultValue={fecha}
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <button
          type='submit'
          className='w-full py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition'
        >
          Guardar
        </button>
      </form>

      {msg && <p className='mb-4 text-sm text-green-600'>{msg}</p>}

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
