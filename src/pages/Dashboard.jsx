import { FileText, Search, Users, ClipboardCheck } from 'lucide-react'

export default function Dashboard({ onOpen }) {
  const cards = [
    {
      id: 'orcamento',
      title: 'Novo orçamento',
      text: 'Monte orçamento, ordem de serviço e resumo para o cliente.',
      icon: FileText,
    },
    {
      id: 'catalogo',
      title: 'Buscar peça',
      text: 'Pesquise por peça, código, veículo, ano e motor.',
      icon: Search,
    },
    {
      id: 'clientes',
      title: 'Clientes',
      text: 'Cadastre clientes e veículos atendidos pela oficina.',
      icon: Users,
    },
    {
      id: 'vistoria',
      title: 'Vistoria',
      text: 'Faça checklist de entrada e acompanhe o estado do veículo.',
      icon: ClipboardCheck,
    },
  ]

  return (
    <section>
      <div className="hero">
        <div>
          <h1>AutoFlux React</h1>
          <p>
            Sistema para gestão de oficinas, orçamentos, clientes, vistoria e
            busca de peças por catálogo.
          </p>
        </div>

        <button className="hero-btn" onClick={() => onOpen('orcamento')}>
          Criar orçamento
        </button>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <small>Versão</small>
          <strong>MVP React</strong>
          <span>Teste no GitHub Pages</span>
        </div>

        <div className="metric-card">
          <small>Catálogo</small>
          <strong>API-ready</strong>
          <span>Preparado para banco grande</span>
        </div>

        <div className="metric-card">
          <small>Login</small>
          <strong>Teste</strong>
          <span>Depois migraremos para Firebase/Supabase</span>
        </div>
      </div>

      <div className="module-grid">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <button
              key={card.id}
              className="module-card"
              onClick={() => onOpen(card.id)}
            >
              <Icon size={28} />

              <div>
                <strong>{card.title}</strong>
                <p>{card.text}</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
