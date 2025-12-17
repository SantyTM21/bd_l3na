'use server'
import { getCurrentUser } from '@/lib/auth'
import { getConnection, sql } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData) {
    const user = await getCurrentUser()
    if (!user) redirect('/login')

    const nombre = String(formData.get('nombre') || '').trim()
    const apellido = String(formData.get('apellido') || '').trim()
    const celularRaw = String(formData.get('celular') || '').trim()
    const celular = celularRaw.length ? celularRaw : null
    const fechaNacimiento = formData.get('fechaNacimiento') || null

    if (!nombre || !apellido) redirect('/profile?msg=Datos+incompletos')

    const pool = await getConnection()
    await pool
        .request()
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .input('Nombre', sql.VarChar(50), nombre)
        .input('Apellido', sql.VarChar(50), apellido)
        .input('Celular', sql.VarChar(15), celular)
        .input('FechaNacimiento', sql.Date, fechaNacimiento)
        .execute('dbo.sp_ActualizarPerfilUsuario')

    revalidatePath('/profile')
    redirect('/profile?msg=Perfil+actualizado')
}
