'use server'
import { getCurrentUser } from '@/lib/auth'
import { getConnection, sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createTransferencia(formData) {
    const user = await getCurrentUser()
    if (!user) return { ok: false, message: 'No autenticado' }

    const idCuentaBanco = parseInt(formData.get('idCuentaBanco'), 10)
    const tipoTransferencia = String(formData.get('tipoTransferencia') || '')
    const monto = Number(formData.get('monto') || 0)
    const destinatario = String(formData.get('destinatario') || '').trim()
    const comentario = String(formData.get('comentario') || '').trim() || null

    if (!idCuentaBanco || !destinatario || !(monto > 0)) {
        return { ok: false, message: 'Datos inválidos' }
    }

    const pool = await getConnection()

    // validar cuenta: del usuario + activa + saldo
    const cuentaRes = await pool.request()
        .input('IdCuentaBanco', sql.Int, idCuentaBanco)
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .query(`
      SELECT IdCuentaBanco, Estado, Saldo
      FROM CuentasBanco
      WHERE IdCuentaBanco = @IdCuentaBanco AND IdUsuario = @IdUsuario
    `)

    const cuenta = cuentaRes.recordset?.[0]
    if (!cuenta) return { ok: false, message: 'Cuenta no válida' }
    if (!cuenta.Estado) return { ok: false, message: 'Cuenta inactiva' }

    if (tipoTransferencia === 'Egreso' && Number(cuenta.Saldo) < monto) {
        return { ok: false, message: `Saldo insuficiente. Saldo actual: ${cuenta.Saldo}` }
    }

    try {
        await pool.request()
            .input('IdCuentaBanco', sql.Int, idCuentaBanco)
            .input('TipoTransferencia', sql.VarChar(10), tipoTransferencia)
            .input('Monto', sql.Decimal(10, 2), monto)
            .input('Destinatario', sql.VarChar(100), destinatario)
            .input('Comentario', sql.VarChar(200), comentario)
            .query(`
        INSERT INTO Transferencias (IdCuentaBanco, TipoTransferencia, Monto, Destinatario, Comentario, Fecha)
        VALUES (@IdCuentaBanco, @TipoTransferencia, @Monto, @Destinatario, @Comentario, GETDATE())
      `)

        // IMPORTANTE: si tienes trigger que actualiza saldo, NO lo actualices aquí.
        revalidatePath('/cuentas')
        return { ok: true, message: 'Transferencia creada' }
    } catch (e) {
        const msg = String(e?.message || '')
        if (msg.includes('saldo') || msg.includes('negativo') || msg.includes('trigger')) {
            return { ok: false, message: 'Saldo insuficiente' }
        }
        return { ok: false, message: 'No se pudo crear la transferencia' }
    }
}



export async function listTransferencias() {
    const user = await getCurrentUser()
    if (!user) return []
    const pool = await getConnection()
    const result = await pool
        .request()
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .query(`
            SELECT t.IdTransferencia, t.IdCuentaBanco, t.TipoTransferencia, t.Monto, t.Destinatario, t.Comentario, t.Fecha
            FROM Transferencias t
            INNER JOIN CuentasBanco c ON c.IdCuentaBanco = t.IdCuentaBanco
            WHERE c.IdUsuario = @IdUsuario
            ORDER BY t.Fecha DESC
        `)
    return result.recordset
}
