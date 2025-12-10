import { getCurrentUser } from '@/lib/auth'
import { listServicios, createServicio, updateServicio } from './servicios'
import { createPago } from './pagos'
import { redirect } from 'next/navigation'

export default async function ServiciosPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const servicios = await listServicios()

  return (
    <div className='max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow space-y-8'>
      <h1 className='text-2xl font-bold mb-2'>Servicios</h1>

      {/* Crear servicio */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Crear servicio</h2>
        <form action={createServicio} className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <input
            name='nombre'
            placeholder='Nombre'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <input
            name='descripcion'
            placeholder='Descripción'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <input
            name='numeroCuenta'
            placeholder='Número de cuenta'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <select
            name='tipoPeriodo'
            defaultValue='Mensual'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value='Mensual'>Mensual</option>
            <option value='Anual'>Anual</option>
          </select>
          <input
            name='precio'
            type='number'
            step='0.01'
            placeholder='Precio'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <label className='flex items-center gap-2 text-sm'>
            <input type='checkbox' name='esAutomatico' className='h-4 w-4' />
            Automático
          </label>
          <div className='md:col-span-2'>
            <button
              type='submit'
              className='w-full md:w-auto px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition'
            >
              Guardar servicio
            </button>
          </div>
        </form>
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
                    ${s.Precio} ·{' '}
                    <span className={s.Estado ? 'text-green-600' : 'text-red-600'}>
                      {s.Estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                </div>
              </div>

              <details className='mt-2'>
                <summary className='cursor-pointer text-blue-600 text-sm'>Editar</summary>
                <form
                  action={updateServicio}
                  className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3'
                >
                  <input type='hidden' name='id' defaultValue={s.IdServicio} />
                  <input
                    name='nombre'
                    defaultValue={s.Nombre}
                    placeholder='Nombre'
                    className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
                  />
                  <input
                    name='descripcion'
                    defaultValue={s.Descripcion || ''}
                    placeholder='Descripción'
                    className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
                  />
                  <input
                    name='numeroCuenta'
                    defaultValue={s.NumeroCuenta || ''}
                    placeholder='Número de cuenta'
                    className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
                  />
                  <select
                    name='tipoPeriodo'
                    defaultValue={s.TipoPeriodo}
                    className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
                  >
                    <option value='Mensual'>Mensual</option>
                    <option value='Anual'>Anual</option>
                  </select>
                  <input
                    name='precio'
                    type='number'
                    step='0.01'
                    defaultValue={s.Precio}
                    className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
                  />
                  <label className='flex items-center gap-2 text-sm'>
                    <input
                      type='checkbox'
                      name='esAutomatico'
                      defaultChecked={!!s.EsAutomatico}
                      className='h-4 w-4'
                    />
                    Automático
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input
                      type='checkbox'
                      name='estado'
                      defaultChecked={!!s.Estado}
                      className='h-4 w-4'
                    />
                    Activo
                  </label>
                  <div className='md:col-span-2'>
                    <button
                      type='submit'
                      className='px-4 py-2 rounded bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition'
                    >
                      Actualizar
                    </button>
                  </div>
                </form>
              </details>
            </li>
          ))}
        </ul>
      </section>

      {/* Crear pago de servicio */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Crear pago de servicio</h2>
        <form action={createPago} className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
          <select
            name='idServicio'
            defaultValue=''
            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value=''>Selecciona servicio</option>
            {servicios.map((s) => (
              <option key={s.IdServicio} value={s.IdServicio}>
                {s.Nombre}
              </option>
            ))}
          </select>
          <input
            type='number'
            step='0.01'
            name='monto'
            placeholder='Monto'
            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />
          <input
            name='idCuentaBanco'
            placeholder='IdCuentaBanco'
            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />
          <input
            name='metodoPago'
            placeholder='Método pago'
            defaultValue='Transferencia'
            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />
          <input
            name='comentario'
            placeholder='Comentario'
            className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />
          <div className='md:col-span-2'>
            <button
              type='submit'
              className='w-full md:w-auto px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition'
            >
              Crear pago
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
