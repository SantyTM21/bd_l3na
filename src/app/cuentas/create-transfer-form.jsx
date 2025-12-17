'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { createTransferencia } from './transferencias'

export default function CreateTransferForm({ cuentas }) {
  const [serverMsg, setServerMsg] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    setServerMsg(null)

    const formData = new FormData()
    formData.append('idCuentaBanco', data.idCuentaBanco)
    formData.append('tipoTransferencia', data.tipoTransferencia)
    formData.append('monto', data.monto)
    formData.append('destinatario', data.destinatario)
    formData.append('comentario', data.comentario || '')

    const res = await createTransferencia(formData)

    setServerMsg(res?.message || 'Respuesta desconocida')

    if (res?.ok) {
      reset() // <-- ahora sí se ejecuta
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <div>
          <select
            {...register('idCuentaBanco', { required: 'Selecciona una cuenta' })}
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value=''>Selecciona cuenta</option>
            {cuentas
              .filter((c) => !!c.Estado)
              .map((c) => (
                <option key={c.IdCuentaBanco} value={c.IdCuentaBanco}>
                  {c.NombreBanco} - {c.NumeroCuenta}
                </option>
              ))}
          </select>
          {errors.idCuentaBanco && (
            <p className='text-red-500 text-xs mt-1'>{errors.idCuentaBanco.message}</p>
          )}
        </div>

        <div>
          <select
            {...register('tipoTransferencia')}
            defaultValue='Ingreso'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value='Ingreso'>Ingreso</option>
            <option value='Egreso'>Egreso</option>
          </select>
        </div>

        <div>
          <input
            {...register('monto', {
              required: 'El monto es obligatorio',
              min: { value: 0.01, message: 'Debe ser mayor a 0' }
            })}
            type='number'
            step='0.01'
            placeholder='Monto'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.monto && <p className='text-red-500 text-xs mt-1'>{errors.monto.message}</p>}
        </div>

        <div>
          <input
            {...register('destinatario', { required: 'El destinatario es obligatorio' })}
            placeholder='Destinatario'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          {errors.destinatario && (
            <p className='text-red-500 text-xs mt-1'>{errors.destinatario.message}</p>
          )}
        </div>

        <div className='md:col-span-2'>
          <input
            {...register('comentario')}
            placeholder='Comentario'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
        </div>

        <div className='md:col-span-2'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full md:w-auto px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-blue-400'
          >
            {isSubmitting ? 'Creando...' : 'Crear transferencia'}
          </button>
        </div>
      </form>

      {serverMsg && (
        <p className='mt-3 text-sm'>
          {/* si quieres colorear: basado en si incluye "creada" */}
          {serverMsg}
        </p>
      )}
    </>
  )
}
