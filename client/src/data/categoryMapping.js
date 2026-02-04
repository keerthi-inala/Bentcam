// Slug to category name mapping
export const categoryMap = {
    'motors-components': 'Motors & Components',
    'controls-electrical': 'Controls & Electrical',
    'doors-glass-components': 'Doors, Glass & Components',
    'hardware-fittings': 'Hardware & Fittings',
    'panels-trim': 'Panels & Trim',
    'pans-racks': 'Pans & Racks',
    'refrigeration-air-handling': 'Refrigeration & Air-Handling'
};

// Reverse mapping: category name to slug
export const categorySlugMap = Object.entries(categoryMap).reduce((acc, [slug, name]) => {
    acc[name] = slug;
    return acc;
}, {});
