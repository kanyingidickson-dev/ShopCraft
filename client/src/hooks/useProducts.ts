import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import type { Product } from '../services/api';

export type UseProductsQueryParams = {
    page?: number;
    limit?: number;
    q?: string;
    sort?: 'createdAt' | 'price' | 'name';
    order?: 'asc' | 'desc';
};

export const useProductsQuery = (params?: UseProductsQueryParams) => {
    return useQuery<Product[]>({
        queryKey: ['products', params ?? {}],
        queryFn: async () => {
            const res = await productsAPI.getAll(params);
            return res.data.data?.items ?? [];
        },
    });
};
