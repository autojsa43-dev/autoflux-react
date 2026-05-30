import { useState } from 'react'

const checklist = [
  'Faróis',
  'Lanternas',
  'Pneus',
  'Freios',
  'Suspensão',
  'Motor',
  'Óleo',
  'Água/Radiador',
  'Bateria',
  'Lataria',
  'Interior',
]

export default function Vistoria() {
  const [items, setItems] = useState(() =>
    Object.fromEntries(checklist.map((item) => [item, 'N/A'])),
  )

  function setStatus(item, status) {
    setItems((current) => ({ ...current, [item]: status }))
  }

  return (
    <section>
      <div className="hero small">
        <div>
          <h1>Vistoria</h1>
          <p>
            Checklist inicial em React. Depois entra assinatura, fotos e
            histórico no banco.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="checklist-grid">
          {checklist.map((item) => (
            <article className="check-card" key={item}>
              <strong>{item}</strong>

              <div className="status-row">
                {['OK', 'Atenção', 'Problema', 'N/A'].map((status) => (
                  <button
                    key={status}
                    className={items[item] === status ? 'selected' : ''}
                    onClick={() => setStatus(item, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
