import 'server-only'
import { cookies } from 'next/headers'
import { getConnection, sql } from './db'

const COOKIE_NAME = 'servigo_user'

export async function setUserCookie(userId) {
    const jar = await cookies()
    jar.set(COOKIE_NAME, String(userId), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 4,
    })
}

export async function clearUserCookie() {
    const jar = await cookies()
    jar.delete(COOKIE_NAME)
}

export async function getCurrentUser() {
    const jar = await cookies()
    const cookie = jar.get(COOKIE_NAME)
    const userId = cookie ? cookie.value : undefined
    if (!userId) return null

    const pool = await getConnection()
    const result = await pool
        .request()
        .input('IdUsuario', sql.Int, parseInt(userId, 10))
        .query(
            'SELECT IdUsuario, Cedula, Nombre, Apellido, Correo, Estado, FechaNacimiento, Celular FROM Usuarios WHERE IdUsuario = @IdUsuario'
        )
    return result.recordset[0] || null
}
