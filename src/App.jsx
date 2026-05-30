import { useMemo, useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  Search,
  Users,
  ClipboardCheck,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Orcamento from './pages/Orcamento.jsx'
import CatalogoBusca from './pages/CatalogoBusca.jsx'
import Clientes from './pages/Clientes.jsx'
import Vistoria from './pages/Vistoria.jsx'
import Configuracoes from './pages/Configuracoes.jsx'
import { authService } from './services/auth.js'

const pages = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'atendente', 'mecanico', 'financeiro'] },
  { id: 'orcamento', label: 'Orçamento', icon: FileText, roles: ['admin', 'atendente', 'financeiro'] },
  { id: 'catalogo', label: 'Catálogo', icon: Search, roles: ['admin', 'atendente'] },
  { id: 'clientes', label: 'Clientes', icon: Users, roles: ['admin', 'atendente'] },
  { id: 'vistoria', label: 'Vistoria', icon: ClipboardCheck, roles: ['admin', 'atendente', 'mecanico'] },
  { id: 'config', label: 'Config.', icon: Settings, roles: ['admin'] },
]

export default function App() {
  const [session, setSession] = useState(() => authService.getSession())
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const allowedPages = useMemo(() => {
    if (!session) return []
    return pages.filter((page) => page.roles.includes(session.role))
  }, [session])

  function handleLogin(user) {
    setSession(user)
    setActive('dashboard')
  }

  function handleLogout() {
    authService.logout()
    setSession(null)
  }

  function openPage(id) {
    setActive(id)
    setSidebarOpen(false)
  }

  if (!session) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">AF</div>
          <div>
            <strong>AutoFlux</strong>
            <small>Gestão de oficina</small>
          </div>
        </div>

        <nav className="nav-list">
          {allowedPages.map((page) => {
            const Icon = page.icon
            return (
              <button
                key={page.id}
                className={active === page.id ? 'active' : ''}
                onClick={() => openPage(page.id)}
              >
                <Icon size={18} />
                {page.label}
              </button>
            )
          })}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={22} />
          </button>

          <div>
            <strong>{pageTitle(active)}</strong>
            <small>{session.name} • {roleLabel(session.role)}</small>
          </div>

          <button className="logout-mobile" onClick={handleLogout}>
            Sair
          </button>
        </header>

        <div className="page-container">
          {active === 'dashboard' && <Dashboard onOpen={openPage} />}
          {active === 'orcamento' && <Orcamento />}
          {active === 'catalogo' && <CatalogoBusca mode="standalone" />}
          {active === 'clientes' && <Clientes />}
          {active === 'vistoria' && <Vistoria />}
          {active === 'config' && <Configuracoes />}
        </div>
      </main>
    </div>
  )
}

function pageTitle(id) {
  return pages.find((page) => page.id === id)?.label || 'AutoFlux'
}

function roleLabel(role) {
  return {
    admin: 'Administrador',
    atendente: 'Atendente',
    mecanico: 'Mecânico',
    financeiro: 'Financeiro',
  }[role] || role
}
