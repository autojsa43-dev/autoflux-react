import { useState } from 'react'
import { authService } from '../services/auth.js'

export default function Configuracoes() {
  const [users, setUsers] = useState(() => authService.users())
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'atendente',
  })

  function addUser(event) {
    event.preventDefault()

    try {
      authService.addUser(form)
      setUsers(authService.users())
      setForm({ name: '', email: '', password: '', role: 'atendente' })
    } catch (error) {
      alert(error.message)
    }
  }

  function removeUser(id) {
    try {
      authService.removeUser(id)
      setUsers(authService.users())
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <section>
      <div className="hero small">
        <div>
          <h1>Configurações</h1>
          <p>Usuários locais para teste. Depois vamos migrar para autenticação real.</p>
        </div>
      </div>

      <div className="two-col">
        <form className="card" onSubmit={addUser}>
          <div className="card-title">
            <div>
              <h2>Novo usuário</h2>
              <p>Controle inicial de perfis.</p>
            </div>
          </div>

          <div className="form-grid">
            <input
              placeholder="Nome"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />

            <input
              placeholder="E-mail"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />

            <input
              placeholder="Senha"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />

            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              <option value="admin">Administrador</option>
              <option value="atendente">Atendente</option>
              <option value="mecanico">Mecânico</option>
              <option value="financeiro">Financeiro</option>
            </select>
          </div>

          <button className="primary-btn">Adicionar usuário</button>
        </form>

        <div className="card">
          <div className="card-title">
            <div>
              <h2>Usuários</h2>
              <p>{users.length} usuário(s)</p>
            </div>
          </div>

          <div className="result-list">
            {users.map((user) => (
              <article className="result-card" key={user.id}>
                <div>
                  <strong>{user.name}</strong>
                  <p>
                    {user.email}
                    <br />
                    Perfil: {user.role}
                  </p>
                </div>

                <button
                  className="danger-btn compact"
                  onClick={() => removeUser(user.id)}
                >
                  Remover
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
