// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

// Auth actions (thunks)
export const registerUser = ({ name, email, password }) => async (dispatch) => {
    dispatch({ type: 'AUTH_REGISTER_REQUEST' })
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        if (res.status === 201) {
            const data = await res.json()
            dispatch({ type: 'AUTH_REGISTER_SUCCESS', payload: { user: data } })
            return true
        }
        const err = await res.json().catch(() => ({}))
        dispatch({ type: 'AUTH_REGISTER_FAILURE', error: err.message || 'Registration failed' })
        return false
    } catch (e) {
        dispatch({ type: 'AUTH_REGISTER_FAILURE', error: e.message || 'Network error' })
        return false
    }
}

export const loginUser = ({ email, password }) => async (dispatch) => {
    dispatch({ type: 'AUTH_LOGIN_REQUEST' })
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        if (res.ok) {
            const data = await res.json()
            // Save token for admin calls
            try { localStorage.setItem('authToken', data.token) } catch (_) {}
            dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: { user: data.user, token: data.token } })
            // Return data so caller can route based on role immediately
            return data
        }
        const err = await res.json().catch(() => ({}))
        dispatch({ type: 'AUTH_LOGIN_FAILURE', error: err.message || 'Invalid credentials' })
        return null
    } catch (e) {
        dispatch({ type: 'AUTH_LOGIN_FAILURE', error: e.message || 'Network error' })
        return null
    }
}
export const logoutUser = () => ({ type: 'AUTH_LOGOUT' })