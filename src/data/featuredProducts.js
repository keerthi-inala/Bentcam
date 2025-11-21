// Featured products data organized by category
const categoryData = {
    'Motors & Components': {
        title: 'Motors & Components',
        icon: 'fa-cogs',
        description: 'Motors and components to keep your coolers, freezers and systems running at peak performance. Trusted by leading technicians—when it comes to keeping things cold, every part matters.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
        breadcrumb: 'Motors & Components',
        productCount: 21,
        products: [
            { id: 1, name: 'Motor', categoryImage: '/assets/categories/motor.avif', image: '/assets/products/motors/motor_spinset.jpg' },
            { id: 2, name: 'Motor Assy', categoryImage: '/assets/categories/motorassy.avif', image: '/assets/categories/motorassy.avif' },
            { id: 3, name: 'Fan Blade', categoryImage: '/assets/categories/fanblade.avif', image: '/assets/categories/fanblade.avif' },
            { id: 4, name: 'Bracket-Motor', categoryImage: '/assets/categories/bracket-motor.avif', image: '/assets/categories/bracket-motor.avif' },
            { id: 5, name: 'Guard', categoryImage: '/assets/categories/guard.avif', image: '/assets/categories/guard.avif' }
        ]
    },
    'Controls & Electrical': {
        title: 'Controls & Electrical',
        icon: 'fa-plug',
        description: 'High-quality electrical controls and components for refrigeration systems. Ensure reliable operation and precise temperature management.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
        breadcrumb: 'Controls & Electrical',
        productCount: 15,
        products: [
            { id: 1, name: 'Relay Switch', image: 'https://images.unsplash.com/photo-1581092160562-40038f88f313?w=300&q=80' },
            { id: 2, name: 'Sensor Unit', image: 'https://images.unsplash.com/photo-1518694712202-898f7a7a8e6f?w=300&q=80' },
            { id: 3, name: 'Controller', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0d2?w=300&q=80' },
            { id: 4, name: 'LED Display', image: 'https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=300&q=80' },
            { id: 5, name: 'Power Supply', image: 'https://images.unsplash.com/photo-1581092161562-40038f88f314?w=300&q=80' }
        ]
    },
    'Doors, Glass & Components': {
        title: 'Doors, Glass & Components',
        icon: 'fa-door-open',
        description: 'Premium door and glass solutions for commercial refrigeration. Built for durability and performance in demanding environments.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
        breadcrumb: 'Doors, Glass & Components',
        productCount: 18,
        products: [
            { id: 1, name: 'Door Frame', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80' },
            { id: 2, name: 'Glass Panel', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&q=80' },
            { id: 3, name: 'Door Handle', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef15?w=300&q=80' },
            { id: 4, name: 'Gasket Seal', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0d3?w=300&q=80' },
            { id: 5, name: 'Hinge Assembly', image: 'https://images.unsplash.com/photo-1581092160562-40038f88f315?w=300&q=80' }
        ]
    },
    'Hardware & Fittings': {
        title: 'Hardware & Fittings',
        icon: 'fa-wrench',
        description: 'Essential hardware and fittings for refrigeration systems. Quality components that ensure proper assembly and long-term reliability.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
        breadcrumb: 'Hardware & Fittings',
        productCount: 24,
        products: [
            { id: 1, name: 'Adapter', image: 'https://images.unsplash.com/photo-1581092160562-40038f88f316?w=300&q=80' },
            { id: 2, name: 'Bearing', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0d4?w=300&q=80' },
            { id: 3, name: 'Bolt Set', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3790?w=300&q=80' },
            { id: 4, name: 'Bracket', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b62?w=300&q=80' },
            { id: 5, name: 'Fastener Kit', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0d5?w=300&q=80' }
        ]
    },
    'Panels & Trim': {
        title: 'Panels & Trim',
        icon: 'fa-th-large',
        description: 'Protective panels and trim components for commercial refrigeration units. Maintain appearance and functionality.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
        breadcrumb: 'Panels & Trim',
        productCount: 12,
        products: [
            { id: 1, name: 'Side Panel', image: 'https://images.unsplash.com/photo-1581092160562-40038f88f317?w=300&q=80' },
            { id: 2, name: 'Top Trim', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0d6?w=300&q=80' },
            { id: 3, name: 'Bottom Panel', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3791?w=300&q=80' },
            { id: 4, name: 'Trim Strip', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b63?w=300&q=80' },
            { id: 5, name: 'Edge Guard', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0d7?w=300&q=80' }
        ]
    },
    'Pans & Racks': {
        title: 'Pans & Racks',
        icon: 'fa-archive',
        description: 'Storage and display solutions for refrigerated products. Maximize space and organization.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
        breadcrumb: 'Pans & Racks',
        productCount: 10,
        products: [
            { id: 1, name: 'Refrigeration Pan', image: 'https://images.unsplash.com/photo-1581092160562-40038f88f318?w=300&q=80' },
            { id: 2, name: 'Wire Rack', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0d8?w=300&q=80' },
            { id: 3, name: 'Food Pan', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3792?w=300&q=80' },
            { id: 4, name: 'Shelf Rack', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b64?w=300&q=80' },
            { id: 5, name: 'Storage Bin', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0d9?w=300&q=80' }
        ]
    },
    'Refrigeration & Air-Handling': {
        title: 'Refrigeration & Air-Handling',
        icon: 'fa-snowflake',
        description: 'Complete refrigeration and air-handling components. Professional-grade solutions for cooling systems.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
        breadcrumb: 'Refrigeration & Air-Handling',
        productCount: 19,
        products: [
            { id: 1, name: 'Compressor Unit', image: 'https://images.unsplash.com/photo-1581092160562-40038f88f319?w=300&q=80' },
            { id: 2, name: 'Condenser Coil', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0e0?w=300&q=80' },
            { id: 3, name: 'Evaporator', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3793?w=300&q=80' },
            { id: 4, name: 'Expansion Valve', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b65?w=300&q=80' },
            { id: 5, name: 'Airflow Fan', image: 'https://images.unsplash.com/photo-1581092162562-8c67b5a2f0e1?w=300&q=80' }
        ]
    }
};

export default categoryData;
