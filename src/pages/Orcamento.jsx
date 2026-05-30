import { useMemo, useState } from 'react'
import CatalogoBusca from './CatalogoBusca.jsx'

export default function Orcamento() {
  const [client, setClient] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [plate, setPlate] = useState('')
  const [items, setItems] = useState([])
  const [notes, setNotes] = useState('')

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.qty || 1) * Number(item.price || 0)
    }, 0)
  }, [items])

  function addItem(item) {
    setItems((current) => [
      ...current,
      {
        ...item,
        budgetId: crypto.randomUUID(),
        qty: 1,
      },
    ])
  }

  function updateQty(id, qty) {
    setItems((current) =>
      current.map((item) =>
        item.budgetId === id ? { ...item, qty: Number(qty || 1) } : item,
      ),
    )
  }

  function updatePrice(id, price) {
    setItems((current) =>
      current.map((item) =>
        item.budgetId === id ? { ...item, price: Number(price || 0) } : item,
      ),
    )
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.budgetId !== id))
  }

  function printBudget() {
    window.print()
  }

  return (
    <section>
      <div className="hero small no-print">
        <div>
          <h1>Orçamento</h1>
          <p>
            Monte o orçamento, adicione peças ou serviços e ajuste quantidade e
            valor unitário.
          </p>
        </div>

        <button className="hero-btn" onClick={printBudget}>
          Imprimir / PDF
        </button>
      </div>

      <div className="budget-layout">
        <div className="budget-form no-print">
          <div className="card">
            <div className="card-title">
              <div>
                <h2>Dados do cliente</h2>
                <p>Preencha as informações principais do atendimento.</p>
              </div>
            </div>

            <div className="form-grid">
              <input
                placeholder="Cliente"
                value={client}
                onChange={(event) => setClient(event.target.value)}
              />

              <input
                placeholder="Telefone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />

              <input
                placeholder="Veículo"
                value={vehicle}
                onChange={(event) => setVehicle(event.target.value)}
              />

              <input
                placeholder="Placa"
                value={plate}
                onChange={(event) => setPlate(event.target.value)}
              />
            </div>

            <textarea
              placeholder="Observações do orçamento"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <CatalogoBusca onSelect={addItem} />
        </div>

        <div className="budget-preview" id="budget-preview">
          <div className="budget-paper">
            <header className="budget-head">
              <div>
                <strong>AutoFlux</strong>
                <p>Gestão completa para oficinas que avançam</p>
              </div>

              <div>
                <h2>ORÇAMENTO</h2>
                <p>Nº {new Date().getFullYear()}-0001</p>
              </div>
            </header>

            <section className="budget-section">
              <h3>Cliente e veículo</h3>

              <div className="budget-info-grid">
                <p>
                  <strong>Cliente:</strong> {client || '---'}
                </p>

                <p>
                  <strong>Telefone:</strong> {phone || '---'}
                </p>

                <p>
                  <strong>Veículo:</strong> {vehicle || '---'}
                </p>

                <p>
                  <strong>Placa:</strong> {plate || '---'}
                </p>
              </div>
            </section>

            <section className="budget-section">
              <h3>Itens</h3>

              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>Qtd.</th>
                    <th>Unit.</th>
                    <th>Total</th>
                    <th className="no-print">Ação</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.budgetId}>
                      <td>{item.sku || item.code || '---'}</td>
                      <td>{item.name}</td>

                      <td>
                        <input
                          className="qty-input no-print"
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(event) =>
                            updateQty(item.budgetId, event.target.value)
                          }
                        />

                        <span className="print-only">{item.qty}</span>
                      </td>

                      <td>
                        <input
                          className="money-input no-print"
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(event) =>
                            updatePrice(item.budgetId, event.target.value)
                          }
                        />

                        <span className="print-only">
                          {formatMoney(item.price)}
                        </span>
                      </td>

                      <td>
                        {formatMoney(
                          Number(item.qty || 1) * Number(item.price || 0),
                        )}
                      </td>

                      <td className="no-print">
                        <button
                          className="danger-btn compact"
                          onClick={() => removeItem(item.budgetId)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {items.length === 0 && (
                <div className="empty-box">Nenhum item adicionado.</div>
              )}
            </section>

            <section className="budget-section">
              <h3>Observações</h3>
              <p className="notes-box">{notes || '---'}</p>
            </section>

            <section className="budget-total">
              <span>Total geral</span>
              <strong>{formatMoney(total)}</strong>
            </section>

            <footer className="budget-sign">
              <div>Responsável</div>
              <div>Autorização cliente</div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  )
}

function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))
}
