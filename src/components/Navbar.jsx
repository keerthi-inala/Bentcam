import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../redux/action'
import { categorySlugMap } from '../data/categoryMapping'
import '../scss/navbar.css'

const Navbar = () => {
  const state = useSelector(state => state.handleCart)
  const currentUser = useSelector(state => state.auth.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTopMenu, setActiveTopMenu] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeSub, setActiveSub] = useState(null)
  const [showMega, setShowMega] = useState(false)
  const menuRef = useRef(null)

  const menus = {
    'Products': [
      { key: 'Doors, Glass & Components', icon: 'fa-door-open', subs: ['Door Frame', 'Glass Panel', 'Door Handle', 'Gasket Seal', 'Hinge Assembly'] },
      { key: 'Hardware & Fittings', icon: 'fa-wrench', subs: ['Adapter', 'Bearing', 'Bolt Set', 'Bracket', 'Fastener Kit'] },
      { key: 'Motors & Components', icon: 'fa-cogs', subs: ['Motor', 'Motor Assy', 'Fan Blade', 'Bracket-Motor', 'Guard'] },
    ],
  }

  const handleMenuClick = (menuName) => {
    if (activeTopMenu === menuName && showMega) {
      // clicking same menu again closes it
      setShowMega(false)
      setActiveTopMenu(null)
      setActiveCategory(null)
    } else {
      setActiveTopMenu(menuName)
      setShowMega(true)
      const first = menus[menuName][0]
      if (first) setActiveCategory(first.key)
      setActiveSub(null)
    }
  }

  // close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMega(false)
        setActiveTopMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="navbar-wrapper sticky-top" ref={menuRef}>
      {/* ==== Top blue bar ==== */}
      <div className="navbar-top d-flex justify-content-end align-items-center px-3">
        <ul className="list-unstyled d-flex mb-0 small">
          <li className="me-3"><a href="/about" className="text-white text-decoration-none">About Us</a></li>
          <li className="me-3"><a href="/contact" className="text-white text-decoration-none">Contact Us</a></li>
          <li className="me-3 border-start ps-3"><a href="#" className="text-white text-decoration-none">EN</a></li>
        </ul>
      </div>

      {/* ==== Main header ==== */}
      <div className="navbar-main d-flex justify-content-between align-items-center px-4 py-2">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img src="../../assets/logo.svg" alt="logo" style={{ height: '40px' }} />
        </NavLink>

        <form className="d-flex flex-grow-1 mx-3 gap-2 justify-content-center">
          <div className="input-group search-box">
            <input type="text" className="form-control" placeholder="Search by Serial # Only" />
            <button type="button" className="btn btn-light"><i className="fa fa-search text-primary"></i></button>
          </div>
          <div className="input-group search-box">
            <input type="text" className="form-control" placeholder="Search by Part # or Description" />
            <button type="button" className="btn btn-light"><i className="fa fa-search text-primary"></i></button>
          </div>
        </form>

        <div className="d-flex align-items-center gap-3">
          {!currentUser ? (
            <NavLink to="/login" className="text-dark text-decoration-none"><i className="fa fa-user-circle me-1"></i> Sign In / Register</NavLink>
          ) : (
            <div className="dropdown">
              <button className="btn btn-link text-decoration-none dropdown-toggle text-dark" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fa fa-user-circle me-1"></i> {currentUser.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li className="dropdown-item text-muted small">{currentUser.email}</li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={()=>{ dispatch(logoutUser()); navigate('/login'); }}>Sign out</button></li>
              </ul>
            </div>
          )}
          <NavLink to="/cart" className="text-dark text-decoration-none position-relative">
            <i className="fa fa-shopping-cart fs-5"></i>
            <span className="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.65rem' }}>{state.length}</span>
          </NavLink>
        </div>
      </div>

      {/* ==== Secondary menu ==== */}
      <nav className="navbar-secondary shadow-sm">
        <div className="container position-relative">
          <ul className="nav">
            {Object.keys(menus).map(menuName => (
              <li key={menuName} className="nav-item position-relative">
                <button
                  className={`btn nav-link px-3 ${activeTopMenu === menuName ? 'text-primary fw-bold' : 'text-dark'}`}
                  onClick={() => handleMenuClick(menuName)}
                >
                  {menuName} <i className="fa fa-caret-down ms-1"></i>
                </button>

                {/* Mega menu (shown only when clicked) */}
                {showMega && activeTopMenu === menuName && (
                  <div className={`mega-menu show`}>
                    <div className="d-flex">
                      {/* Left side */}
                      <div className="mega-left">
                        <h6 className="mb-3">{menuName}</h6>
                        <ul className="list-unstyled mb-0">
                          {menus[menuName].map(cat => (
                            <li key={cat.key}>
                              <button
                                className={`mega-left-btn ${activeCategory === cat.key ? 'active' : ''}`}
                                onClick={() => {
                                  setActiveCategory(cat.key);
                                  // No direct navigation on top-level category click
                                }}>
                                <i className={`fa ${cat.icon} me-2`}></i>{cat.key}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right side */}
                      <div className="mega-right">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">{activeCategory}</h5>
                          <button 
                            className="btn btn-link btn-sm p-0 text-primary text-decoration-none fw-semibold"
                            onClick={() => {
                              const slug = categorySlugMap[activeCategory];
                              navigate(`/category/${slug}`);
                            }}>
                            Shop All
                          </button>
                        </div>
                        <div className="sub-list">
                          {(menus[menuName].find(c => c.key === activeCategory)?.subs || []).map(sub => (
                            <button
                              key={sub}
                              className={`sub-item ${activeSub === sub ? 'active' : ''}`}
                              onClick={() => {
                                setActiveSub(sub);
                                const slug = categorySlugMap[activeCategory];
                                navigate(`/category/${slug}/${sub}`);
                                setShowMega(false);
                              }}>
                              {sub}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
