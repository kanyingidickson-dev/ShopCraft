import * as categoriesRepository from './categories.repository';

export const getCategories = async () => {
    return categoriesRepository.findAll();
};

export const createCategory = async (name: string) => {
    return categoriesRepository.create(name);
};
