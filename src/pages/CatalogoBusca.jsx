import { useEffect, useState } from 'react'
import { catalogService } from '../services/catalogApi.js'

export default function CatalogoBusca({ onSelect, mode = 'standalone' }) {
  const [settings, setSettings] = useState(() => catalogService.getSettings())
  const [term, setTerm] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [year, setYear] = useState('')
  const [stock, setStock] = useState('')
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const [status, setStatus] = useState('Digite algo para buscar ou use os exemplos locais.')
  const [loading, setLoading] = useState(false)

  const limit = Number(settings.limit || 50)

  useEffect(() => {
    const timeout = setTimeout(() => {
      search(false)
    }, 350)

    return () => clearTimeout(timeout)
  }, [term, vehicle, year, stock, settings.mode, settings.limit])

  function updateSettings(next) {
    const saved = catalogService.saveSettings(next)
    setSettings(saved)
    setOffset(0)
  }

  async function search(append) {
    setLoading(true)

    const nextOffset = append ? offset : 0

    const result = await catalogService.search({
      term,
      vehicle,
      year,
      stock,
      limit,
      offset: nextOffset,
    })

    setItems((current) => append ? [...current, ...result.items] : result.items)
    setTotal(result.total)
    setOffset(nextOffset + result.items.length)

    const sourceLabel = {
      api: 'Banco/API',
      local: 'Teste local',
      'local-fallback': 'Teste local após falha da API',
    }[result.source] || result.source

    setStatus(
      result.error
        ? `${sourceLabel}: ${result.error}`
        : `${sourceLabel}: exibindo ${append ? nextOffset + result.items.length : result.items.length} de ${result.total} resultado(s).`,
    )

    setLoading(false)
  }

  function loadMore() {
    search(true)
  }

  function select(item) {
    if (onSelect) {
      onSelect(item)
      return
    }

    alert(`${item.name}\n${item.sku || item.code}\n${formatMoney(item.price)}`)
  }

  return (
    <section>
      {mode === 'standalone' && (
        <div className="hero small">
          <div>
            <h1>Catálogo e busca</h1>
            <p>Busca preparada para trabalhar por API, sem carregar milhões de itens no navegador.</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">
          <div>
            <h2>Busca inteligente</h2>
            <p>Pesquise por peça, serviço, código, SKU, veículo, ano ou motor.</p>
          </div>
        </div>

        <div className="search-grid">
          <input
            placeholder="Ex: Onix filtro, FOL0055, 5W30..."
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />

          <input
            placeholder="Veículo/modelo"
            value={vehicle}
            onChange={(event) => setVehicle(event.target.value)}
          />

          <input
            placeholder="Ano"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />

          <select value={stock} onChange={(event) => setStock(event.target.value)}>
            <option value="">Todos</option>
            <option value="disponivel">Com estoque</option>
            <option value="baixo">Estoque baixo</option>
          </select>
        </div>

        <div className="api-box">
          <div className="search-grid api">
            <select
              value={settings.mode}
              onChange={(event) => updateSettings({ mode: event.target.value })}
            >
              <option value="local">Teste local</option>
              <option value="api">Banco/API</option>
            </select>

            <input
              placeholder="http://localhost:3000/api/catalog/search"
              value={settings.endpoint}
              onChange={(event) => updateSettings({ endpoint: event.target.value })}
            />

            <select
              value={settings.limit}
              onChange={(event) => updateSettings({ limit: Number(event.target.value) })}
            >
              <option value="20">20 por busca</option>
              <option value="50">50 por busca</option>
              <option value="100">100 por busca</option>
            </select>
          </div>

          <small>{status}</small>
        </div>

        {loading && <div className="loading-box">Buscando catálogo...</div>}

        <div className="result-list">
          {items.map((item) => (
            <article className="result-card" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>
                  {item.sku || item.code || 'Sem código'} • {item.application || item.vehicle || 'Aplicação não informada'}
                  <br />
                  {item.yearStart}-{item.yearEnd} • {item.engine || 'Motor não informado'} • {item.system || item.category}
                </p>

                <div className="tag-row">
                  <span>{item.type}</span>
                  <span>{formatMoney(item.price)}</span>
                  {item.type !== 'Serviço' && <span>Estoque: {item.stock}</span>}
                  {item.brand && <span>{item.brand}</span>}
                </div>
              </div>

              <button className="primary-btn compact" onClick={() => select(item)}>
                Selecionar
              </button>
            </article>
          ))}

          {!loading && items.length === 0 && (
            <div className="empty-box">Nenhum resultado encontrado.</div>
          )}
        </div>

        <div className="pagination-row">
          <span>{items.length} de {total} resultado(s)</span>

          <button
            className="secondary-btn compact"
            onClick={loadMore}
            disabled={items.length >= total}
          >
            Carregar mais
          </button>
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
