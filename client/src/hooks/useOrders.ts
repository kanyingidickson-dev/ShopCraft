import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../services/api';
import type { Order, OrderItem } from '../services/api';

export const useMyOrdersQuery = (enabled: boolean) => {
    return useQuery({
        queryKey: ['orders', 'me'],
        enabled,
        queryFn: async () => {
            const res = await ordersAPI.getMyOrders();
            return res.data.data ?? [];
        },
    });
};

export const useCreateOrderMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (items: OrderItem[]) => {
            const res = await ordersAPI.create(items);
            return res.data.data as Order;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['orders', 'me'] });
        },
    });
};
