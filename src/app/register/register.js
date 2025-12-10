'use server'
import { getConnection, sql } from '@/lib/db'
import { setUserCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function register(formData) {
    const cedula = formData.get('cedula')
    const nombre = formData.get('nombre')
    const apellido = formData.get('apellido')
    const correo = formData.get('correo')
    const password = formData.get('password')
    const fechaNacimiento = formData.get('fechaNacimiento') || null

    const pool = await getConnection()
    const result = await pool
        .request()
        .input('Cedula', sql.VarChar(10), cedula)
        .input('Nombre', sql.VarChar(50), nombre)
        .input('Apellido', sql.VarChar(50), apellido)
        .input('Correo', sql.VarChar(100), correo)
        .input('Password', sql.VarChar(200), password)
        .input('FechaNacimiento', sql.Date, fechaNacimiento)
        .input('Estado', sql.Bit, 1)
        .input('IdRol', sql.Int, 2)
        .query(`
            INSERT INTO Usuarios (Cedula, Nombre, Apellido, Correo, Password, FechaNacimiento, Estado, IdRol)
            OUTPUT INSERTED.IdUsuario
            VALUES (@Cedula, @Nombre, @Apellido, @Correo, @Password, @FechaNacimiento, @Estado, @IdRol)
        `)

    const userId = result.recordset[0].IdUsuario
    await setUserCookie(userId)
    redirect('/profile')
}
