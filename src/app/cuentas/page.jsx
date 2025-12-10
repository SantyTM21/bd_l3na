import { getCurrentUser } from '@/lib/auth'
import { listCuentas, createCuenta, updateCuenta } from './cuentas'
import { createTransferencia } from './transferencias'
import { redirect } from 'next/navigation'

export default async function CuentasPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const cuentas = await listCuentas()

  return (
    <div className='max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow space-y-8'>
      <h1 className='text-2xl font-bold mb-2'>Cuentas bancarias</h1>

      {/* Crear cuenta */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Crear cuenta</h2>
        <form action={createCuenta} className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <input
            name='nombreBanco'
            placeholder='Banco'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <input
            name='numeroCuenta'
            placeholder='Número de cuenta'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <select
            name='tipoCuenta'
            defaultValue='Ahorros'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value='Ahorros'>Ahorros</option>
            <option value='Corriente'>Corriente</option>
          </select>
          <input
            name='dueño'
            placeholder='Dueño'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <div className='md:col-span-2'>
            <button
              type='submit'
              className='w-full md:w-auto px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition'
            >
              Guardar cuenta
            </button>
          </div>
        </form>
      </section>

      {/* Mis cuentas */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Mis cuentas</h2>
        <ul className='space-y-3'>
          {cuentas.map((c) => (
            <li
              key={c.IdCuentaBanco}
              className='border border-gray-200 rounded px-4 py-3 text-sm bg-gray-50'
            >
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                <div>
                  <p className='font-semibold'>
                    {c.NombreBanco} - {c.NumeroCuenta}
                  </p>
                  <p className='text-gray-700'>
                    Saldo: <span className='font-mono'>{c.Saldo}</span>
                  </p>
                </div>
              </div>

              <details className='mt-2'>
                <summary className='cursor-pointer text-blue-600 text-sm'>Editar</summary>
                <form action={updateCuenta} className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <input type='hidden' name='id' defaultValue={c.IdCuentaBanco} />
                  <input
                    name='nombreBanco'
                    defaultValue={c.NombreBanco}
                    placeholder='Banco'
                    className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
                  />
                  <input
                    name='numeroCuenta'
                    defaultValue={c.NumeroCuenta}
                    placeholder='Número de cuenta'
                    className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
                  />
                  <select
                    name='tipoCuenta'
                    defaultValue={c.TipoCuenta}
                    className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
                  >
                    <option value='Ahorros'>Ahorros</option>
                    <option value='Corriente'>Corriente</option>
                  </select>
                  <input
                    name='dueño'
                    defaultValue={c.Dueño || ''}
                    placeholder='Dueño'
                    className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
                  />
                  <label className='flex items-center gap-2 text-sm'>
                    <input
                      type='checkbox'
                      name='estado'
                      defaultChecked={!!c.Estado}
                      className='h-4 w-4'
                    />
                    Activa
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

      {/* Crear transferencia */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Crear transferencia</h2>
        <form action={createTransferencia} className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <select
            name='idCuentaBanco'
            defaultValue=''
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value=''>Selecciona cuenta</option>
            {cuentas.map((c) => (
              <option key={c.IdCuentaBanco} value={c.IdCuentaBanco}>
                {c.NombreBanco} - {c.NumeroCuenta}
              </option>
            ))}
          </select>
          <select
            name='tipoTransferencia'
            defaultValue='Ingreso'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value='Ingreso'>Ingreso</option>
            <option value='Egreso'>Egreso</option>
          </select>
          <input
            type='number'
            step='0.01'
            name='monto'
            placeholder='Monto'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <input
            name='destinatario'
            placeholder='Destinatario'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <input
            name='comentario'
            placeholder='Comentario'
            className='border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
          />
          <div className='md:col-span-2'>
            <button
              type='submit'
              className='w-full md:w-auto px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition'
            >
              Crear transferencia
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
