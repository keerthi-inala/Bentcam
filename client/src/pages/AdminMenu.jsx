import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AdminMenu = () => {
  const { token } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(false)
  // Create menu modal
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [createErrors, setCreateErrors] = useState({ name: '', slug: '' })
  const [newMenuCategories, setNewMenuCategories] = useState([])
  const [newCatName, setNewCatName] = useState('')
  const [newCatSlugInput, setNewCatSlugInput] = useState('')
  const [newCatError, setNewCatError] = useState('')

  // Edit state
  // Edit menu modal
  const [editing, setEditing] = useState(null) // current menu object
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [showEditMenu, setShowEditMenu] = useState(false)
  const [editErrors, setEditErrors] = useState({ name: '', slug: '' })

  // Category management state
  const [expandedSlug, setExpandedSlug] = useState('')
  const [categories, setCategories] = useState([])
  // Category modals
  const [catName, setCatName] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [catCreateErrors, setCatCreateErrors] = useState({ name: '', slug: '' })
  const [catEditing, setCatEditing] = useState(null) // category object
  const [catEditName, setCatEditName] = useState('')
  const [catEditSlug, setCatEditSlug] = useState('')
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [catEditErrors, setCatEditErrors] = useState({ name: '', slug: '' })

  const fetchMenus = async () => {
    try {
      const res = await fetch('/api/menus')
      const data = await res.json()
      setMenus(Array.isArray(data) ? data : [])
    } catch (_) {}
  }

  useEffect(() => { fetchMenus() }, [])

  const toSlug = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  const onCreate = async (e) => {
    e.preventDefault()
    const s = slug || toSlug(name)
    const errors = { name: '', slug: '' }
    let ok = true
    if (!name.trim()) { errors.name = 'Name is required'; ok = false }
    if (!s) { errors.slug = 'Slug is required'; ok = false }
    // menu slug uniqueness check
    if (s && menus.some(m => String(m.slug || '').toLowerCase() === s.toLowerCase())) { errors.slug = 'Slug already exists'; ok = false }
    setCreateErrors(errors)
    if (!ok) { toast.error('Fix validation errors'); return }
    // Require at least one category for a new menu
    if (newMenuCategories.length === 0) {
      setNewCatError('Add at least one category')
      toast.error('At least one category is required')
      return
    }
    try {
      setLoading(true)
      const res = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ name: name.trim(), slug: s })
      })
      if (res.status === 201) {
        const created = await res.json()
        toast.success('Menu created')
        // Create any queued categories for this new menu
        const createdSlug = created?.slug || (slug || toSlug(name))
        for (const cat of newMenuCategories) {
          try {
            const cres = await fetch(`/api/admin/menus/${createdSlug}/categories`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}`
              },
              body: JSON.stringify({ name: cat.name, slug: cat.slug })
            })
            if (!cres.ok) {
              const body = await cres.json().catch(() => ({}))
              toast.error(body.message || `Category create failed: ${cat.name}`)
            }
          } catch (_) {
            toast.error(`Category create failed: ${cat.name}`)
          }
        }
        setName('')
        setSlug('')
        setNewMenuCategories([])
        setNewCatName('')
        setNewCatSlugInput('')
        setNewCatError('')
        setCreateErrors({ name: '', slug: '' })
        setShowCreateMenu(false)
        fetchMenus()
      } else if (res.status === 401) {
        toast.error('Unauthorized. Please login as admin again.')
        navigate('/login')
      } else {
        const body = await res.json().catch(() => ({}))
        toast.error(body.message || 'Create failed')
      }
    } catch (e) {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this menu?')) return
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/menus/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}` }
      })
      if (res.status === 204) {
        toast.success('Menu deleted')
        setMenus(prev => prev.filter(m => m.id !== id))
      } else if (res.status === 401) {
        toast.error('Unauthorized. Please login as admin again.')
        navigate('/login')
      } else {
        const body = await res.json().catch(() => ({}))
        toast.error(body.message || 'Delete failed')
      }
    } catch (_) {
      toast.error('Network error')
    } finally { setLoading(false) }
  }

  const openEdit = (m) => {
    setEditing(m)
    setEditName(m.name || '')
    setEditSlug(m.slug || '')
    setEditErrors({ name: '', slug: '' })
    setShowEditMenu(true)
  }

  const onUpdate = async (e) => {
    e.preventDefault()
    if (!editing) return
    const s = editSlug || toSlug(editName)
    const errors = { name: '', slug: '' }
    let ok = true
    if (!editName.trim()) { errors.name = 'Name is required'; ok=false }
    if (!s) { errors.slug = 'Slug is required'; ok=false }
    // uniqueness excluding current
    if (s && menus.some(m => m.id !== editing.id && String(m.slug || '').toLowerCase() === s.toLowerCase())) { errors.slug = 'Slug already exists'; ok=false }
    setEditErrors(errors)
    if (!ok) { toast.error('Fix validation errors'); return }
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/menus/${editing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ name: editName.trim(), slug: s })
      })
      if (res.ok) {
        const updated = await res.json()
        setMenus(prev => prev.map(m => m.id === updated.id ? updated : m))
        toast.success('Menu updated')
        setShowEditMenu(false)
        setEditing(null)
      } else if (res.status === 401) {
        toast.error('Unauthorized. Please login as admin again.')
        navigate('/login')
      } else {
        const body = await res.json().catch(() => ({}))
        toast.error(body.message || 'Update failed')
      }
    } catch (_) {
      toast.error('Network error')
    } finally { setLoading(false) }
  }

  const fetchCategories = async (menuSlug) => {
    try {
      const res = await fetch(`/api/menus/${menuSlug}/categories`)
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (_) { setCategories([]) }
  }

  const openCategories = async (menuSlug) => {
    const next = expandedSlug === menuSlug ? '' : menuSlug
    setExpandedSlug(next)
    setCategories([])
    setCatName(''); setCatSlug(''); setCatEditing(null); setShowCreateCategory(false); setShowEditCategory(false)
    if (next) await fetchCategories(next)
  }

  const onCreateCategory = async (e) => {
    e.preventDefault()
    const s = catSlug || toSlug(catName)
    if (!expandedSlug) return
    const errors = { name: '', slug: '' }
    let ok = true
    if (!catName.trim()) { errors.name = 'Name is required'; ok=false }
    if (!s) { errors.slug = 'Slug is required'; ok=false }
    if (s && categories.some(c => String(c.slug || '').toLowerCase() === s.toLowerCase())) { errors.slug = 'Slug already exists'; ok=false }
    setCatCreateErrors(errors)
    if (!ok) { toast.error('Fix validation errors'); return }
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/menus/${expandedSlug}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ name: catName.trim(), slug: s })
      })
      if (res.status === 201) {
        toast.success('Category created')
        setCatName(''); setCatSlug('')
        setCatCreateErrors({ name: '', slug: '' })
        setShowCreateCategory(false)
        fetchCategories(expandedSlug)
      } else if (res.status === 401) {
        toast.error('Unauthorized. Please login as admin again.')
        navigate('/login')
      } else {
        const body = await res.json().catch(() => ({}))
        toast.error(body.message || 'Create failed')
      }
    } catch (_) {
      toast.error('Network error')
    } finally { setLoading(false) }
  }

  const onDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}` }
      })
      if (res.status === 204) {
        toast.success('Category deleted')
        setCategories(prev => prev.filter(c => c.id !== id))
      } else if (res.status === 401) {
        toast.error('Unauthorized. Please login as admin again.')
        navigate('/login')
      } else {
        const body = await res.json().catch(() => ({}))
        toast.error(body.message || 'Delete failed')
      }
    } catch (_) {
      toast.error('Network error')
    } finally { setLoading(false) }
  }

  const openEditCategory = (c) => {
    setCatEditing(c)
    setCatEditName(c.name || '')
    setCatEditSlug(c.slug || '')
    setCatEditErrors({ name: '', slug: '' })
    setShowEditCategory(true)
  }

  const onUpdateCategory = async (e) => {
    e.preventDefault()
    if (!catEditing) return
    const s = catEditSlug || toSlug(catEditName)
    const errors = { name: '', slug: '' }
    let ok = true
    if (!catEditName.trim()) { errors.name = 'Name is required'; ok=false }
    if (!s) { errors.slug = 'Slug is required'; ok=false }
    if (s && categories.some(c => c.id !== catEditing.id && String(c.slug || '').toLowerCase() === s.toLowerCase())) { errors.slug = 'Slug already exists'; ok=false }
    setCatEditErrors(errors)
    if (!ok) { toast.error('Fix validation errors'); return }
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/categories/${catEditing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ name: catEditName.trim(), slug: s })
      })
      if (res.ok) {
        const updated = await res.json()
        setCategories(prev => prev.map(c => c.id === updated.id ? updated : c))
        toast.success('Category updated')
        setShowEditCategory(false)
        setCatEditing(null)
      } else if (res.status === 401) {
        toast.error('Unauthorized. Please login as admin again.')
        navigate('/login')
      } else {
        const body = await res.json().catch(() => ({}))
        toast.error(body.message || 'Update failed')
      }
    } catch (_) {
      toast.error('Network error')
    } finally { setLoading(false) }
  }

  return (
    <div className="container my-3 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Manage Menu</h2>
        <div>
          <button className="btn btn-primary" onClick={() => { setName(''); setSlug(''); setCreateErrors({ name:'', slug:'' }); setNewMenuCategories([]); setNewCatName(''); setNewCatSlugInput(''); setNewCatError(''); setShowCreateMenu(true) }} disabled={loading}>Create Menu</button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Slug</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map(m => (
              <React.Fragment key={m.id}>
                <tr scope="row">
                  <td>{m.id}</td>
                  <>
                    <td>{m.name}</td>
                    <td>{m.slug}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary me-2" onClick={() => openEdit(m)} disabled={loading}>Edit</button>
                      <button className="btn btn-sm btn-info me-2" onClick={() => openCategories(m.slug)} disabled={loading}>{expandedSlug === m.slug ? 'Hide Categories' : 'Manage Categories'}</button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete(m.id)} disabled={loading}>Delete</button>
                    </td>
                  </>
                </tr>
                {expandedSlug === m.slug && (
                  <tr>
                    <td colSpan={4}>
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">Categories for <span className="badge bg-secondary">{m.name}</span></h6>
                          <button className="btn btn-sm btn-primary" onClick={() => { setCatName(''); setCatSlug(''); setCatCreateErrors({name:'',slug:''}); setShowCreateCategory(true) }} disabled={loading}>Add Category</button>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-sm table-striped mb-0">
                            <thead>
                              <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Slug</th>
                                <th scope="col">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {categories.map(c => (
                                <tr key={c.id} scope="row">
                                  <td>{c.id}</td>
                                  <>
                                    <td>{c.name}</td>
                                    <td>{c.slug}</td>
                                    <td>
                                      <button className="btn btn-sm btn-secondary me-2" onClick={() => openEditCategory(c)} disabled={loading}>Edit</button>
                                      <button className="btn btn-sm btn-danger" onClick={() => onDeleteCategory(c.id)} disabled={loading}>Delete</button>
                                    </td>
                                  </>
                                </tr>
                              ))}
                              {!loading && categories.length === 0 && (
                                <tr><td colSpan={4} className="text-center">No categories</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {!loading && menus.length === 0 && (
              <tr><td colSpan={4} className="text-center">No menus</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Create Menu Modal */}
      {showCreateMenu && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Menu</h5>
                <button type="button" className="btn-close" onClick={() => { setShowCreateMenu(false); setCreateErrors({name:'',slug:''}) }} aria-label="Close"></button>
              </div>
              <form onSubmit={onCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Menu Name*</label>
                    <input className={`form-control ${createErrors.name ? 'is-invalid' : ''}`} value={name} onChange={e=>setName(e.target.value)} />
                    {createErrors.name && (<div className="invalid-feedback">{createErrors.name}</div>)}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Menu Slug</label>
                    <input className={`form-control ${createErrors.slug ? 'is-invalid' : ''}`} value={slug} onChange={e=>setSlug(e.target.value)} placeholder="auto-from-name if blank" />
                    {createErrors.slug && (<div className="invalid-feedback">{createErrors.slug}</div>)}
                  </div>
                  <hr />
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Categories</h6>
                    {newMenuCategories.length > 0 && (
                      <span className="badge bg-secondary">{newMenuCategories.length} added</span>
                    )}
                  </div>
                  <div className="row g-2 align-items-end">
                    <div className="col-md-6">
                      <label className="form-label">Category Name*</label>
                      <input className="form-control" value={newCatName} onChange={e=>{ setNewCatName(e.target.value); setNewCatError('') }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Category Slug</label>
                      <input className="form-control" value={newCatSlugInput} onChange={e=>{ setNewCatSlugInput(e.target.value); setNewCatError('') }} placeholder="auto-from-name if blank" />
                    </div>
                    <div className="col-md-2">
                      <button type="button" className="btn btn-outline-primary w-100" onClick={() => {
                        const s = (newCatSlugInput || toSlug(newCatName))
                        if (!newCatName.trim() || !s) { setNewCatError('Name/slug required'); return }
                        if (newMenuCategories.some(c => String(c.slug || '').toLowerCase() === s.toLowerCase())) { setNewCatError('Slug already added'); return }
                        setNewMenuCategories(prev => [...prev, { name: newCatName.trim(), slug: s }])
                        setNewCatName('')
                        setNewCatSlugInput('')
                        setNewCatError('')
                      }}>Add</button>
                    </div>
                  </div>
                  {newCatError && (<div className="text-danger small mt-2">{newCatError}</div>)}
                  {newMenuCategories.length > 0 && (
                    <div className="table-responsive mt-3">
                      <table className="table table-sm">
                        <thead><tr><th>Name</th><th>Slug</th><th></th></tr></thead>
                        <tbody>
                          {newMenuCategories.map((c, idx) => (
                            <tr key={idx}>
                              <td>{c.name}</td>
                              <td>{c.slug}</td>
                              <td className="text-end">
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => {
                                  setNewMenuCategories(prev => prev.filter((_, i) => i !== idx))
                                }}>Remove</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowCreateMenu(false); setCreateErrors({name:'',slug:''}) }} disabled={loading}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading || newMenuCategories.length === 0}>Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Modal */}
      {showEditMenu && editing && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Menu #{editing.id}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowEditMenu(false); setEditing(null) }} aria-label="Close"></button>
              </div>
              <form onSubmit={onUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name*</label>
                    <input className={`form-control ${editErrors.name ? 'is-invalid' : ''}`} value={editName} onChange={e=>setEditName(e.target.value)} />
                    {editErrors.name && (<div className="invalid-feedback">{editErrors.name}</div>)}
                    <div className="form-text">Required</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Slug</label>
                    <input className={`form-control ${editErrors.slug ? 'is-invalid' : ''}`} value={editSlug} onChange={e=>setEditSlug(e.target.value)} />
                    {editErrors.slug && (<div className="invalid-feedback">{editErrors.slug}</div>)}
                    <div className="form-text">If left blank, slug auto-generates from name</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowEditMenu(false); setEditing(null) }} disabled={loading}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateCategory && expandedSlug && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Category</h5>
                <button type="button" className="btn-close" onClick={() => { setShowCreateCategory(false); setCatCreateErrors({name:'',slug:''}) }} aria-label="Close"></button>
              </div>
              <form onSubmit={onCreateCategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name*</label>
                    <input className={`form-control ${catCreateErrors.name ? 'is-invalid' : ''}`} value={catName} onChange={e=>setCatName(e.target.value)} />
                    {catCreateErrors.name && (<div className="invalid-feedback">{catCreateErrors.name}</div>)}
                    <div className="form-text">Required</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Slug</label>
                    <input className={`form-control ${catCreateErrors.slug ? 'is-invalid' : ''}`} value={catSlug} onChange={e=>setCatSlug(e.target.value)} placeholder="auto-from-name if blank" />
                    {catCreateErrors.slug && (<div className="invalid-feedback">{catCreateErrors.slug}</div>)}
                    <div className="form-text">If left blank, slug auto-generates from name</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowCreateCategory(false); setCatCreateErrors({name:'',slug:''}) }} disabled={loading}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategory && catEditing && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Category #{catEditing.id}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowEditCategory(false); setCatEditing(null) }} aria-label="Close"></button>
              </div>
              <form onSubmit={onUpdateCategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input className={`form-control ${catEditErrors.name ? 'is-invalid' : ''}`} value={catEditName} onChange={e=>setCatEditName(e.target.value)} />
                    {catEditErrors.name && (<div className="invalid-feedback">{catEditErrors.name}</div>)}
                    <div className="form-text">Required</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Slug</label>
                    <input className={`form-control ${catEditErrors.slug ? 'is-invalid' : ''}`} value={catEditSlug} onChange={e=>setCatEditSlug(e.target.value)} />
                    {catEditErrors.slug && (<div className="invalid-feedback">{catEditErrors.slug}</div>)}
                    <div className="form-text">If left blank, slug auto-generates from name</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowEditCategory(false); setCatEditing(null) }} disabled={loading}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMenu
