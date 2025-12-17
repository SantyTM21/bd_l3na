'use client'

import { useForm } from 'react-hook-form'
import { updateProfile } from './profile'

export default function ProfileForm({ user, msg }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nombre: user.Nombre,
      apellido: user.Apellido,
      celular: user.Celular || '',
      fechaNacimiento: user.FechaNacimiento
        ? new Date(user.FechaNacimiento).toISOString().slice(0, 10)
        : '',
    },
  })

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('nombre', data.nombre)
    formData.append('apellido', data.apellido)
    formData.append('celular', data.celular)
    formData.append('fechaNacimiento', data.fechaNacimiento)
    await updateProfile(formData)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-3 mb-4'>
        <div>
          <input
            {...register('nombre', {
              required: 'El nombre es obligatorio',
            })}
            placeholder='Nombre'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.nombre && (
            <p className='text-red-500 text-xs mt-1'>{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('apellido', {
              required: 'El apellido es obligatorio',
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
            {...register('celular', {
              pattern: {
                value: /^\d{10}$/,
                message: 'El celular debe tener 10 dígitos',
              },
            })}
            placeholder='Celular'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.celular && (
            <p className='text-red-500 text-xs mt-1'>{errors.celular.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('fechaNacimiento', {
              required: 'La fecha de nacimiento es obligatoria',
            })}
            type='date'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.fechaNacimiento && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.fechaNacimiento.message}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-blue-400'
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </form>

      {msg && <p className='mb-4 text-sm text-green-600'>{msg}</p>}
    </>
  )
}
