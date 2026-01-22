import prisma from '../../config/database';

export const findAll = () => {
    return prisma.category.findMany({
        include: { products: true },
    });
};

export const create = (name: string) => {
    return prisma.category.create({
        data: { name },
    });
};
