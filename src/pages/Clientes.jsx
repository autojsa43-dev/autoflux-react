import { useState } from 'react'

export default function Clientes() {
  const [clients, setClients] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('autoflux_react_clients_v1') || '[]')
    } catch {
      return []
    }
  })

  const [form, setForm] = useState({
    name: '',
    phone: '',
    vehicle: '',
    plate: '',
  })

  function save(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      alert('Informe o nome do cliente.')
      return
    }

    const next = [...clients, { id: crypto.randomUUID(), ...form }]
    setClients(next)
    localStorage.setItem('autoflux_react_clients_v1', JSON.stringify(next))

    setForm({ name: '', phone: '', vehicle: '', plate: '' })
  }

  return (
    <section>
      <div className="hero small">
        <div>
          <h1>Clientes</h1>
          <p>Cadastro local inicial para teste. Depois será migrado para banco online.</p>
        </div>
      </div>

      <div className="two-col">
        <form className="card" onSubmit={save}>
          <div className="card-title">
            <div>
              <h2>Novo cliente</h2>
              <p>Cadastre os dados principais.</p>
            </div>
          </div>

          <div className="form-grid">
            <input
              placeholder="Nome"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />

            <input
              placeholder="Telefone"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />

            <input
              placeholder="Veículo"
              value={form.vehicle}
              onChange={(event) => setForm({ ...form, vehicle: event.target.value })}
            />

            <input
              placeholder="Placa"
              value={form.plate}
              onChange={(event) => setForm({ ...form, plate: event.target.value })}
            />
          </div>

          <button className="primary-btn">Salvar cliente</button>
        </form>

        <div className="card">
          <div className="card-title">
            <div>
              <h2>Clientes salvos</h2>
              <p>{clients.length} cadastro(s)</p>
            </div>
          </div>

          <div className="result-list">
            {clients.map((client) => (
              <article className="result-card" key={client.id}>
                <div>
                  <strong>{client.name}</strong>
                  <p>
                    {client.phone || 'Sem telefone'}
                    <br />
                    {client.vehicle || 'Sem veículo'} • {client.plate || 'Sem placa'}
                  </p>
                </div>
              </article>
            ))}

            {clients.length === 0 && (
              <div className="empty-box">Nenhum cliente cadastrado.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
