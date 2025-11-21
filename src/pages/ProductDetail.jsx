import React, { useState, useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { categoryMap } from '../data/categoryMapping'
import categoryData from '../data/featuredProducts'
import { Tooltip } from 'bootstrap'
import '../scss/productDetail.css'
import { useDispatch } from 'react-redux'
import { addCart } from '../redux/action'

const ProductDetail = () => {

    const { category, productName } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const decodedProductName = decodeURIComponent(productName)
    const categoryName = categoryMap[category] || category
    const categoryInfo = categoryData[categoryName]
    
    // Extract base product name and index (e.g., "Motor 1" -> "Motor", index: 1)
    const match = decodedProductName.match(/^(.+?)\s+(\d+)$/)
    const baseProductName = match ? match[1] : decodedProductName
    const productIndex = match ? parseInt(match[2]) - 1 : 0
    const baseProduct = categoryInfo?.products.find(p => p.name === baseProductName)
    
    // Get image from featuredProducts with fallback to category image
    const productImage = baseProduct?.image || baseProduct?.categoryImage || '/assets/products/motors/motor_spinset.jpg'
    
    // Calculate part number based on product index
    const calculatedPartNumber = `${productIndex + 1000}920`
    // Calculate replaces part number to mirror CategoryProducts pattern
    const calculatedReplacesPart = `30${productIndex}945`

    const productDetails = {
        partNumber: calculatedPartNumber,
        title: `${decodedProductName} Walk-in Cooler Evaporator Motor 39 watt,115/208-230V,1 phase,1475/750 2 speed,CW rotation,horizontal mounting`,
        price: 225.00,
        listPrice: 225.00,
        inStock: true,
        availability: 55,
        replacesPartNumber: calculatedReplacesPart,
        specifications: {
            'OEM Compatibility': 'BentCam',
            'Input Voltage': '115/208-230',
            'Mounting': 'Horizontal',
            'Rotation': 'CW',
            'Speed': '1475/750 rpm',
            'Wattage': '39',
            'Type': '1 phase',
            'Equipment Type': 'Walk-in Cooler',
            'UOM': 'EA'
        },
        dimensions: {
            'Length': '10 inch',
            'Width': '10 inch',
            'Height': '7 inch',
            'Weight': '2.5 lbs'
        }
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

    return (
        <>
            <div className="container py-4">

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><NavLink to="/" className="text-primary">Home</NavLink></li>
                        <li className="breadcrumb-item"><NavLink to={`/category/${category}`} className="text-primary">{categoryName}</NavLink></li>
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
                                        src={productImage}
                                        className="img-fluid product-img"
                                        alt={productDetails.title}
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
                            <p className="part-number">Part #{productDetails.partNumber}</p>

                            <h4 className="main-title">{productDetails.title}</h4>

                            <hr className="title-divider" />

                            <p className="replace-label">Replaces Part(s)</p>
                            <p className="replace-value">{productDetails.replacesPartNumber}</p>
                        </div>

                        {/* RIGHT CARD */}
                        <div className="col-lg-3">
                            <div className="right-card">

                                <div className="right-card-header">
                                    <span>List Price:</span>
                                    <span>${productDetails.listPrice.toFixed(2)} ea</span>
                                </div>

                                <div className="right-card-body">
                                    <div className="d-flex justify-content-between align-items-center pb-3">
                                        <p className="signin-text">Sign In for<br />your price</p>

                                        <h4 className="price-text">
                                            ${productDetails.price.toFixed(2)} <span>ea</span>
                                        </h4>
                                    </div>

                                    {/* Stock */}
                                    <div className="stock-row">
                                        <span className="stock-badge">In Stock</span>
                                        <span className="stock-number">{productDetails.availability}</span>
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
                                            const productForCart = {
                                                id: `pd:${category}:${baseProductName}:${productIndex+1}`,
                                                title: decodedProductName,
                                                price: productDetails.price,
                                                image: productImage || '../../assets/products/motor_spinset.jpg'
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
                                        {Object.entries(productDetails.specifications).map((spec, idx) => (
                                            <div key={idx} className="col-md-6 col-lg-4 mb-4">
                                                <p className="text-muted small fw-semibold mb-1">{spec[0]}</p>
                                                <p className="fw-semibold text-dark">{spec[1]}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'dimensions' && (
                                    <div className="row">
                                        {Object.entries(productDetails.dimensions).map((dim, idx) => (
                                            <div key={idx} className="col-md-6 col-lg-4 mb-4">
                                                <p className="text-muted small fw-semibold mb-1">{dim[0]}</p>
                                                <p className="fw-semibold text-dark">{dim[1]}</p>
                                            </div>
                                        ))}
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
