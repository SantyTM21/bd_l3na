'use server'

import { getConnection, sql } from '@/lib/db'
import { setUserCookie, clearUserCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function login(formData) {
    const correo = formData.get('correo')
    const password = formData.get('password')

    const pool = await getConnection()
    const result = await pool
        .request()
        .input('Correo', sql.VarChar(100), correo)
        .input('Password', sql.VarChar(200), password)
        .query(`
            SELECT IdUsuario, Nombre, Apellido, Correo
            FROM Usuarios
            WHERE Correo = @Correo AND Password = @Password AND Estado = 1
        `)

    const user = result.recordset[0]
    if (!user) {
        redirect('/login?error=Credenciales+invalidas')
    }
    await setUserCookie(user.IdUsuario)
    redirect('/profile')
}

export async function logout() {
    await clearUserCookie()
    redirect('/login')
}
