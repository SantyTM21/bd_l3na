'use server'
import { getCurrentUser } from '@/lib/auth'
import { getConnection, sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createPago(formData) {
    const user = await getCurrentUser()
    if (!user) return { ok: false, message: 'No autenticado' }

    const idServicio = parseInt(formData.get('idServicio'), 10)
    const monto = Number(formData.get('monto') || 0)
    const comentario = String(formData.get('comentario') || '').trim() || null
    const tipoPago = String(formData.get('tipoPago') || 'EFECTIVO') // EFECTIVO|CUENTA
    const idCuentaBanco = tipoPago === 'CUENTA' ? parseInt(formData.get('idCuentaBanco'), 10) : null

    if (!idServicio || !(monto > 0)) return { ok: false, message: 'Datos inválidos' }
    if (tipoPago === 'CUENTA' && !idCuentaBanco) return { ok: false, message: 'Selecciona una cuenta' }

    const pool = await getConnection()

    // validar servicio activo y del usuario + obtener nombre (para destinatario)
    const srvRes = await pool.request()
        .input('IdServicio', sql.Int, idServicio)
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .query(`
      SELECT TOP 1 IdServicio, Nombre, Estado
      FROM Servicios
      WHERE IdServicio=@IdServicio AND IdUsuario=@IdUsuario
    `)

    const srv = srvRes.recordset?.[0]
    if (!srv) return { ok: false, message: 'Servicio no válido' }
    if (!srv.Estado) return { ok: false, message: 'Solo puedes pagar servicios activos' }

    // si es con cuenta: validar cuenta activa + saldo
    let cuenta = null
    if (tipoPago === 'CUENTA') {
        const cRes = await pool.request()
            .input('IdCuentaBanco', sql.Int, idCuentaBanco)
            .input('IdUsuario', sql.Int, user.IdUsuario)
            .query(`
        SELECT TOP 1 IdCuentaBanco, Estado, Saldo
        FROM CuentasBanco
        WHERE IdCuentaBanco=@IdCuentaBanco AND IdUsuario=@IdUsuario
      `)

        cuenta = cRes.recordset?.[0]
        if (!cuenta) return { ok: false, message: 'Cuenta no válida' }
        if (!cuenta.Estado) return { ok: false, message: 'Cuenta inactiva' }
        if (Number(cuenta.Saldo) < monto) {
            return { ok: false, message: `Saldo insuficiente. Saldo actual: ${cuenta.Saldo}` }
        }
    }

    // Transacción: Pago + (Transferencia si aplica)
    const tx = new sql.Transaction(pool)
    try {
        await tx.begin()

        // Pago
        await new sql.Request(tx)
            .input('IdServicio', sql.Int, idServicio)
            .input('Monto', sql.Decimal(10, 2), monto)
            .input('MetodoPago', sql.VarChar(50), tipoPago === 'EFECTIVO' ? 'Efectivo' : 'Cuenta')
            .input('Comentario', sql.VarChar(200), comentario)
            .input('IdCuentaBanco', sql.Int, idCuentaBanco) // null si efectivo
            .query(`
        INSERT INTO Pagos (IdServicio, Monto, MetodoPago, FechaPago, Comentario, IdCuentaBanco)
        VALUES (@IdServicio, @Monto, @MetodoPago, GETDATE(), @Comentario, @IdCuentaBanco)
      `)

        // Transferencia automática (egreso) si paga con cuenta
        if (tipoPago === 'CUENTA') {
            await new sql.Request(tx)
                .input('IdCuentaBanco', sql.Int, idCuentaBanco)
                .input('TipoTransferencia', sql.VarChar(10), 'Egreso')
                .input('Monto', sql.Decimal(10, 2), monto)
                .input('Destinatario', sql.VarChar(100), srv.Nombre)
                .input('Comentario', sql.VarChar(200), comentario)
                .query(`
          INSERT INTO Transferencias (IdCuentaBanco, TipoTransferencia, Monto, Destinatario, Comentario, Fecha)
          VALUES (@IdCuentaBanco, @TipoTransferencia, @Monto, @Destinatario, @Comentario, GETDATE())
        `)
            // Si tienes trigger trg_ActualizarSaldoTransferencia, aquí ya descuenta solo.
        }

        await tx.commit()
        revalidatePath('/servicios')
        revalidatePath('/cuentas')
        return { ok: true, message: 'Pago registrado' }
    } catch (e) {
        try { await tx.rollback() } catch { }
        return { ok: false, message: 'No se pudo registrar el pago' }
    }
}

export async function listPagos() {
    const user = await getCurrentUser()
    if (!user) return []

    const pool = await getConnection()
    const result = await pool.request()
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .query(`
      SELECT p.IdPago, p.IdServicio, p.Monto, p.FechaPago, p.MetodoPago, p.Comentario
      FROM Pagos p
      JOIN Servicios s ON s.IdServicio = p.IdServicio
      WHERE s.IdUsuario = @IdUsuario
      ORDER BY p.FechaPago DESC
    `)
    return result.recordset
}
