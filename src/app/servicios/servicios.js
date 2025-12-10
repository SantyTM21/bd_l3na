'use server'
import { getCurrentUser } from '@/lib/auth'
import { getConnection, sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function listServicios() {
    const user = await getCurrentUser()
    if (!user) return []
    
    const pool = await getConnection()
    const result = await pool
        .request()
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .query(`
            SELECT IdServicio, Nombre, Descripcion, NumeroCuenta, TipoPeriodo, Estado, Precio, EsAutomatico
            FROM Servicios
            WHERE IdUsuario = @IdUsuario
        `)
    return result.recordset
}

export async function createServicio(formData) {
    const user = await getCurrentUser()
    if (!user) return
    const nombre = formData.get('nombre')
    const descripcion = formData.get('descripcion') || null
    const numeroCuenta = formData.get('numeroCuenta') || null
    const tipoPeriodo = formData.get('tipoPeriodo')
    const precio = parseFloat(formData.get('precio') || '0')
    const esAutomatico = formData.get('esAutomatico') ? 1 : 0
    const pool = await getConnection()
    await pool
        .request()
        .input('Nombre', sql.VarChar(100), nombre)
        .input('Descripcion', sql.VarChar(200), descripcion)
        .input('NumeroCuenta', sql.VarChar(30), numeroCuenta)
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .input('TipoPeriodo', sql.VarChar(10), tipoPeriodo)
        .input('Estado', sql.Bit, 1)
        .input('Precio', sql.Decimal(10, 2), precio)
        .input('EsAutomatico', sql.Bit, esAutomatico)
        .query(`
            INSERT INTO Servicios (Nombre, Descripcion, NumeroCuenta, IdUsuario, TipoPeriodo, Estado, Precio, EsAutomatico)
            VALUES (@Nombre, @Descripcion, @NumeroCuenta, @IdUsuario, @TipoPeriodo, @Estado, @Precio, @EsAutomatico)
        `)

    revalidatePath('/servicios')
    redirect('/servicios')
}

export async function updateServicio(formData) {
    const user = await getCurrentUser()
    if (!user) return
    const id = parseInt(formData.get('id'), 10)
    const nombre = formData.get('nombre')
    const descripcion = formData.get('descripcion') || null
    const numeroCuenta = formData.get('numeroCuenta') || null
    const tipoPeriodo = formData.get('tipoPeriodo')
    const precio = parseFloat(formData.get('precio') || '0')
    const esAutomatico = formData.get('esAutomatico') ? 1 : 0
    const estado = formData.get('estado') ? 1 : 0
    const pool = await getConnection()
    await pool
        .request()
        .input('IdServicio', sql.Int, id)
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .input('Nombre', sql.VarChar(100), nombre)
        .input('Descripcion', sql.VarChar(200), descripcion)
        .input('NumeroCuenta', sql.VarChar(30), numeroCuenta)
        .input('TipoPeriodo', sql.VarChar(10), tipoPeriodo)
        .input('Estado', sql.Bit, estado)
        .input('Precio', sql.Decimal(10, 2), precio)
        .input('EsAutomatico', sql.Bit, esAutomatico)
        .query(`
            UPDATE Servicios
            SET Nombre = @Nombre,
                Descripcion = @Descripcion,
                NumeroCuenta = @NumeroCuenta,
                TipoPeriodo = @TipoPeriodo,
                Estado = @Estado,
                Precio = @Precio,
                EsAutomatico = @EsAutomatico
            WHERE IdServicio = @IdServicio AND IdUsuario = @IdUsuario
        `)

    revalidatePath('/servicios')
    redirect('/servicios')
}
