import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProductForm from '../components/admin/ProductForm'
import { validateCreate } from '../utils/productValidation'

const AdminProducts = () => {
  const { currentUser, token } = useSelector(state => state.auth)
  const isAdmin = !!(currentUser && typeof currentUser.role === 'string' && currentUser.role.trim().toLowerCase() === 'admin')
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [part, setPart] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [menu, setMenu] = useState('uncategorized')
  const [menuOptions, setMenuOptions] = useState([])
  const [category, setCategory] = useState('')
  const [categoryOptions, setCategoryOptions] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [createErrors, setCreateErrors] = useState({ name: '', part: '', price: '', menu: '', category: '', image: '' })

  // Edit modal state
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPart, setEditPart] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editErrors, setEditErrors] = useState({ part: '', menu: '', category: '', image: '' })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchProducts() }, [])

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch('/api/menus')
        const data = await res.json()
        setMenuOptions(Array.isArray(data) ? data : [])
      } catch (_) {}
    }
    fetchMenus()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      if (!menu || menu === 'uncategorized') { setCategoryOptions([]); setCategory(''); return }
      try {
        const res = await fetch(`/api/menus/${menu}/categories`)
        const data = await res.json()
        setCategoryOptions(Array.isArray(data) ? data : [])
        if (!data.find(c => c.slug === category)) setCategory('')
      } catch (_) { setCategoryOptions([]) }
    }
    fetchCategories()
  }, [menu])

  const validateForm = () => {
    const { ok, errors } = validateCreate({ name, part, price, menu, category, imageFile }, products)
    setCreateErrors(errors)
    return ok
  }

  const openCreateModal = () => {
    setName('')
    setPart('')
    setPrice('')
    setDescription('')
    setImageUrl('')
    setImageFile(null)
    setMenu('uncategorized')
    setCategory('')
    setCategoryOptions([])
    setCreateErrors({ name: '', part: '', price: '', menu: '', category: '', image: '' })
    setShowCreate(true)
  }

  const closeCreateModal = () => {
    setShowCreate(false)
    setCreateErrors({ name: '', part: '', price: '', menu: '', category: '', image: '' })
  }

  const uploadImage = async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}`
      },
      body: fd
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || 'Upload failed')
    }
    const data = await res.json()
    return data.url
  }

  const onCreate = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      setLoading(true)
      let finalImageUrl = imageUrl
      if (imageFile) {
        try {
          finalImageUrl = await uploadImage(imageFile)
        } catch (err) {
          toast.error(err.message)
          setLoading(false)
          return
        }
      }
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({ name, part, price: Number(price), description, imageUrl: finalImageUrl, menu, category })
      })
      if (res.status === 201) {
        toast.success('Product created')
        setName(''); setPart(''); setPrice(''); setDescription(''); setImageUrl(''); setImageFile(null); setMenu('uncategorized'); setCategory(''); setCategoryOptions([])
        fetchProducts()
        setShowCreate(false)
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
    if (!window.confirm('Delete this product?')) return
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}` }
      })
      if (res.status === 204) {
        toast.success('Product deleted')
        setProducts(prev => prev.filter(p => p.id !== id))
      } else if (res.status === 401) {
        toast.error('Unauthorized. Please login as admin again.')
        navigate('/login')
      } else {
        const body = await res.json().catch(() => ({}))
        toast.error(body.message || 'Delete failed')
      }
    } catch (e) {
      toast.error('Network error')
    } finally { setLoading(false) }
  }

  const openEdit = (product) => {
    setEditing(product)
    setEditName(product.name || '')
    setEditPart(product.part || '')
    setEditPrice(String(product.price ?? ''))
    setEditDescription(product.description || '')
    setEditImageUrl(product.imageUrl || '')
    setEditErrors({ part: '', menu: '', category: '', image: '' })
    if (product.menu && product.menu !== 'uncategorized') {
      fetch(`/api/menus/${product.menu}/categories`).then(r => r.json()).then(data => {
        setCategoryOptions(Array.isArray(data) ? data : [])
      }).catch(() => setCategoryOptions([]))
    } else {
      setCategoryOptions([])
    }
  }

  useEffect(() => {
    if (editing && editing.menu && editing.menu !== 'uncategorized') {
      fetch(`/api/menus/${editing.menu}/categories`).then(r => r.json()).then(data => {
        setCategoryOptions(Array.isArray(data) ? data : [])
        if (!data.find(c => c.slug === (editing.category || ''))) {
          setEditing({ ...editing, category: '' })
        }
      }).catch(() => setCategoryOptions([]))
    } else if (editing) {
      setCategoryOptions([])
      setEditing({ ...editing, category: '' })
    }
  }, [editing?.menu])

  const onUpdate = async (e) => {
    e.preventDefault()
    if (!editing) return
    const priceNum = Number(editPrice)
    if (!editName.trim()) { toast.error('Name is required'); return }
    if (!editPart.trim()) { toast.error('Part is required'); setEditErrors(prev => ({ ...prev, part: 'Part is required' })); return }
    const partNorm = editPart.trim().toLowerCase()
    if (partNorm && products.some(prod => prod.id !== editing.id && String(prod.part || '').trim().toLowerCase() === partNorm)) {
      setEditErrors(prev => ({ ...prev, part: 'Part already exists' }))
      toast.error('Part already exists')
      return
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) { toast.error('Price must be a positive number'); return }
    if (!editing.menu || editing.menu === 'uncategorized') { setEditErrors(prev => ({ ...prev, menu: 'Menu is required' })); toast.error('Menu is required'); return }
    if (!editing.category) { setEditErrors(prev => ({ ...prev, category: 'Category is required' })); toast.error('Category is required'); return }
    try {
      setLoading(true)
      let finalEditImageUrl = editImageUrl
      if (editing._newImageFile) {
        try {
          finalEditImageUrl = await uploadImage(editing._newImageFile)
        } catch (err) {
          toast.error(err.message)
          setLoading(false)
          return
        }
      }
      if (!finalEditImageUrl) {
        setEditErrors(prev => ({ ...prev, image: 'Image is required' }))
        toast.error('Image is required')
        setLoading(false)
        return
      }
      const res = await fetch(`/api/admin/products/${editing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          name: editName,
          part: editPart,
          price: priceNum,
          description: editDescription,
          imageUrl: finalEditImageUrl,
          menu: editing.menu,
          category: editing.category
        })
      })
      if (res.ok) {
        const updated = await res.json()
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
        toast.success('Product updated')
        setEditing(null)
      } else if (res.status === 401) {
        toast.error('Unauthorized. Please login as admin again.')
        navigate('/login')
      } else {
        const body = await res.json().catch(() => ({}))
        toast.error(body.message || 'Update failed')
      }
    } catch (err) {
      toast.error('Network error')
    } finally { setLoading(false) }
  }

  if (!isAdmin) {
    return (
      <div className="container my-3 py-3">
        <h2>Admin Products</h2>
        <div className="alert alert-warning">You must be logged in as an admin to manage products.</div>
      </div>
    )
  }

  return (
    <div className="container my-3 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Manage Products</h2>
        <div>
          {error && <span className="me-3 text-danger">{error}</span>}
          <button className="btn btn-primary" onClick={openCreateModal} disabled={loading}>Create Product</button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Part</th>
              <th scope="col">Price</th>
              <th scope="col">Image</th>
              <th scope="col">Menu</th>
              <th scope="col">Category</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} scope="row">
                <td>{p.id}</td>
                <td className='text-wrap'>{p.name}</td>
                <td>{p.part}</td>
                <td>{p.price}</td>
                <td>{p.imageUrl ? (<img src={p.imageUrl} alt={p.name} style={{maxWidth:'80px'}} />) : ''}</td>
                <td>{p.menu || 'uncategorized'}</td>
                <td>{p.category || ''}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => openEdit(p)} disabled={loading}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(p.id)} disabled={loading}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && products.length === 0 && (
              <tr scope="row"><td colSpan={5} className="text-center">No products</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product #{editing.id}</h5>
                <button type="button" className="btn-close" onClick={() => setEditing(null)} aria-label="Close"></button>
              </div>
              <form onSubmit={onUpdate}>
                <div className="modal-body">
                  <ProductForm
                    mode="edit"
                    values={{
                      name: editName,
                      part: editPart,
                      price: editPrice,
                      description: editDescription,
                      imageUrl: editImageUrl,
                      menu: editing.menu,
                      category: editing.category,
                    }}
                    errors={editErrors}
                    menuOptions={menuOptions}
                    categoryOptions={categoryOptions}
                    onNameChange={setEditName}
                    onPartChange={(val)=>{ setEditPart(val); if (editErrors.part) setEditErrors({ ...editErrors, part: '' }) }}
                    onPriceChange={setEditPrice}
                    onDescriptionChange={setEditDescription}
                    onMenuChange={(val)=>setEditing({ ...editing, menu: val })}
                    onCategoryChange={(val)=>setEditing({ ...editing, category: val })}
                    onImageFileChange={(file)=>setEditing({ ...editing, _newImageFile: file })}
                    onImageUrlChange={setEditImageUrl}
                    disableCategory={!editing.menu || editing.menu === 'uncategorized'}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)} disabled={loading}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Product</h5>
                <button type="button" className="btn-close" onClick={closeCreateModal} aria-label="Close"></button>
              </div>
              <form onSubmit={onCreate}>
                <div className="modal-body">
                  <ProductForm
                    mode="create"
                    values={{
                      name,
                      part,
                      price,
                      description,
                      imageUrl,
                      menu,
                      category,
                    }}
                    errors={createErrors}
                    menuOptions={menuOptions}
                    categoryOptions={categoryOptions}
                    onNameChange={setName}
                    onPartChange={setPart}
                    onPriceChange={setPrice}
                    onDescriptionChange={setDescription}
                    onMenuChange={(val)=>setMenu(val)}
                    onCategoryChange={(val)=>setCategory(val)}
                    onImageFileChange={(file)=>setImageFile(file)}
                    disableCategory={!menu || menu === 'uncategorized'}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeCreateModal} disabled={loading}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
