import prisma from '../src/config/database';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Starting database seed...');

    const categories = await Promise.all([
        prisma.category.create({ data: { name: 'Electronics' } }),
        prisma.category.create({ data: { name: 'Clothing' } }),
        prisma.category.create({ data: { name: 'Home & Garden' } }),
        prisma.category.create({ data: { name: 'Sports' } }),
    ]);

    console.log('Created categories');

    await Promise.all([
        prisma.product.create({
            data: {
                name: 'Wireless Headphones',
                description:
                    'Premium noise-cancelling wireless headphones with 30-hour battery life',
                price: 199.99,
                stock: 50,
                categoryId: categories[0].id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Smart Watch',
                description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
                price: 299.99,
                stock: 30,
                categoryId: categories[0].id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Laptop Stand',
                description: 'Ergonomic aluminum laptop stand with adjustable height',
                price: 49.99,
                stock: 100,
                categoryId: categories[0].id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Cotton T-Shirt',
                description: 'Comfortable 100% organic cotton t-shirt in multiple colors',
                price: 24.99,
                stock: 200,
                categoryId: categories[1].id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Denim Jeans',
                description: 'Classic fit denim jeans with stretch fabric',
                price: 59.99,
                stock: 150,
                categoryId: categories[1].id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Running Shoes',
                description: 'Lightweight running shoes with responsive cushioning',
                price: 89.99,
                stock: 75,
                categoryId: categories[3].id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Yoga Mat',
                description: 'Non-slip eco-friendly yoga mat with carrying strap',
                price: 34.99,
                stock: 120,
                categoryId: categories[3].id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Coffee Maker',
                description: 'Programmable coffee maker with thermal carafe',
                price: 79.99,
                stock: 40,
                categoryId: categories[2].id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Plant Pot Set',
                description: 'Set of 3 ceramic plant pots with drainage holes',
                price: 29.99,
                stock: 90,
                categoryId: categories[2].id,
            },
        }),
        prisma.product.create({
            data: {
                name: 'LED Desk Lamp',
                description: 'Adjustable LED desk lamp with USB charging port',
                price: 39.99,
                stock: 60,
                categoryId: categories[2].id,
            },
        }),
    ]);

    console.log('Created products');

    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.user.create({
        data: {
            email: 'demo@shopcraft.com',
            password: hashedPassword,
            name: 'Demo User',
            role: 'CUSTOMER',
        },
    });

    console.log('Created demo user');

    await prisma.user.create({
        data: {
            email: 'admin@shopcraft.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });

    console.log('Created admin user');

    console.log('Seed completed successfully!');
    console.log('\nDemo credentials:');
    console.log('Email: demo@shopcraft.com');
    console.log('Password: password123');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@shopcraft.com');
    console.log('Password: password123');
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
