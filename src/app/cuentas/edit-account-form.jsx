'use client'

import { useForm } from 'react-hook-form'
import { updateCuenta } from './cuentas'

export default function EditAccountForm({ cuenta }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: cuenta.IdCuentaBanco,
      nombreBanco: cuenta.NombreBanco,
      numeroCuenta: cuenta.NumeroCuenta,
      tipoCuenta: cuenta.TipoCuenta,
      dueño: cuenta.Dueño || '',
      estado: !!cuenta.Estado,
    },
  })

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('nombreBanco', data.nombreBanco)
    formData.append('numeroCuenta', data.numeroCuenta)
    formData.append('tipoCuenta', data.tipoCuenta)
    formData.append('dueño', data.dueño)
    if (data.estado) formData.append('estado', 'on')
    
    await updateCuenta(formData)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3'
    >
      <input type='hidden' {...register('id')} />

      <div>
        <input
          {...register('nombreBanco', {
            required: 'El nombre del banco es obligatorio',
          })}
          placeholder='Banco'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        {errors.nombreBanco && (
          <p className='text-red-500 text-xs mt-1'>
            {errors.nombreBanco.message}
          </p>
        )}
      </div>

      <div>
        <input
          {...register('numeroCuenta', {
            required: 'El número de cuenta es obligatorio',
            pattern: {
                value: /^\d+$/,
                message: 'Debe ser un número válido'
            }
          })}
          placeholder='Número de cuenta'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        {errors.numeroCuenta && (
          <p className='text-red-500 text-xs mt-1'>
            {errors.numeroCuenta.message}
          </p>
        )}
      </div>

      <div>
        <select
          {...register('tipoCuenta')}
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        >
          <option value='Ahorros'>Ahorros</option>
          <option value='Corriente'>Corriente</option>
        </select>
      </div>

      <div>
        <input
          {...register('dueño', {
            required: 'El nombre del dueño es obligatorio',
          })}
          placeholder='Dueño'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        {errors.dueño && (
          <p className='text-red-500 text-xs mt-1'>{errors.dueño.message}</p>
        )}
      </div>

      <label className='flex items-center gap-2 text-sm'>
        <input type='checkbox' {...register('estado')} className='h-4 w-4' />
        Activa
      </label>

      <div className='md:col-span-2'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='px-4 py-2 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:bg-green-400'
        >
          {isSubmitting ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
    </form>
  )
}
