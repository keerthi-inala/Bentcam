import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import '../scss/admin.css'
import BackendStatus from './BackendStatus'

const AdminLayout = () => {
  return (
    <div className="container-fluid px-0">
      <div className="row g-0 admin-shell">
        <div className="col-md-3 col-lg-2 border-end admin-sidebar sticky-top bg-white">
          <div className="list-group">
            <NavLink to="/admin" end className={({isActive}) => `list-group-item list-group-item-action rounded-0 ${isActive ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/admin/menus" className={({isActive}) => `list-group-item list-group-item-action rounded-0 ${isActive ? 'active' : ''}`}>Manage Menu</NavLink>
            <NavLink to="/admin/products" className={({isActive}) => `list-group-item list-group-item-action rounded-0 ${isActive ? 'active' : ''}`}>Manage Products</NavLink>
          </div>
        </div>
        <div className="col-md-9 col-lg-10 ps-md-3 ps-lg-4 admin-content pb-5">
          <BackendStatus />
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
