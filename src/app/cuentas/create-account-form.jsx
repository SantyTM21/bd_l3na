'use client'

import { useForm } from 'react-hook-form'
import { createCuenta } from './cuentas'

export default function CreateAccountForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('nombreBanco', data.nombreBanco)
    formData.append('numeroCuenta', data.numeroCuenta)
    formData.append('tipoCuenta', data.tipoCuenta)
    formData.append('dueño', data.dueño)
    await createCuenta(formData)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-3'>
      <div>
        <input
          {...register('nombreBanco', {
            required: 'El nombre del banco es obligatorio'
          })}
          placeholder='Banco'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        {errors.nombreBanco && (
          <p className='text-red-500 text-xs mt-1'>{errors.nombreBanco.message}</p>
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
          <p className='text-red-500 text-xs mt-1'>{errors.numeroCuenta.message}</p>
        )}
      </div>

      <div>
        <select
          {...register('tipoCuenta')}
          defaultValue='Ahorros'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        >
          <option value='Ahorros'>Ahorros</option>
          <option value='Corriente'>Corriente</option>
        </select>
      </div>

      <div>
        <input
          {...register('dueño', {
            required: 'El nombre del dueño es obligatorio'
          })}
          placeholder='Dueño'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        {errors.dueño && <p className='text-red-500 text-xs mt-1'>{errors.dueño.message}</p>}
      </div>

      <div>
        <input
          {...register('saldoInicial', {
            required: 'El saldo inicial es obligatorio',
            min: { value: 0, message: 'No puede ser negativo' }
          })}
          type='number'
          step='0.01'
          placeholder='Saldo inicial'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        {errors.saldoInicial && (
          <p className='text-red-500 text-xs mt-1'>{errors.saldoInicial.message}</p>
        )}
      </div>

      <div className='md:col-span-2'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full md:w-auto px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-blue-400'
        >
          {isSubmitting ? 'Guardando...' : 'Guardar cuenta'}
        </button>
      </div>
    </form>
  )
}
