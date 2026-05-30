import { mockCatalog } from '../data/mockCatalog.js'

const SETTINGS_KEY = 'autoflux_catalog_settings_v1'

const defaultSettings = {
  mode: 'local',
  endpoint: 'http://localhost:3000/api/catalog/search',
  limit: 50,
}

export const catalogService = {
  getSettings() {
    try {
      return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }
    } catch {
      return defaultSettings
    }
  },

  saveSettings(settings) {
    const next = { ...this.getSettings(), ...settings }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
    return next
  },

  async search(params = {}) {
    const settings = this.getSettings()
    const limit = Number(params.limit || settings.limit || 50)
    const offset = Number(params.offset || 0)

    if (settings.mode === 'api') {
      try {
        const url = new URL(settings.endpoint)

        Object.entries({
          termo: params.term,
          veiculo: params.vehicle,
          ano: params.year,
          estoque: params.stock,
          limit,
          offset,
        }).forEach(([key, value]) => {
          if (value !== undefined && value !== null && String(value).trim() !== '') {
            url.searchParams.set(key, String(value))
          }
        })

        const response = await fetch(url.toString(), {
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data = await response.json()
        const rawItems = Array.isArray(data) ? data : data.items || data.results || []

        return {
          items: rawItems.map(normalizeItem),
          total: Number(data.total || data.count || rawItems.length),
          source: 'api',
        }
      } catch (error) {
        return {
          items: searchLocal(params, limit, offset),
          total: searchLocal(params, 999999, 0).length,
          source: 'local-fallback',
          error: error.message,
        }
      }
    }

    const items = searchLocal(params, limit, offset)
    const total = searchLocal(params, 999999, 0).length

    return { items, total, source: 'local' }
  },
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function matchYear(item, year) {
  if (!year) return true
  const value = Number(year)
  const start = Number(item.yearStart || 0)
  const end = Number(item.yearEnd || 0)

  if (!start && !end) return true
  if (start && value < start) return false
  if (end && value > end) return false

  return true
}

function searchLocal(params, limit, offset) {
  const terms = normalizeText(params.term).split(/\s+/).filter(Boolean)
  const vehicle = normalizeText(params.vehicle)
  const stock = params.stock

  const filtered = mockCatalog.filter((item) => {
    const text = normalizeText([
      item.sku,
      item.code,
      item.manufacturerCode,
      item.supplierCode,
      item.name,
      item.vehicle,
      item.application,
      item.engine,
      item.system,
      item.brand,
      item.supplier,
      item.category,
      item.type,
    ].join(' '))

    if (!terms.every((term) => text.includes(term))) return false
    if (vehicle && !text.includes(vehicle)) return false
    if (!matchYear(item, params.year)) return false

    if (stock === 'disponivel' && item.type !== 'Serviço' && Number(item.stock || 0) <= 0) {
      return false
    }

    if (
      stock === 'baixo' &&
      !(item.type !== 'Serviço' && Number(item.stock || 0) <= Number(item.minStock || 0))
    ) {
      return false
    }

    return true
  })

  return filtered.slice(offset, offset + limit)
}

function normalizeItem(row) {
  return {
    id: String(row.id || row.sku || crypto.randomUUID()),
    sku: row.sku || row.codigo_interno || '',
    code: row.code || row.codigo || row.codigo_peca || '',
    manufacturerCode: row.manufacturer_code || row.codigo_fabricante || '',
    supplierCode: row.supplier_code || row.codigo_fornecedor || '',
    brand: row.brand || row.marca || row.fabricante || '',
    supplier: row.supplier || row.fornecedor || '',
    name: row.name || row.nome || row.display_name || row.descricao || 'Item sem descrição',
    vehicle: row.vehicle || row.veiculo || '',
    application: row.application || row.aplicacao || row.vehicle || '',
    yearStart: Number(row.year_start || row.ano_inicial || 2000),
    yearEnd: Number(row.year_end || row.ano_final || 2026),
    engine: row.engine || row.motor || row.motorizacao || '',
    system: row.system || row.sistema || row.category || '',
    category: row.category || row.categoria || '',
    type: row.type || row.tipo || 'Peça',
    unit: row.unit || row.unidade || 'un',
    cost: Number(row.cost_estimate || row.custo || 0),
    price: Number(row.price_estimate || row.preco || row.venda || 0),
    stock: Number(row.stock || row.estoque || 0),
    minStock: Number(row.min_stock || row.estoque_minimo || 0),
    warrantyDays: Number(row.warranty_days || row.garantia_dias || 90),
  }
    }
