import type { Category, Product } from '../../services/api';

export const categories: Category[] = [
    { id: 'c1', name: 'Electronics' },
    { id: 'c2', name: 'Fashion' },
    { id: 'c3', name: 'Home & Kitchen' },
    { id: 'c4', name: 'Beauty' },
    { id: 'c5', name: 'Books' },
    { id: 'c6', name: 'Sports & Outdoors' },
    { id: 'c7', name: 'Toys & Games' },
    { id: 'c8', name: 'Health' },
];

const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c])) as Record<
    string,
    Category
>;

const featuredProducts: Product[] = [
    {
        id: 'p1',
        name: 'Wireless Headphones',
        description: 'Noise-cancelling over-ear headphones with premium sound and all-day comfort.',
        price: 149.99,
        image: 'images/headphones.png',
        rating: makeRating('p1'),
        reviewCount: makeReviewCount('p1'),
        stock: 12,
        category: categoryByName['Electronics'],
    },
    {
        id: 'p2',
        name: 'Smart Watch',
        description:
            'A sleek smartwatch with fitness tracking, notifications, and long battery life.',
        price: 199.0,
        image: 'images/watch.png',
        rating: makeRating('p2'),
        reviewCount: makeReviewCount('p2'),
        stock: 7,
        category: categoryByName['Electronics'],
    },
    {
        id: 'p3',
        name: 'Running Shoes',
        description: 'Lightweight performance runners designed for daily training and comfort.',
        price: 129.5,
        image: 'images/shoes.png',
        rating: makeRating('p3'),
        reviewCount: makeReviewCount('p3'),
        stock: 18,
        category: categoryByName['Sports & Outdoors'],
    },
    {
        id: 'p4',
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum laptop stand for better posture and desk aesthetics.',
        price: 59.99,
        image: 'images/laptop_stand.png',
        rating: makeRating('p4'),
        reviewCount: makeReviewCount('p4'),
        stock: 9,
        category: categoryByName['Electronics'],
    },
    {
        id: 'p5',
        name: 'Coffee Maker',
        description: 'Compact coffee maker with programmable brew and consistent extraction.',
        price: 89.0,
        image: 'images/coffee_maker.png',
        rating: makeRating('p5'),
        reviewCount: makeReviewCount('p5'),
        stock: 5,
        category: categoryByName['Home & Kitchen'],
    },
    {
        id: 'p6',
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with warm/cool modes and a minimal footprint.',
        price: 39.99,
        image: 'images/lamp.png',
        rating: makeRating('p6'),
        reviewCount: makeReviewCount('p6'),
        stock: 14,
        category: categoryByName['Home & Kitchen'],
    },
];

const mulberry32 = (seed: number) => {
    let t = seed >>> 0;
    return () => {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
};

const rng = mulberry32(1337);

const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => rng() * (max - min) + min;
const pick = <T,>(items: T[]) => items[randInt(0, items.length - 1)];

const imageForGeneratedProduct = (name: string) => {
    const n = name.toLowerCase();

    if (n.includes('watch')) return 'images/watch.png';
    if (n.includes('shoe') || n.includes('sneaker') || n.includes('boot')) return 'images/shoes.png';
    if (n.includes('lamp') || n.includes('light') || n.includes('headlamp')) return 'images/lamp.png';
    if (n.includes('coffee')) return 'images/coffee_maker.png';
    if (n.includes('headphone') || n.includes('earbud') || n.includes('speaker')) return 'images/headphones.png';
    if (
        n.includes('laptop') ||
        n.includes('keyboard') ||
        n.includes('mouse') ||
        n.includes('monitor') ||
        n.includes('webcam') ||
        n.includes('router') ||
        n.includes('tablet')
    ) {
        return 'images/laptop_stand.png';
    }

    return undefined;
};

function stableHash(value: string) {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) {
        h ^= value.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function makeRating(seed: string) {
    const h = stableHash(seed);
    const base = 3.3 + ((h % 170) / 100);
    return Math.max(3.0, Math.min(5.0, Number(base.toFixed(1))));
}

function makeReviewCount(seed: string) {
    const h = stableHash(`reviews:${seed}`);
    return 12 + (h % 2988);
}

const templates: Record<
    string,
    {
        adjectives: string[];
        nouns: string[];
        desc1: string[];
        desc2: string[];
        price: [number, number];
    }
> = {
    Electronics: {
        adjectives: ['Smart', 'Wireless', 'Ultra', 'Pro', 'Compact', 'Premium', 'Portable', 'HD'],
        nouns: ['Bluetooth Speaker', 'Tablet', 'Power Bank', 'Webcam', 'Keyboard', 'Mouse', 'Monitor', 'Router'],
        desc1: ['Fast setup and reliable performance.', 'Designed for everyday productivity.', 'Built for speed and stability.'],
        desc2: ['Backed by a 1-year warranty.', 'Sleek design with premium materials.', 'Optimized for low-latency use.'],
        price: [19.99, 799.99],
    },
    Fashion: {
        adjectives: ['Classic', 'Modern', 'Slim', 'Oversized', 'Everyday', 'Premium', 'Comfort', 'Essential'],
        nouns: ['Hoodie', 'Sneakers', 'Jeans', 'Jacket', 'T-Shirt', 'Backpack', 'Belt', 'Sunglasses'],
        desc1: ['Comfort-first fit for daily wear.', 'Elevated basics with clean lines.', 'Designed for style and durability.'],
        desc2: ['Easy care and long-lasting.', 'Pair it with anything.', 'Built with attention to detail.'],
        price: [9.99, 249.99],
    },
    'Home & Kitchen': {
        adjectives: ['Stainless', 'Ergonomic', 'Space-Saving', 'Modern', 'Quiet', 'Programmable', 'Multi-Use', 'Nonstick'],
        nouns: ['Air Fryer', 'Blender', 'Knife Set', 'Cookware Set', 'Vacuum', 'Toaster', 'Coffee Grinder', 'Organizer'],
        desc1: ['Makes everyday tasks effortless.', 'Built to simplify your routine.', 'Reliable performance with minimal footprint.'],
        desc2: ['Easy to clean and store.', 'Perfect for home upgrades.', 'Engineered for consistent results.'],
        price: [14.99, 499.99],
    },
    Beauty: {
        adjectives: ['Hydrating', 'Brightening', 'Gentle', 'Nourishing', 'Daily', 'Soothing', 'Fragrance-Free', 'Vitamin C'],
        nouns: ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Shampoo', 'Conditioner', 'Lip Balm', 'Face Mask'],
        desc1: ['Formulated for a smooth finish.', 'Lightweight and non-greasy.', 'Dermatologist-tested ingredients.'],
        desc2: ['Ideal for everyday routines.', 'Works well for most skin types.', 'Clean, minimal ingredient list.'],
        price: [5.99, 129.99],
    },
    Books: {
        adjectives: ['Bestselling', 'Illustrated', 'Essential', 'Complete', 'Beginner', 'Advanced', 'Practical', 'Modern'],
        nouns: ['Cookbook', 'Novel', 'Workbook', 'Guide', 'Biography', 'Textbook', 'Handbook', 'Reference'],
        desc1: ['A must-read addition to your shelf.', 'Clear structure and engaging content.', 'Written for real-world learning.'],
        desc2: ['Perfect for gifting.', 'Packed with actionable insights.', 'Updated with current best practices.'],
        price: [7.99, 89.99],
    },
    'Sports & Outdoors': {
        adjectives: ['Lightweight', 'Durable', 'All-Weather', 'Performance', 'Adjustable', 'Compact', 'High-Impact', 'Pro'],
        nouns: ['Yoga Mat', 'Dumbbells', 'Camping Tent', 'Hiking Backpack', 'Water Bottle', 'Running Shorts', 'Resistance Bands', 'Headlamp'],
        desc1: ['Built to handle tough conditions.', 'Designed for training and recovery.', 'Engineered for comfort and endurance.'],
        desc2: ['Great for beginners and pros.', 'Easy to pack and carry.', 'Trusted quality for daily use.'],
        price: [8.99, 399.99],
    },
    'Toys & Games': {
        adjectives: ['Interactive', 'Educational', 'Creative', 'Family', 'Classic', 'Puzzle', 'STEM', 'Deluxe'],
        nouns: ['Board Game', 'Puzzle Set', 'Building Kit', 'Action Figure', 'Card Game', 'Remote Car', 'Doll Set', 'Craft Kit'],
        desc1: ['Hours of fun for all ages.', 'Encourages creativity and focus.', 'Designed for family game night.'],
        desc2: ['Durable materials and safe design.', 'Perfect for gifting.', 'Great for learning through play.'],
        price: [6.99, 199.99],
    },
    Health: {
        adjectives: ['Daily', 'Organic', 'High-Potency', 'Sugar-Free', 'Immune', 'Calm', 'Energy', 'Recovery'],
        nouns: ['Multivitamin', 'Protein Powder', 'Electrolytes', 'Omega-3', 'Magnesium', 'Collagen', 'Fiber Supplement', 'Creatine'],
        desc1: ['Supports a consistent wellness routine.', 'Clean ingredients with transparent labeling.', 'Designed for everyday performance.'],
        desc2: ['Lab-tested quality standards.', 'Easy to mix and take.', 'A simple upgrade to your regimen.'],
        price: [9.99, 149.99],
    },
};

const generateProducts = () => {
    const out: Product[] = [...featuredProducts];
    const names = new Set(out.map((p) => p.name.toLowerCase()));
    const perCategory = 45;

    for (const cat of categories) {
        const tpl = templates[cat.name];
        if (!tpl) continue;

        for (let i = 0; i < perCategory; i++) {
            const adjective = pick(tpl.adjectives);
            const noun = pick(tpl.nouns);
            const sku = randInt(10000, 99999);
            let name = `${adjective} ${noun}`;
            const key = name.toLowerCase();
            if (names.has(key)) {
                name = `${name} ${sku}`;
            }
            names.add(name.toLowerCase());

            const price = Number(randFloat(tpl.price[0], tpl.price[1]).toFixed(2));
            const stock = randInt(0, 120);
            const description = `${pick(tpl.desc1)} ${pick(tpl.desc2)}`;

            const id = `p_${cat.id}_${String(i + 1).padStart(3, '0')}_${sku}`;

            out.push({
                id,
                name,
                description,
                price,
                image: imageForGeneratedProduct(name),
                rating: makeRating(id),
                reviewCount: makeReviewCount(id),
                stock,
                category: cat,
            });
        }
    }

    return out;
};

export const products: Product[] = generateProducts();
