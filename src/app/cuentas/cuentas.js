'use server'
import { getCurrentUser } from '@/lib/auth'
import { getConnection, sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function listCuentas() {
    const user = await getCurrentUser()
    if (!user) return []
    const pool = await getConnection()
    const result = await pool
        .request()
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .query(`
            SELECT IdCuentaBanco, NombreBanco, NumeroCuenta, TipoCuenta, Estado, Dueño, Saldo
            FROM CuentasBanco
            WHERE IdUsuario = @IdUsuario
        `)
    return result.recordset
}

export async function createCuenta(formData) {
    const user = await getCurrentUser()
    if (!user) return
    const nombreBanco = formData.get('nombreBanco')
    const numeroCuenta = formData.get('numeroCuenta')
    const tipoCuenta = formData.get('tipoCuenta')
    const dueno = formData.get('dueño') || null
    const pool = await getConnection()
    await pool
        .request()
        .input('NombreBanco', sql.VarChar(100), nombreBanco)
        .input('NumeroCuenta', sql.VarChar(30), numeroCuenta)
        .input('TipoCuenta', sql.VarChar(20), tipoCuenta)
        .input('Estado', sql.Bit, 1)
        .input('Dueño', sql.VarChar(100), dueno)
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .query(`
            INSERT INTO CuentasBanco (NombreBanco, NumeroCuenta, TipoCuenta, Estado, Dueño, IdUsuario)
            VALUES (@NombreBanco, @NumeroCuenta, @TipoCuenta, @Estado, @Dueño, @IdUsuario)
        `)

    revalidatePath('/cuentas')
    redirect('/cuentas')
}

export async function updateCuenta(formData) {
    const user = await getCurrentUser()
    if (!user) return
    const id = parseInt(formData.get('id'), 10)
    const nombreBanco = formData.get('nombreBanco')
    const numeroCuenta = formData.get('numeroCuenta')
    const tipoCuenta = formData.get('tipoCuenta')
    const dueno = formData.get('dueño') || null
    const estado = formData.get('estado') ? 1 : 0
    const pool = await getConnection()
    await pool
        .request()
        .input('IdCuentaBanco', sql.Int, id)
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .input('NombreBanco', sql.VarChar(100), nombreBanco)
        .input('NumeroCuenta', sql.VarChar(30), numeroCuenta)
        .input('TipoCuenta', sql.VarChar(20), tipoCuenta)
        .input('Dueño', sql.VarChar(100), dueno)
        .input('Estado', sql.Bit, estado)
        .query(`
            UPDATE CuentasBanco
            SET NombreBanco = @NombreBanco,
                NumeroCuenta = @NumeroCuenta,
                TipoCuenta = @TipoCuenta,
                Dueño = @Dueño,
                Estado = @Estado
            WHERE IdCuentaBanco = @IdCuentaBanco AND IdUsuario = @IdUsuario
        `)

    revalidatePath('/cuentas')
    redirect('/cuentas')
}
