'use server'
import { getCurrentUser } from '@/lib/auth'
import { getConnection, sql } from '@/lib/db'

export async function createTransferencia(formData) {
    const user = await getCurrentUser()
    if (!user) return
    const idCuentaBanco = parseInt(formData.get('idCuentaBanco'), 10)
    const tipoTransferencia = formData.get('tipoTransferencia')
    const monto = parseFloat(formData.get('monto') || '0')
    const destinatario = formData.get('destinatario')
    const comentario = formData.get('comentario') || null

    const pool = await getConnection()
    const cuenta = await pool
        .request()
        .input('IdCuentaBanco', sql.Int, idCuentaBanco)
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .query(`
            SELECT IdCuentaBanco FROM CuentasBanco
            WHERE IdCuentaBanco = @IdCuentaBanco AND IdUsuario = @IdUsuario
        `)
    if (cuenta.recordset.length === 0) return

    await pool
        .request()
        .input('IdCuentaBanco', sql.Int, idCuentaBanco)
        .input('TipoTransferencia', sql.VarChar(10), tipoTransferencia)
        .input('Monto', sql.Decimal(10, 2), monto)
        .input('Destinatario', sql.VarChar(100), destinatario)
        .input('Comentario', sql.VarChar(200), comentario)
        .query(`
            INSERT INTO Transferencias (IdCuentaBanco, TipoTransferencia, Monto, Destinatario, Comentario, Fecha)
            VALUES (@IdCuentaBanco, @TipoTransferencia, @Monto, @Destinatario, @Comentario, GETDATE())
        `)
}
