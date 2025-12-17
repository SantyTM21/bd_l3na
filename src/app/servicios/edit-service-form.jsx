'use client'

import { useForm } from 'react-hook-form'
import { updateServicio } from './servicios'

export default function EditServiceForm({ servicio }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      id: servicio.IdServicio,
      nombre: servicio.Nombre,
      descripcion: servicio.Descripcion || '',
      numeroCuenta: servicio.NumeroCuenta || '',
      tipoPeriodo: servicio.TipoPeriodo,
      precio: servicio.Precio,
      esAutomatico: !!servicio.EsAutomatico,
      estado: !!servicio.Estado
    }
  })

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('nombre', data.nombre)
    formData.append('descripcion', data.descripcion)
    formData.append('numeroCuenta', data.numeroCuenta)
    formData.append('tipoPeriodo', data.tipoPeriodo)
    formData.append('precio', data.precio)
    if (data.esAutomatico) formData.append('esAutomatico', 'on')
    if (data.estado) formData.append('estado', 'on')

    await updateServicio(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
      <input type='hidden' {...register('id')} />

      <div>
        <input
          {...register('nombre', { required: 'El nombre es obligatorio' })}
          placeholder='Nombre'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        {errors.nombre && <p className='text-red-500 text-xs mt-1'>{errors.nombre.message}</p>}
      </div>

      <div>
        <input
          {...register('descripcion')}
          placeholder='Descripción'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
      </div>

      <div>
        <input
          {...register('numeroCuenta', {
            required: 'El número de cuenta es obligatorio'
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
          {...register('tipoPeriodo')}
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        >
          <option value='Mensual'>Mensual</option>
          <option value='Anual'>Anual</option>
        </select>
      </div>

      <div>
        <input
          {...register('precio', {
            required: 'El precio es obligatorio',
            min: { value: 0, message: 'El precio debe ser positivo' }
          })}
          type='number'
          step='0.01'
          placeholder='Precio'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        {errors.precio && <p className='text-red-500 text-xs mt-1'>{errors.precio.message}</p>}
      </div>

      <label className='flex items-center gap-2 text-sm'>
        <input type='checkbox' {...register('esAutomatico')} className='h-4 w-4' />
        Automático
      </label>

      <label className='flex items-center gap-2 text-sm'>
        <input type='checkbox' {...register('estado')} className='h-4 w-4' />
        Activo
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
