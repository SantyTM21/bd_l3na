'use client'

import { useForm } from 'react-hook-form'
import { login } from './login'

export default function LoginForm({ error }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('correo', data.correo)
    formData.append('password', data.password)
    await login(formData)
  }

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-sm shadow-blue-900'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <input
            {...register('correo', {
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo inválido'
              }
            })}
            placeholder='Correo'
            className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.correo && <p className='text-red-500 text-sm mt-1'>{errors.correo.message}</p>}
        </div>

        <div>
          <input
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              }
            })}
            placeholder='Contraseña'
            type='password'
            className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-400'
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
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
