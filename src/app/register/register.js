'use server'

import { getConnection, sql } from '@/lib/db'
import { setUserCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function register(formData) {
    const cedula = String(formData.get('cedula') || '').trim()
    const nombre = String(formData.get('nombre') || '').trim()
    const apellido = String(formData.get('apellido') || '').trim()
    const correo = String(formData.get('correo') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')
    const fechaNacimiento = formData.get('fechaNacimiento') || null

    if (!cedula || !nombre || !apellido || !correo || !password) {
        throw new Error('Faltan campos obligatorios')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    try {
        const pool = await getConnection()
        const result = await pool
            .request()
            .input('Cedula', sql.VarChar(10), cedula)
            .input('Nombre', sql.VarChar(50), nombre)
            .input('Apellido', sql.VarChar(50), apellido)
            .input('Correo', sql.VarChar(100), correo)
            .input('PasswordHash', sql.VarChar(200), passwordHash)
            .input('FechaNacimiento', sql.Date, fechaNacimiento)
            .execute('dbo.sp_RegistrarUsuario')


        const userId = result.recordset[0].IdUsuario
        await setUserCookie(userId)
        redirect('/profile')
    } catch (e) {
        // Unique constraints (Cedula/Correo)
        if (String(e?.message || '').includes('UNIQUE')) {
            throw new Error('Ya existe un usuario con esa cédula o correo')
        }
        throw e
    }
}
