'use server'
import { getCurrentUser } from '@/lib/auth'
import { getConnection, sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPago(formData) {
    const user = await getCurrentUser()
    if (!user) return
    const idServicio = parseInt(formData.get('idServicio'), 10)
    const monto = parseFloat(formData.get('monto') || '0')
    const metodoPago = formData.get('metodoPago')
    const idCuentaBanco = parseInt(formData.get('idCuentaBanco'), 10)
    const comentario = formData.get('comentario') || null

    const pool = await getConnection()
    const servicio = await pool
        .request()
        .input('IdServicio', sql.Int, idServicio)
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .query(`
            SELECT IdServicio FROM Servicios
            WHERE IdServicio = @IdServicio AND IdUsuario = @IdUsuario
        `)
    if (servicio.recordset.length === 0) return

    await pool
        .request()
        .input('IdServicio', sql.Int, idServicio)
        .input('Monto', sql.Decimal(10, 2), monto)
        .input('MetodoPago', sql.VarChar(50), metodoPago)
        .input('IdCuentaBanco', sql.Int, idCuentaBanco)
        .input('Comentario', sql.VarChar(200), comentario)
        .query(`
            INSERT INTO Pagos (IdServicio, Monto, MetodoPago, IdCuentaBanco, FechaPago, Comentario)
            VALUES (@IdServicio, @Monto, @MetodoPago, @IdCuentaBanco, GETDATE(), @Comentario)
        `)

    revalidatePath('/servicios')
    redirect('/servicios')
}
