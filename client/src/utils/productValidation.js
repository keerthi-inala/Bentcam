export function validateCreate({ name, part, price, menu, category, imageFile }, products = []) {
  const errors = { name: '', part: '', price: '', menu: '', category: '', image: '' }
  let ok = true
  if (!String(name || '').trim()) { errors.name = 'Name is required'; ok = false }
  if (!String(part || '').trim()) { errors.part = 'Part is required'; ok = false }
  const pNum = Number(price)
  if (!Number.isFinite(pNum) || pNum <= 0) { errors.price = 'Price must be a positive number'; ok = false }
  const partNorm = String(part || '').trim().toLowerCase()
  if (partNorm && products.some(prod => String(prod.part || '').trim().toLowerCase() === partNorm)) { errors.part = 'Part already exists'; ok = false }
  if (!menu || menu === 'uncategorized') { errors.menu = 'Menu is required'; ok = false }
  if (!category) { errors.category = 'Category is required'; ok = false }
  if (!imageFile) { errors.image = 'Image is required'; ok = false }
  return { ok, errors }
}
