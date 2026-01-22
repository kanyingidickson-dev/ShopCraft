import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import type { Product } from '../services/api';

export const useProductsQuery = () => {
    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await productsAPI.getAll();
            return res.data.data?.items ?? [];
        },
    });
};
