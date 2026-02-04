import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navbar, Footer } from '.'
import BackendStatus from './BackendStatus'

const Layout = () => {
  const { currentUser } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const location = useLocation()

  // If an admin is logged in, keep them under /admin
  useEffect(() => {
    const role = typeof currentUser?.role === 'string' ? currentUser.role.trim().toLowerCase() : ''
    const isAdmin = role === 'admin'
    const isOnAdmin = location.pathname.startsWith('/admin')
    if (isAdmin && !isOnAdmin) {
      navigate('/admin', { replace: true })
    }
  }, [currentUser, location.pathname, navigate])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <BackendStatus />
      <div className="flex-grow-1 overflow-hidden">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
