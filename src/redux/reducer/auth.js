// Simple client-side auth with localStorage persistence
const loadAuth = () => {
  try {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : { currentUser: null, users: [] }
  } catch (_) {
    return { currentUser: null, users: [] }
  }
}

const saveAuth = (state) => {
  try {
    localStorage.setItem('auth', JSON.stringify(state))
  } catch (_) {}
}

const initialState = loadAuth()

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_REGISTER': {
      const { name, email, password } = action.payload
      const exists = state.users.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (exists) {
        // Keep state unchanged if duplicate
        return state
      }
      const newUser = { id: Date.now(), name, email, password }
      const next = { ...state, users: [...state.users, newUser], currentUser: { id: newUser.id, name, email } }
      saveAuth(next)
      return next
    }
    case 'AUTH_LOGIN': {
      const { email, password } = action.payload
      const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
      if (!user) return state
      const next = { ...state, currentUser: { id: user.id, name: user.name, email: user.email } }
      saveAuth(next)
      return next
    }
    case 'AUTH_LOGOUT': {
      const next = { ...state, currentUser: null }
      saveAuth(next)
      return next
    }
    default:
      return state
  }
}

export default auth
