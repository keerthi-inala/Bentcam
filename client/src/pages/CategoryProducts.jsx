import React, { useEffect, useState } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addCart } from '../redux/action'

const CategoryProducts = () => {
    const { category, subcategory } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const decodedSubcategory = subcategory ? decodeURIComponent(subcategory) : ''
    const menuSlug = category
    const categorySlug = subcategory || ''
    const [products, setProducts] = useState([])
    
    const buildImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&q=80'
        if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`
        return url
    }
    
    // State for filters
    const [expandedFilters, setExpandedFilters] = useState({})
    const [viewType, setViewType] = useState('grid') // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('relevance')
    
    // Toggle filter sections
    const toggleFilter = (filterName) => {
        setExpandedFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }))
    }
    
    const filters = [
        { name: 'Item Mounting', icon: '+' },
        { name: 'Blade Count', icon: '+' },
        { name: 'Type', icon: '+' },
        { name: 'Wattage', icon: '+' },
        { name: 'Input Voltage', icon: '+' }
    ]

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/products')
                const data = await res.json()
                const arr = Array.isArray(data) ? data : []
                const filtered = arr.filter(p => p.menu === menuSlug && (!categorySlug || (p.category || '') === categorySlug))
                setProducts(filtered)
            } catch (_) {
                setProducts([])
            }
        }
        load()
    }, [menuSlug, categorySlug])
    
    return (
        <>
            <div className="container-fluid py-4">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><NavLink to="/" className="text-primary">Home</NavLink></li>
                        <li className="breadcrumb-item"><NavLink to={`/category/${menuSlug}`} className="text-primary">{menuSlug}</NavLink></li>
                        {categorySlug && (<li className="breadcrumb-item active" aria-current="page">{decodedSubcategory}</li>)}
                    </ol>
                </nav>

                <div className="row">
                    {/* Left Sidebar - Filters */}
                    <div className="col-lg-3 col-md-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0">Filters</h5>
                                    <button className="text-muted small btn btn-link p-0" type="button" aria-label="Clear Filter">Clear</button>
                                </div>
                                
                                {/* Filter Sections */}
                                {filters.map(filter => (
                                    <div key={filter.name} className="border-bottom py-3">
                                        <button 
                                            className="btn btn-link p-0 w-100 d-flex justify-content-between align-items-center text-dark text-decoration-none fw-semibold"
                                            onClick={() => toggleFilter(filter.name)}
                                            style={{ fontSize: '0.95rem' }}
                                        >
                                            <span>{filter.name}</span>
                                            <span>{expandedFilters[filter.name] ? '−' : '+'}</span>
                                        </button>
                                        
                                        {expandedFilters[filter.name] && (
                                            <div className="mt-2 small">
                                                <div className="form-check mb-2">
                                                    <input type="checkbox" className="form-check-input" id={`${filter.name}-1`} />
                                                    <label className="form-check-label" htmlFor={`${filter.name}-1`}>
                                                        Option 1
                                                    </label>
                                                </div>
                                                <div className="form-check mb-2">
                                                    <input type="checkbox" className="form-check-input" id={`${filter.name}-2`} />
                                                    <label className="form-check-label" htmlFor={`${filter.name}-2`}>
                                                        Option 2
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" id={`${filter.name}-3`} />
                                                    <label className="form-check-label" htmlFor={`${filter.name}-3`}>
                                                        Option 3
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Products */}
                    <div className="col-lg-9 col-md-8">
                        {/* Header with Results Count and Sort */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="fw-bold mb-0">
                                    {products.length} Results{categorySlug ? (<span> for <span className="text-dark">{decodedSubcategory}</span></span>) : ''}
                                </h4>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div>
                                    <label className="me-2 small">Sort By:</label>
                                    <select 
                                        className="form-select form-select-sm d-inline-block w-auto"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="newest">Newest</option>
                                    </select>
                                </div>
                                
                                {/* View Toggle */}
                                <div className="btn-group" role="group">
                                    <button 
                                        type="button" 
                                        className={`btn btn-sm ${viewType === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setViewType('grid')}
                                        title="Grid View"
                                    >
                                        <i className="fa fa-th"></i>
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`btn btn-sm ${viewType === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setViewType('list')}
                                        title="List View"
                                    >
                                        <i className="fa fa-list"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        {viewType === 'grid' ? (
                            <div className="row g-3">
                                {products.map(product => (
                                    <div key={product.id} className="col-lg-6 col-xl-4">
                                        <button
                                            onClick={() => navigate(`/product/${menuSlug}/${product.id}`)}
                                            className="btn border-0 bg-transparent p-0 w-100 text-decoration-none text-start"
                                            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div className="card border-0 shadow-sm h-100">
                                                <div style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                                                    <img 
                                                        src={buildImageUrl(product.imageUrl)} 
                                                        alt={product.name}
                                                        className="card-img-top"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div className="card-body d-flex flex-column">
                                                    <p className="text-muted small mb-1">Part #{product.part}</p>
                                                    <h6 className="card-title fw-semibold mb-2 text-dark">{product.name}</h6>
                                                    <h5 className="text-primary fw-bold mb-3">${Number(product.price).toFixed(2)}</h5>
                                                    <button 
                                                        className="btn btn-outline-primary mt-auto"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            const productForCart = {
                                                                id: `${menuSlug}:${categorySlug}:${product.id}`,
                                                                title: product.name,
                                                                price: Number(product.price),
                                                                image: product.imageUrl
                                                            }
                                                            dispatch(addCart(productForCart))
                                                            navigate('/cart')
                                                        }}
                                                    >
                                                        Add to cart
                                                    </button>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-3">
                                {products.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => navigate(`/product/${menuSlug}/${product.id}`)}
                                        className="btn border-0 bg-transparent p-0 w-100 text-decoration-none text-start"
                                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    >
                                        <div className="card border-0 shadow-sm mb-3">
                                            <div className="row g-0">
                                                <div className="col-md-3">
                                                    <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                                                            <img 
                                                            src={buildImageUrl(product.imageUrl)} 
                                                            alt={product.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-9">
                                                    <div className="card-body d-flex justify-content-between align-items-start">
                                                        <div className="flex-grow-1">
                                                            <p className="text-muted small mb-1">Part #{product.part}</p>
                                                            <h6 className="card-title fw-semibold mb-2 text-dark">{product.name}</h6>
                                                        </div>
                                                        <div className="text-end ms-3">
                                                            <h5 className="text-primary fw-bold mb-3">${Number(product.price).toFixed(2)}</h5>
                                                            <button 
                                                                className="btn btn-outline-primary btn-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    const productForCart = {
                                                                        id: `${menuSlug}:${categorySlug}:${product.id}`,
                                                                        title: product.name,
                                                                        price: Number(product.price),
                                                                        image: product.imageUrl
                                                                    }
                                                                    dispatch(addCart(productForCart))
                                                                    navigate('/cart')
                                                                }}
                                                            >
                                                                Add to cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoryProducts
