import { getCurrentUser } from '@/lib/auth'
import { listServicios } from './servicios'
import { listCuentas } from '../cuentas/cuentas'
import { listPagos } from './pagos'
import { redirect } from 'next/navigation'
import CreateServiceForm from './create-service-form'
import EditServiceForm from './edit-service-form'
import CreatePaymentForm from './create-payment-form'

export default async function ServiciosPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const servicios = await listServicios()
  const serviciosActivos = servicios.filter((s) => Number(s.Estado) === 1)
  const cuentas = await listCuentas()
  const pagos = await listPagos()
  const pagosByServicio = pagos.reduce((acc, p) => {
    const key = String(p.IdServicio) // <-- clave como string
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  return (
    <div className='max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow space-y-8'>
      <h1 className='text-2xl font-bold mb-2'>Servicios</h1>

      {/* Crear servicio */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Crear servicio</h2>
        <CreateServiceForm />
      </section>

      {/* Mis servicios */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Mis servicios</h2>
        <ul className='space-y-3 text-sm'>
          {servicios.map((s) => (
            <li key={s.IdServicio} className='border border-gray-200 rounded px-4 py-3 bg-gray-50'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                <div>
                  <p className='font-semibold'>{s.Nombre}</p>

                  <p className='text-gray-700'>
                    ${s.Precio} · Gastado: <span className='font-mono'>${s.TotalGastado}</span> ·{' '}
                    <span className={s.Estado ? 'text-green-600' : 'text-red-600'}>
                      {s.Estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                </div>
              </div>

              <details className='mt-2'>
                <summary className='cursor-pointer text-blue-600 text-sm'>Editar</summary>
                <EditServiceForm servicio={s} />
              </details>

              <details className='mt-3'>
                <summary className='cursor-pointer text-blue-600 text-sm'>Pagos recientes</summary>

                <div className='mt-2'>
                  <ul className='space-y-1 text-xs'>
                    {(pagosByServicio[s.IdServicio] || []).slice(0, 5).map((p) => (
                      <li key={p.IdPago} className='flex justify-between'>
                        <span>
                          {new Date(p.FechaPago).toLocaleDateString()} · {p.MetodoPago}
                          {p.Comentario ? ` · ${p.Comentario}` : ''}
                        </span>
                        <span className='font-mono'>${p.Monto}</span>
                      </li>
                    ))}

                    {(!pagosByServicio[s.IdServicio] ||
                      pagosByServicio[s.IdServicio].length === 0) && (
                      <li className='text-gray-500'>Sin pagos</li>
                    )}
                  </ul>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </section>

      {/* Crear pago de servicio */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Crear pago de servicio</h2>
        <CreatePaymentForm servicios={serviciosActivos} cuentas={cuentas} />
      </section>
    </div>
  )
}
