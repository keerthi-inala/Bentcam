// Auth state with localStorage persistence
const loadAuth = () => {
  try {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : { currentUser: null }
  } catch (_) {
    return { currentUser: null }
  }
}

const saveAuth = (state) => {
  try {
    localStorage.setItem('auth', JSON.stringify({ currentUser: state.currentUser }))
  } catch (_) {}
}

const initialState = { ...loadAuth(), token: null, loading: false, error: null }

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_REGISTER_REQUEST':
    case 'AUTH_LOGIN_REQUEST':
      return { ...state, loading: true, error: null }

    case 'AUTH_REGISTER_SUCCESS': {
      const user = action.payload.user
      const next = { ...state, loading: false, error: null, currentUser: user }
      saveAuth(next)
      return next
    }
    case 'AUTH_LOGIN_SUCCESS': {
      const user = action.payload.user
      const token = action.payload.token || null
      const next = { ...state, loading: false, error: null, currentUser: user, token }
      saveAuth(next)
      return next
    }
    case 'AUTH_REGISTER_FAILURE':
    case 'AUTH_LOGIN_FAILURE':
      return { ...state, loading: false, error: action.error || 'Auth error' }

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
