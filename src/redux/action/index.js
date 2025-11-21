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

// Auth actions
export const registerUser = (payload) => ({ type: 'AUTH_REGISTER', payload })
export const loginUser = (payload) => ({ type: 'AUTH_LOGIN', payload })
export const logoutUser = () => ({ type: 'AUTH_LOGOUT' })