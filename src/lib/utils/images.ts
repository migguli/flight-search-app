// High-quality apartment placeholder images
export const apartmentImages = [
  {
    id: 'apt1',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    alt: 'Modern apartment living room with large windows'
  },
  {
    id: 'apt2',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    alt: 'Cozy bedroom with natural light'
  },
  {
    id: 'apt3',
    url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    alt: 'Contemporary kitchen with island'
  },
  {
    id: 'apt4',
    url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    alt: 'Luxurious penthouse view'
  },
  {
    id: 'apt5',
    url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
    alt: 'Minimalist dining area'
  },
  {
    id: 'apt6',
    url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    alt: 'Stylish bathroom design'
  },
  {
    id: 'apt7',
    url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80',
    alt: 'Modern apartment exterior'
  },
  {
    id: 'apt8',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    alt: 'Bright and airy balcony'
  }
];

// Property type specific images
export const propertyTypeImages = {
  'Entire apartment': [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
  ],
  'Private room': [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80'
  ],
  'Entire house': [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80'
  ],
  'Entire villa': [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'
  ],
  'Entire cottage': [
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80'
  ],
  'Entire loft': [
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80'
  ]
};

export function getRandomImagesForProperty(propertyType: string, count: number = 3): string[] {
  // Get type-specific images first
  const typeImages = propertyTypeImages[propertyType as keyof typeof propertyTypeImages] || [];
  
  // Get some general apartment images
  const generalImages = apartmentImages.map(img => img.url);
  
  // Combine and shuffle all available images
  const allImages = [...typeImages, ...generalImages];
  const shuffled = allImages.sort(() => 0.5 - Math.random());
  
  // Return requested number of images, or all if less available
  return shuffled.slice(0, count);
} 