import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const RequireAdmin = ({ children }) => {
  const { currentUser } = useSelector(state => state.auth)
  const location = useLocation()
  const isAdmin = !!(currentUser && typeof currentUser.role === 'string' && currentUser.role.trim().toLowerCase() === 'admin')

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}

export default RequireAdmin
