const USERS_KEY = 'autoflux_react_users_v1'
const SESSION_KEY = 'autoflux_react_session_v1'

const defaultAdmin = {
  id: 'admin-default',
  name: 'Administrador AutoFlux',
  email: 'admin@autoflux.com',
  password: 'admin123',
  role: 'admin',
}

function ensureUsers() {
  const raw = localStorage.getItem(USERS_KEY)

  let users = []
  try {
    users = raw ? JSON.parse(raw) : []
  } catch {
    users = []
  }

  const adminIndex = users.findIndex((user) => user.email === defaultAdmin.email)

  if (adminIndex >= 0) {
    users[adminIndex] = { ...users[adminIndex], ...defaultAdmin }
  } else {
    users.unshift(defaultAdmin)
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return users
}

export const authService = {
  users: ensureUsers,

  login(email, password) {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const users = ensureUsers()

    const user = users.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
    )

    if (!user) {
      throw new Error('E-mail ou senha inválidos.')
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loginAt: new Date().toISOString(),
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  },

  loginAsAdmin() {
    return this.login(defaultAdmin.email, defaultAdmin.password)
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    } catch {
      return null
    }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY)
  },

  addUser(user) {
    const users = ensureUsers()

    if (users.some((item) => item.email.toLowerCase() === user.email.toLowerCase())) {
      throw new Error('Já existe um usuário com esse e-mail.')
    }

    const newUser = {
      id: crypto.randomUUID(),
      ...user,
    }

    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    return newUser
  },

  removeUser(id) {
    if (id === defaultAdmin.id) {
      throw new Error('O administrador padrão não pode ser removido nesta versão de teste.')
    }

    const users = ensureUsers().filter((user) => user.id !== id)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },
}
