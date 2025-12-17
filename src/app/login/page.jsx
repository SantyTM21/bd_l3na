// src/app/login/page.jsx
import LoginForm from './login-form'

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams
  const error = typeof sp?.get === 'function' ? sp.get('error') : sp?.error

  return <LoginForm error={error} />
}
