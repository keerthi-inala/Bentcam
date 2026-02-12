import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../redux/action'
import '../scss/navbar.css'

const Navbar = () => {
  const state = useSelector(state => state.handleCart)
  const currentUser = useSelector(state => state.auth.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTopMenu, setActiveTopMenu] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeSub, setActiveSub] = useState(null)
  const [showMega, setShowMega] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const isAdminLoggedIn = !!(currentUser && typeof currentUser.role === 'string' && currentUser.role.trim().toLowerCase() === 'admin')
  const isAdminPage = location.pathname.startsWith('/admin')

  // Dynamic menus/categories from backend
  const [menuList, setMenuList] = useState([]) // [{id, name, slug}]
  const [menuCategories, setMenuCategories] = useState({}) // { slug: [{id,name,slug}] }

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const res = await fetch('/api/menus')
        const data = await res.json()
        const arr = Array.isArray(data) ? data : []
        setMenuList(arr)
        // Select first menu by default if opening mega menu later
      } catch (_) {}
    }
    loadMenus()
  }, [])

  const handleMenuClick = (menuName) => {
    if (activeTopMenu === menuName && showMega) {
      // clicking same menu again closes it
      setShowMega(false)
      setActiveTopMenu(null)
      setActiveCategory(null)
    } else {
      setActiveTopMenu(menuName)
      setShowMega(true)
      const first = menuList[0]
      if (first) setActiveCategory(first.slug)
      setActiveSub(null)
      // Preload categories for first menu
      if (first && !menuCategories[first.slug]) {
        fetch(`/api/menus/${first.slug}/categories`).then(r=>r.json()).then(d=>{
          setMenuCategories(prev => ({ ...prev, [first.slug]: Array.isArray(d) ? d : [] }))
        }).catch(()=>{})
      }
    }
  }

  // close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMega(false)
        setActiveTopMenu(null)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // close user menu on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="navbar-wrapper sticky-top" ref={menuRef}>
      {/* ==== Top blue bar (hidden for admins) ==== */}
      {!isAdminLoggedIn && (
        <div className="navbar-top d-flex justify-content-end align-items-center px-3">
          <ul className="list-unstyled d-flex mb-0 small">
            <li className="me-3"><a href="/about" className="text-white text-decoration-none">About Us</a></li>
            <li className="me-3"><a href="/contact" className="text-white text-decoration-none">Contact Us</a></li>
              <li className="me-3 border-start ps-3"><button className="text-white text-decoration-none btn btn-link p-0" type="button" aria-label="Language">EN</button></li>
          </ul>
        </div>
      )}

      {/* ==== Main header ==== */}
      <div className="navbar-main d-flex justify-content-between align-items-center px-4 py-2">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img src="../../assets/logo.svg" alt="logo" style={{ height: '40px' }} />
        </NavLink>

        {!isAdminLoggedIn || !isAdminPage ? (
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
        ) : (
          <div className="flex-grow-1"></div>
        )}

        <div className="d-flex align-items-center gap-3">
          {!currentUser ? (
            <NavLink to="/login" className="text-dark text-decoration-none"><i className="fa fa-user-circle me-1"></i> Sign In / Register</NavLink>
          ) : (
            <div className="position-relative">
              <button
                type="button"
                className="btn btn-link text-decoration-none text-dark p-0 d-flex align-items-center"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen(o => !o)}
              >
                <i className="fa fa-user-circle me-1"></i> {currentUser.name || currentUser.email} {currentUser?.role && String(currentUser.role).trim().toLowerCase() === 'admin' && (
                  <span className="badge rounded-pill bg-primary ms-2" title="Administrator">Admin</span>
                )} <i className="fa fa-caret-down ms-1"></i>
              </button>
              {userMenuOpen && (
                <div
                  className="shadow-sm border rounded-2 bg-white position-absolute end-0 mt-2"
                  style={{ minWidth: '200px', zIndex: 1000 }}
                  role="menu"
                >
                  <div className="px-3 py-2 small text-muted" style={{ wordBreak: 'break-all' }}>{currentUser.email}</div>
                  <hr className="my-0" />
                  <button
                    className="btn btn-light w-100 text-start px-3 py-2"
                    onClick={() => { dispatch(logoutUser()); setUserMenuOpen(false); navigate('/login'); }}
                  >
                    <i className="fa fa-sign-out me-2 text-danger"></i> Sign out
                  </button>
                </div>
              )}
            </div>
          )}
          {!isAdminLoggedIn && (
            <NavLink to="/cart" className="text-dark text-decoration-none position-relative">
              <i className="fa fa-shopping-cart fs-5"></i>
              <span className="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.65rem' }}>{state.length}</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* ==== Secondary menu (hidden for admins) ==== */}
      {!isAdminLoggedIn && (
        <nav className="navbar-secondary shadow-sm">
          <div className="container position-relative">
            <ul className="nav">
              {['Products'].map(menuName => (
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
                            {menuList.map(m => (
                              <li key={m.id}>
                                <button
                                  className={`mega-left-btn ${activeCategory === m.slug ? 'active' : ''}`}
                                  onClick={() => {
                                    setActiveCategory(m.slug)
                                    if (!menuCategories[m.slug]) {
                                      fetch(`/api/menus/${m.slug}/categories`).then(r=>r.json()).then(d=>{
                                        setMenuCategories(prev => ({ ...prev, [m.slug]: Array.isArray(d) ? d : [] }))
                                      }).catch(()=>{})
                                    }
                                  }}>
                                  <i className="fa fa-folder-open me-2"></i>{m.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Right side */}
                        <div className="mega-right">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">{(menuList.find(x=>x.slug===activeCategory)?.name) || 'Category'}</h5>
                            <button 
                              className="btn btn-link btn-sm p-0 text-primary text-decoration-none fw-semibold"
                              onClick={() => {
                                const menuSlug = activeCategory
                                navigate(`/category/${menuSlug}`);
                              }}>
                              Shop All
                            </button>
                          </div>
                          <div className="sub-list">
                            {(menuCategories[activeCategory] || []).map(sub => (
                              <button
                                key={sub.id}
                                className={`sub-item ${activeSub === sub.slug ? 'active' : ''}`}
                                onClick={() => {
                                  setActiveSub(sub.slug);
                                  const menuSlug = activeCategory
                                  navigate(`/category/${menuSlug}/${sub.slug}`);
                                  setShowMega(false);
                                }}>
                                {sub.name}
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
      )}
    </header>
  )
}

export default Navbar
