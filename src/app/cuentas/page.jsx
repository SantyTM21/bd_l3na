import { getCurrentUser } from '@/lib/auth'
import { listCuentas } from './cuentas'
import { listTransferencias } from './transferencias'
import { redirect } from 'next/navigation'
import CreateAccountForm from './create-account-form'
import EditAccountForm from './edit-account-form'
import CreateTransferForm from './create-transfer-form'

export default async function CuentasPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const cuentas = await listCuentas()
  const transferencias = await listTransferencias()
  const transfersByCuenta = transferencias.reduce((acc, t) => {
    const id = t.IdCuentaBanco
    if (!acc[id]) acc[id] = []
    acc[id].push(t)
    return acc
  }, {})

  return (
    <div className='max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow space-y-8'>
      <h1 className='text-2xl font-bold mb-2'>Cuentas bancarias</h1>

      {/* Crear cuenta */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Crear cuenta</h2>
        <CreateAccountForm />
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
                <EditAccountForm cuenta={c} />
              </details>

              <details className='mt-3'>
                <summary className='cursor-pointer text-blue-600 text-sm'>
                  Transferencias recientes
                </summary>

                <div className='mt-2'>
                  <ul className='space-y-1 text-xs'>
                    {(transfersByCuenta[c.IdCuentaBanco] || []).slice(0, 5).map((t) => (
                      <li
                        key={`${t.IdTransferencia ?? ''}-${t.Fecha}-${t.Monto}`}
                        className='flex justify-between'
                      >
                        <span>
                          {new Date(t.Fecha).toLocaleDateString()} · {t.TipoTransferencia} ·{' '}
                          {t.Destinatario}
                        </span>
                        <span
                          className={
                            t.TipoTransferencia === 'Ingreso' ? 'text-green-700' : 'text-red-700'
                          }
                        >
                          {t.TipoTransferencia === 'Ingreso' ? '+' : '-'}
                          {t.Monto}
                        </span>
                      </li>
                    ))}

                    {(!transfersByCuenta[c.IdCuentaBanco] ||
                      transfersByCuenta[c.IdCuentaBanco].length === 0) && (
                      <li className='text-gray-500'>Sin transferencias</li>
                    )}
                  </ul>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </section>

      {/* Crear transferencia */}
      <section>
        <h2 className='text-xl font-semibold mb-3'>Crear transferencia</h2>
        <CreateTransferForm cuentas={cuentas} />
      </section>
    </div>
  )
}
