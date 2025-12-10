'use server'
import { getCurrentUser } from '@/lib/auth'
import { getConnection, sql } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData) {
    const user = await getCurrentUser()
    if (!user) {
        redirect('/login')
    }

    const nombre = formData.get('nombre')
    const apellido = formData.get('apellido')
    const celular = formData.get('celular') || null
    const fechaNacimiento = formData.get('fechaNacimiento') || null

    const pool = await getConnection()
    await pool
        .request()
        .input('IdUsuario', sql.Int, user.IdUsuario)
        .input('Nombre', sql.VarChar(50), nombre)
        .input('Apellido', sql.VarChar(50), apellido)
        .input('Celular', sql.VarChar(15), celular)
        .input('FechaNacimiento', sql.Date, fechaNacimiento)
        .query(`
            UPDATE Usuarios
            SET Nombre = @Nombre,
                Apellido = @Apellido,
                Celular = @Celular,
                FechaNacimiento = @FechaNacimiento
            WHERE IdUsuario = @IdUsuario
        `)

    revalidatePath('/profile')
    redirect('/profile?msg=Perfil+actualizado')
}
