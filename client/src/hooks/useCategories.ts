import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '../services/api';
import type { Category } from '../services/api';

export const useCategoriesQuery = () => {
    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await categoriesAPI.getAll();
            return res.data.data ?? [];
        },
    });
};
