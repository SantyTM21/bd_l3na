// src/app/login/page.jsx
import { login } from './login'

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams
  const error = typeof sp?.get === 'function' ? sp.get('error') : sp?.error

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded shadow'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>

      <form action={login} className='space-y-4'>
        <input
          name='correo'
          placeholder='Correo'
          className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
        />
        <input
          name='password'
          placeholder='Contraseña'
          type='password'
          className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
        />
        <button
          type='submit'
          className='w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition'
        >
          Entrar
        </button>
      </form>

      {error && <p className='mt-3 text-sm text-red-600'>{error}</p>}

      <p className='mt-4 text-sm text-gray-700'>
        ¿No tienes cuenta?{' '}
        <a href='/register' className='text-blue-600 hover:underline'>
          Registrarse
        </a>
      </p>
    </div>
  )
}
