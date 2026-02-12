import React, { useState, useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { Tooltip } from 'bootstrap'
import '../scss/productDetail.css'
import { useDispatch } from 'react-redux'
import { addCart } from '../redux/action'

const ProductDetail = () => {
    const { category, productName } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [product, setProduct] = useState(null)
    // Removed unused loading state
    const decodedProductName = decodeURIComponent(productName)
    const isNumericId = /^[0-9]+$/.test(decodedProductName)

    const buildImageUrl = (url) => {
        if (!url) return '/assets/products/motors/motor_spinset.jpg'
        if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`
        return url
    }

    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('specifications')

    const handleQuantityChange = (value) => {
        const newQty = Math.max(1, quantity + value)
        setQuantity(newQty)
    }

    // ⭐ FIXED TOOLTIP INITIALIZATION ⭐
    useEffect(() => {
        const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipElements.forEach(el => new Tooltip(el));
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                if (isNumericId) {
                    const res = await fetch(`/api/products/${decodedProductName}`)
                    if (res.ok) {
                        const data = await res.json()
                        setProduct(data)
                    } else {
                        setProduct(null)
                    }
                } else {
                    const res = await fetch('/api/products')
                    const arr = await res.json()
                    const found = (Array.isArray(arr) ? arr : []).find(p => (p.menu === category) && (p.name === decodedProductName))
                    setProduct(found || null)
                }
            } catch (_) { setProduct(null) }
            finally { setLoading(false) }
        }
        load()
    }, [decodedProductName, category, isNumericId])

    return (
        <>
            <div className="container py-4">

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><NavLink to="/" className="text-primary">Home</NavLink></li>
                        <li className="breadcrumb-item"><NavLink to={`/category/${category}`} className="text-primary">{category}</NavLink></li>
                        <li className="breadcrumb-item active" aria-current="page">{decodedProductName}</li>
                    </ol>
                </nav>

                {/* ⭐⭐⭐ PRODUCT PAGE TOP SECTION ⭐⭐⭐ */}
                <div className="product-page-wrapper">
                    <div className="row gx-5">

                        {/* LEFT IMAGE BOX */}
                        <div className="col-lg-4">
                            <div className="image-card">
                                <div className="image-inner">

                                    <img
                                        src={buildImageUrl(product?.imageUrl)}
                                        className="img-fluid product-img"
                                        alt={(product && product.name) || decodedProductName}
                                    />

                                    {/* <button className="expand-btn">
                                        <i className="fa fa-arrows text-muted"></i>
                                    </button> */}

                                    {/* <div className="drag-spin-text">
                                        Drag to spin
                                    </div> */}

                                </div>
                            </div>
                        </div>

                        {/* MIDDLE DETAILS */}
                        <div className="col-lg-5 middle-col">
                            <p className="part-number">Part #{(product && product.part) || '-'}</p>

                            <h4 className="main-title">{(product && product.name) || decodedProductName}</h4>

                            <hr className="title-divider" />
                            {/* Optional: could render description here */}
                            <p className="text-muted">{product?.description}</p>
                        </div>

                        {/* RIGHT CARD */}
                        <div className="col-lg-3">
                            <div className="right-card">

                                <div className="right-card-header">
                                    <span>List Price:</span>
                                    <span>${product ? Number(product.price).toFixed(2) : '0.00'} ea</span>
                                </div>

                                <div className="right-card-body">
                                    <div className="d-flex justify-content-between align-items-center pb-3">
                                        <p className="signin-text">Sign In for<br />your price</p>

                                        <h4 className="price-text">
                                            ${product ? Number(product.price).toFixed(2) : '0.00'} <span>ea</span>
                                        </h4>
                                    </div>

                                    {/* Stock */}
                                    <div className="stock-row">
                                        <span className="stock-badge">In Stock</span>
                                        {/* Availability count not in backend Product; omit */}
                                        <div className='d-flex align-items-center'>
                                            <span className="stock-label pe-2">Available</span>

                                            {/* ⭐ FIXED TOOLTIP ICON ⭐ */}
                                            <i
                                                className="fa fa-info-circle info-icon"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                title="Availability is updated hourly and may change based on orders placed throughout the day."
                                            ></i>
                                        </div>

                                    </div>

                                    {/* Quantity */}
                                    <div className="d-flex justify-content-between align-items-center pb-3">
                                        <p className="quantity-label">Quantity</p>
                                        <div className="quantity-row">
                                            <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>−</button>
                                            <input readOnly className="qty-input" value={quantity} />
                                            <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                                        </div>
                                    </div>

                                    <p className="shipping-text">
                                        <i className="fa fa-truck me-2"></i>
                                        Ships in <strong>1–2 business days.</strong>
                                    </p>

                                    <button 
                                        className="add-cart-btn"
                                        onClick={() => {
                                            if (!product) return
                                            const productForCart = {
                                                id: `pd:${category}:${product.id}`,
                                                title: product.name,
                                                price: Number(product.price),
                                                image: product.imageUrl || '../../assets/products/motor_spinset.jpg'
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

                {/* Specs & Dimensions */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">

                                <ul className="nav nav-tabs mb-4 border-0" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link text-dark fw-semibold ${activeTab === 'specifications' ? 'active border-primary' : ''}`}
                                            onClick={() => setActiveTab('specifications')}
                                            style={{ borderBottom: activeTab === 'specifications' ? '3px solid #0d6efd' : 'none' }}
                                        >
                                            Specifications
                                        </button>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link text-dark fw-semibold ${activeTab === 'dimensions' ? 'active border-primary' : ''}`}
                                            onClick={() => setActiveTab('dimensions')}
                                            style={{ borderBottom: activeTab === 'dimensions' ? '3px solid #0d6efd' : 'none' }}
                                        >
                                            Dimensions
                                        </button>
                                    </li>
                                </ul>

                                {activeTab === 'specifications' && (
                                    <div className="row">
                                        <div className="col-md-6 col-lg-4 mb-4">
                                            <p className="text-muted small fw-semibold mb-1">Menu</p>
                                            <p className="fw-semibold text-dark">{product?.menu}</p>
                                        </div>
                                        <div className="col-md-6 col-lg-4 mb-4">
                                            <p className="text-muted small fw-semibold mb-1">Category</p>
                                            <p className="fw-semibold text-dark">{product?.category || '(none)'}</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'dimensions' && (
                                    <div className="row">
                                        <div className="col-md-6 col-lg-4 mb-4">
                                            <p className="text-muted small fw-semibold mb-1">Description</p>
                                            <p className="fw-semibold text-dark">{product?.description || '-'}</p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}

export default ProductDetail
