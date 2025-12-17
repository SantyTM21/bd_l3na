'use client'

import { useForm } from 'react-hook-form'
import { register as registerAction } from './register'

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('cedula', data.cedula)
    formData.append('nombre', data.nombre)
    formData.append('apellido', data.apellido)
    formData.append('correo', data.correo)
    formData.append('password', data.password)
    formData.append('fechaNacimiento', data.fechaNacimiento)
    await registerAction(formData)
  }

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-sm shadow-blue-900'>
      <h1 className='text-2xl font-bold mb-4'>Registro</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
        <div>
          <input
            {...register('cedula', {
              required: 'La cédula es obligatoria',
              pattern: {
                value: /^\d{10}$/,
                message: 'La cédula debe tener 10 dígitos numéricos'
              }
            })}
            placeholder='Cédula'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.cedula && <p className='text-red-500 text-xs mt-1'>{errors.cedula.message}</p>}
        </div>

        <div>
          <input
            {...register('nombre', {
              required: 'El nombre es obligatorio'
            })}
            placeholder='Nombre'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.nombre && <p className='text-red-500 text-xs mt-1'>{errors.nombre.message}</p>}
        </div>

        <div>
          <input
            {...register('apellido', {
              required: 'El apellido es obligatorio'
            })}
            placeholder='Apellido'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.apellido && (
            <p className='text-red-500 text-xs mt-1'>{errors.apellido.message}</p>
          )}
        </div>

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
            type='email'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.correo && <p className='text-red-500 text-xs mt-1'>{errors.correo.message}</p>}
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
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.password && (
            <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('fechaNacimiento', {
              required: 'La fecha de nacimiento es obligatoria'
            })}
            type='date'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.fechaNacimiento && (
            <p className='text-red-500 text-xs mt-1'>{errors.fechaNacimiento.message}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-blue-400'
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  )
}
