'use server'

import { getConnection, sql } from '@/lib/db'
import { setUserCookie, clearUserCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function login(formData) {
    const correo = String(formData.get('correo') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')

    if (!correo || !password) redirect('/login?error=Datos+incompletos')

    const pool = await getConnection()
    const result = await pool
        .request()
        .input('Correo', sql.VarChar(100), correo)
        .execute('dbo.sp_LoginGetUser')

    const user = result.recordset?.[0]
    if (!user || !user.Estado) redirect('/login?error=Credenciales+invalidas')

    const ok = await bcrypt.compare(password, user.PasswordHash)
    if (!ok) redirect('/login?error=Credenciales+invalidas')


    await setUserCookie(user.IdUsuario)
    redirect('/profile')
}

export async function logout() {
    await clearUserCookie()
    redirect('/login')
}
