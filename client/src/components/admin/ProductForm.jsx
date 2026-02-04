import React from 'react'

const ProductForm = ({
  mode = 'create',
  values,
  errors = {},
  menuOptions = [],
  categoryOptions = [],
  onNameChange,
  onPartChange,
  onPriceChange,
  onDescriptionChange,
  onMenuChange,
  onCategoryChange,
  onImageFileChange,
  onImageUrlChange,
  disableCategory = false,
}) => {
  const isEdit = mode === 'edit'
  return (
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label" htmlFor="product-name">Name*</label>
        <input id="product-name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={values.name} onChange={e=>onNameChange(e.target.value)} required />
        {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
        <div className="form-text">Required</div>
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor="product-part">Part*</label>
        <input id="product-part" className={`form-control ${errors.part ? 'is-invalid' : ''}`} value={values.part} onChange={e=>onPartChange(e.target.value)} required />
        {errors.part && (<div className="invalid-feedback">{errors.part}</div>)}
        <div className="form-text">Required and unique</div>
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor="product-price">Price*</label>
        <input id="product-price" type="number" step="0.01" className={`form-control ${errors.price ? 'is-invalid' : ''}`} value={values.price} onChange={e=>onPriceChange(e.target.value)} required />
        {errors.price && (<div className="invalid-feedback">{errors.price}</div>)}
        <div className="form-text">Required; positive number</div>
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor="product-menu">Menu*</label>
        <select id="product-menu" className={`form-select ${errors.menu ? 'is-invalid' : ''}`} value={values.menu || 'uncategorized'} onChange={e=>onMenuChange(e.target.value)}>
          {menuOptions.map(opt => (
            <option key={opt.id} value={opt.slug}>{opt.name}</option>
          ))}
          <option value="uncategorized">Uncategorized</option>
        </select>
        {errors.menu && (<div className="invalid-feedback">{errors.menu}</div>)}
        <div className="form-text">Required; select a menu</div>
      </div>
      <div className="col-md-6">
        <label className="form-label" htmlFor="product-category">Category*</label>
        <select id="product-category" className={`form-select ${errors.category ? 'is-invalid' : ''}`} value={values.category || ''} onChange={e=>onCategoryChange(e.target.value)} disabled={disableCategory}>
          <option value="">(none)</option>
          {categoryOptions.map(opt => (
            <option key={opt.id} value={opt.slug}>{opt.name}</option>
          ))}
        </select>
        {errors.category && (<div className="invalid-feedback">{errors.category}</div>)}
        <div className="form-text">Required; available after selecting a menu</div>
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor="product-image-file">Image*</label>
        <input id="product-image-file" type="file" className={`form-control ${errors.image ? 'is-invalid' : ''}`} accept="image/*" onChange={e=>onImageFileChange(e.target.files?.[0] || null)} />
        {isEdit && (
          <>
            {values.imageUrl && (<div className="mt-1"><img src={values.imageUrl} alt="current" style={{maxWidth:'120px'}} /></div>)}
            <input id="product-image-url" className={`form-control mt-2 ${errors.image ? 'is-invalid' : ''}`} placeholder="or paste image URL" value={values.imageUrl || ''} onChange={e=>onImageUrlChange?.(e.target.value)} />
          </>
        )}
        {errors.image && (<div className="invalid-feedback d-block">{errors.image}</div>)}
        <div className="form-text">{isEdit ? 'Required; upload a file or paste an image URL' : 'Required; upload a product image'}</div>
      </div>
      <div className="col-12">
        <label className="form-label" htmlFor="product-description">Description</label>
        <textarea id="product-description" className="form-control" value={values.description || ''} onChange={e=>onDescriptionChange(e.target.value)} />
        <div className="form-text">Optional</div>
      </div>
    </div>
  )
}

export default ProductForm
