'use client'

import { useForm } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPago } from './pagos'

export default function CreatePaymentForm({ servicios, cuentas }) {
  const router = useRouter()
  const [serverMsg, setServerMsg] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm({ defaultValues: { tipoPago: 'EFECTIVO', monto: '' } })

  const idServicio = watch('idServicio')
  const tipoPago = watch('tipoPago')

  const servicioSel = useMemo(
    () => servicios.find((s) => String(s.IdServicio) === String(idServicio)),
    [servicios, idServicio]
  )

  useEffect(() => {
    if (servicioSel?.Precio != null) {
      // setea monto sugerido, pero el usuario lo puede editar
      setValue('monto', String(servicioSel.Precio), { shouldValidate: true })
    }
  }, [servicioSel, setValue])

  const onSubmit = async (data) => {
    setServerMsg(null)
    const fd = new FormData()
    fd.append('idServicio', data.idServicio)
    fd.append('monto', data.monto)
    fd.append('comentario', data.comentario || '')
    fd.append('tipoPago', data.tipoPago)
    if (data.tipoPago === 'CUENTA') fd.append('idCuentaBanco', data.idCuentaBanco)

    const res = await createPago(fd)
    setServerMsg(res?.message || 'Respuesta desconocida')

    if (res?.ok) {
      reset({ tipoPago: 'EFECTIVO', monto: '' })
      router.refresh() // <-- esto refresca TotalGastado y listas sin redirect
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'
      >
        <div className='md:col-span-2'>
          <select
            {...register('idServicio', { required: 'Selecciona un servicio' })}
            className='w-full border rounded px-3 py-2'
          >
            <option value=''>Selecciona servicio activo</option>
            {servicios
              .filter((s) => Number(s.Estado) === 1)
              .map((s) => (
                <option key={s.IdServicio} value={s.IdServicio}>
                  {s.Nombre}
                </option>
              ))}
          </select>
          {errors.idServicio && (
            <p className='text-red-500 text-xs mt-1'>{errors.idServicio.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('monto', {
              required: 'Monto obligatorio',
              min: { value: 0.01, message: 'Mayor a 0' }
            })}
            type='number'
            step='0.01'
            placeholder='Monto'
            className='w-full border rounded px-3 py-2'
          />
          {errors.monto && <p className='text-red-500 text-xs mt-1'>{errors.monto.message}</p>}
        </div>

        <div className='flex items-center gap-4'>
          <label className='flex items-center gap-2'>
            <input type='radio' value='EFECTIVO' {...register('tipoPago')} /> Efectivo
          </label>
          <label className='flex items-center gap-2'>
            <input type='radio' value='CUENTA' {...register('tipoPago')} /> Cuenta
          </label>
        </div>

        {tipoPago === 'CUENTA' && (
          <div className='md:col-span-2'>
            <select
              {...register('idCuentaBanco', { required: 'Selecciona una cuenta' })}
              className='w-full border rounded px-3 py-2'
            >
              <option value=''>Selecciona cuenta activa</option>
              {cuentas
                .filter((c) => Number(c.Estado) === 1)
                .map((c) => (
                  <option key={c.IdCuentaBanco} value={c.IdCuentaBanco}>
                    {c.NombreBanco} - {c.NumeroCuenta} (Saldo: {c.Saldo})
                  </option>
                ))}
            </select>
            {errors.idCuentaBanco && (
              <p className='text-red-500 text-xs mt-1'>{errors.idCuentaBanco.message}</p>
            )}
          </div>
        )}

        <div className='md:col-span-2'>
          <input
            {...register('comentario')}
            placeholder='Comentario'
            className='w-full border rounded px-3 py-2'
          />
        </div>

        <div className='md:col-span-2'>
          <button
            disabled={isSubmitting}
            className='w-full md:w-auto px-4 py-2 rounded bg-blue-600 text-white font-semibold disabled:bg-blue-400'
          >
            {isSubmitting ? 'Pagando...' : 'Realizar pago'}
          </button>
        </div>
      </form>

      {serverMsg && <p className='mt-3 text-sm'>{serverMsg}</p>}
    </>
  )
}
