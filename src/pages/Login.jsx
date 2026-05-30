import { useState } from 'react'
import { authService } from '../services/auth.js'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@autoflux.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    setError('')

    try {
      const user = authService.login(email, password)
      onLogin(user)
    } catch (err) {
      setError(err.message)
    }
  }

  function loginAsAdmin() {
    try {
      const user = authService.loginAsAdmin()
      onLogin(user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="login-brand">
          <div className="brand-mark large">AF</div>
          <div>
            <h1>AutoFlux</h1>
            <p>Gestão completa para oficinas que avançam</p>
          </div>
        </div>

        <label>E-mail</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <div className="error-box">{error}</div>}

        <button className="primary-btn" type="submit">
          Entrar
        </button>

        <button className="secondary-btn" type="button" onClick={loginAsAdmin}>
          Entrar como admin de teste
        </button>

        <div className="warning-box">
          Login inicial para teste no GitHub Pages. Para uso real com empresa,
          vamos migrar para Firebase Auth ou Supabase Auth.
        </div>
      </form>
    </main>
  )
}
