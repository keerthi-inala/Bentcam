import React from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
 
import categoryData from '../data/featuredProducts'
import { categoryMap } from '../data/categoryMapping'

const CategoryDetail = () => {
    const { category } = useParams()
    const navigate = useNavigate()
    
    // Convert slug to actual category name
    const categoryName = categoryMap[category] || category
    const data = categoryData[categoryName] || {
        title: categoryName || 'Category',
        icon: 'fa-box',
        description: 'Explore our wide range of quality components and parts.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
        breadcrumb: categoryName || 'Category',
        productCount: 5,
        products: []
    }
    
    // Removed unused subcategoriesMap
    
    // Removed unused subcategories and handleSubcategoryClick
    // Removed unused subcategories and handleSubcategoryClick
    return (
        <>
            <div className="container my-4">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><NavLink to="/" className="text-primary">Home</NavLink></li>
                        <li className="breadcrumb-item active" aria-current="page">{data.breadcrumb}</li>
                    </ol>
                </nav>

                {/* Main Content */}
                <div className="row align-items-center g-4 mb-5">
                    {/* Left Column: Title & Description */}
                    <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                            <i className={`fa ${data.icon} fs-1 me-3 text-primary`}></i>
                            <h1 className="mb-0">{data.title}</h1>
                        </div>
                        <p className="text-muted lead" style={{ lineHeight: 1.8 }}>
                            {data.description}
                        </p>
                        
                    </div>

                    {/* Right Column: Hero Image */}
                    <div className="col-md-6">
                        <div className="rounded" style={{ overflow: 'hidden', height: 400 }}>
                            <img
                                src={data.image}
                                alt={data.title}
                                className="img-fluid"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Featured Products Section */}
                <div className="py-5 mb-5">
                    <h2 className="fw-bold mb-5">Featured Products</h2>
                    <div className="d-flex justify-content-between mb-4">
                        {/* Dynamic Product Cards based on Category */}
                        {data.products && data.products.map((product) => (
                            <div key={product.id} >
                                <button
                                    onClick={() => navigate(`/category/${category}/${product.name}`)}
                                    className="btn border-0 bg-transparent p-0 w-100 text-decoration-none"
                                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-img-top bg-light" style={{ height: '220px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                                            <img 
                                                src={product.categoryImage} 
                                                alt={product.name} 
                                                className="img-fluid" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            />
                                        </div>
                                        <div className="card-body text-center p-3">
                                            <h6 className="card-title fw-semibold text-dark">{product.name}</h6>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <NavLink to="/product" className="btn btn-primary btn-lg">
                            View All ({data.productCount})
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoryDetail
