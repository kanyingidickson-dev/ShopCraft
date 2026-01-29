import type { Product } from '../services/api';

const escapeXml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

const hashString = (value: string) => {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) {
        h ^= value.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

const makeProductThumbDataUrl = (product: Product) => {
    const id = product.id ?? product.name;
    const categoryName = product.category?.name ?? 'Shop';

    const palettes: Record<string, { bg1: string; bg2: string; accent: string }> = {
        Electronics: { bg1: '#EEF2FF', bg2: '#E0E7FF', accent: '#1D4ED8' },
        Fashion: { bg1: '#FFF7ED', bg2: '#FFEDD5', accent: '#B45309' },
        'Home & Kitchen': { bg1: '#ECFDF5', bg2: '#D1FAE5', accent: '#047857' },
        Beauty: { bg1: '#FDF2F8', bg2: '#FCE7F3', accent: '#BE185D' },
        Books: { bg1: '#F1F5F9', bg2: '#E2E8F0', accent: '#0F172A' },
        'Sports & Outdoors': { bg1: '#ECFEFF', bg2: '#CFFAFE', accent: '#0E7490' },
        'Toys & Games': { bg1: '#FEFCE8', bg2: '#FEF9C3', accent: '#854D0E' },
        Health: { bg1: '#EFF6FF', bg2: '#DBEAFE', accent: '#1E40AF' },
    };

    const palette =
        palettes[categoryName] ?? ({ bg1: '#F8FAFC', bg2: '#E2E8F0', accent: '#0F172A' } as const);

    const seed = hashString(`${id}:${categoryName}:${product.name}`);
    const filterSeed = seed % 997;
    const a = 20 + (seed % 50);
    const b = 30 + ((seed >>> 8) % 50);
    const c = 40 + ((seed >>> 16) % 50);

    const safeName = escapeXml(product.name);
    const safeCategoryUpper = escapeXml(categoryName.toUpperCase());
    const shortName = safeName.length > 28 ? `${safeName.slice(0, 27)}…` : safeName;

    const iconPaths: Record<string, string> = {
        Electronics:
            'M240 640h320c22 0 40-18 40-40V360c0-22-18-40-40-40H240c-22 0-40 18-40 40v240c0 22 18 40 40 40zm60-60V380h200v200H300z',
        Fashion: 'M270 360l60-60h140l60 60-60 60v240H330V420l-60-60z',
        'Home & Kitchen':
            'M320 380c0-44 36-80 80-80h40c44 0 80 36 80 80v40H320v-40zm-40 80h320v180c0 44-36 80-80 80H400c-44 0-80-36-80-80V460z',
        Beauty:
            'M380 300h40v90h60v70h-160v-70h60v-90zm-40 230h200v110c0 44-36 80-80 80h-40c-44 0-80-36-80-80V530z',
        Books: 'M300 320h220c33 0 60 27 60 60v260c-12-10-28-16-46-16H300c-33 0-60-27-60-60V380c0-33 27-60 60-60zm20 70v160h190V390H320z',
        'Sports & Outdoors': 'M270 520h80v-60h100v60h80v80h-80v60H350v-60h-80v-80z',
        'Toys & Games':
            'M300 420h90v-90h110v90h90v110h-90v90H390v-90h-90V420zm110 20v70h70v-70h-70z',
        Health: 'M360 330h80v90h90v80h-90v90h-80v-90h-90v-80h90v-90z',
    };

    const icon = iconPaths[categoryName] ?? iconPaths.Books;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.bg1}"/>
      <stop offset="1" stop-color="${palette.bg2}"/>
    </linearGradient>
    <radialGradient id="r" cx="35%" cy="30%" r="70%">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="shine" cx="30%" cy="22%" r="70%">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="50%" cy="45%" r="85%">
      <stop offset="0" stop-color="#0F172A" stop-opacity="0"/>
      <stop offset="1" stop-color="#0F172A" stop-opacity="0.18"/>
    </radialGradient>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#0F172A" flood-opacity="0.16"/>
    </filter>
    <filter id="tileShadow" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#0F172A" flood-opacity="0.12"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${filterSeed}" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="800" height="1000" fill="url(#g)"/>
  <circle cx="${180 + a}" cy="${160 + b}" r="${140 + (a % 40)}" fill="url(#r)"/>
  <circle cx="${640 - b}" cy="${260 + c}" r="${160 + (b % 60)}" fill="url(#r)"/>
  <rect width="800" height="1000" fill="url(#shine)" opacity="0.55"/>
  <rect width="800" height="1000" fill="url(#vig)"/>
  <rect width="800" height="1000" filter="url(#grain)" opacity="0.08"/>

  <rect x="56" y="56" width="688" height="888" rx="56" fill="#FFFFFF" opacity="0.72" filter="url(#cardShadow)"/>

  <text x="96" y="132" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="22" font-weight="800" fill="#475569">${safeCategoryUpper}</text>
  <text x="96" y="184" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="34" font-weight="900" fill="#0F172A">${shortName}</text>

  <g transform="translate(0,0)">
    <rect x="96" y="240" width="608" height="560" rx="40" fill="#FFFFFF" opacity="0.92" filter="url(#tileShadow)"/>
    <rect x="96" y="240" width="608" height="560" rx="40" fill="url(#shine)" opacity="0.22"/>
    <path d="${icon}" fill="${palette.accent}" opacity="0.92"/>
    <path d="M160 820h480" stroke="#CBD5E1" stroke-width="6" stroke-linecap="round"/>
    <path d="M160 864h340" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round"/>
  </g>

  <rect x="96" y="900" width="210" height="52" rx="26" fill="${palette.accent}" opacity="0.12"/>
  <text x="116" y="934" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" font-size="18" font-weight="800" fill="${palette.accent}">ShopCraft</text>
</svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const getProductImageSrc = (product: Product) => {
    const baseUrl = import.meta.env.BASE_URL;
    const images: Record<string, string> = {
        'Wireless Headphones': `${baseUrl}images/headphones.png`,
        'Smart Watch': `${baseUrl}images/watch.png`,
        'Running Shoes': `${baseUrl}images/shoes.png`,
        'Laptop Stand': `${baseUrl}images/laptop_stand.png`,
        'Coffee Maker': `${baseUrl}images/coffee_maker.png`,
        'LED Desk Lamp': `${baseUrl}images/lamp.png`,
    };

    const direct = images[product.name];
    if (direct) return direct;

    const categoryName = product.category?.name ?? 'Shop';

    const pools: Record<string, string[]> = {
        Electronics: ['headphones.png', 'watch.png', 'laptop_stand.png'],
        Fashion: ['shoes.png', 'watch.png'],
        'Home & Kitchen': ['lamp.png', 'coffee_maker.png', 'laptop_stand.png'],
        Beauty: ['lamp.png', 'watch.png'],
        Books: ['laptop_stand.png', 'lamp.png'],
        'Sports & Outdoors': ['shoes.png', 'watch.png'],
        'Toys & Games': ['headphones.png', 'lamp.png'],
        Health: ['watch.png', 'coffee_maker.png'],
        Shop: ['headphones.png', 'watch.png', 'shoes.png', 'laptop_stand.png', 'coffee_maker.png', 'lamp.png'],
    };

    const pool = pools[categoryName] ?? pools.Shop;
    if (pool.length > 0) {
        const seed = hashString(`${product.id ?? product.name}:${categoryName}:${product.name}`);
        const file = pool[seed % pool.length];
        return `${baseUrl}images/${file}`;
    }

    return makeProductThumbDataUrl(product);
};
