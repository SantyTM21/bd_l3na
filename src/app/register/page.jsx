import { register } from './register'

export default function RegisterPage() {
  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded shadow'>
      <h1 className='text-2xl font-bold mb-4'>Registro</h1>

      <form action={register} className='space-y-3'>
        <input
          name='cedula'
          placeholder='Cédula'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <input
          name='nombre'
          placeholder='Nombre'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <input
          name='apellido'
          placeholder='Apellido'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <input
          name='correo'
          placeholder='Correo'
          type='email'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <input
          name='password'
          type='password'
          placeholder='Contraseña'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <input
          name='fechaNacimiento'
          type='date'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-500'
        />
        <button
          type='submit'
          className='w-full py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition'
        >
          Registrarse
        </button>
      </form>
    </div>
  )
}
