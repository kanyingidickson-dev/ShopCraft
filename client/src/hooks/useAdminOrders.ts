import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '../services/api';
import type { PaginatedResult, Order, OrderStatus } from '../services/api';

export const useAdminOrdersQuery = (params: {
    page: number;
    limit: number;
    userId?: string;
    status?: OrderStatus;
}) => {
    return useQuery<PaginatedResult<Order>>({
        queryKey: [
            'orders',
            'admin',
            params.page,
            params.limit,
            params.userId ?? '',
            params.status ?? '',
        ],
        queryFn: async () => {
            const res = await ordersAPI.getAllAdmin(params);
            return res.data.data as PaginatedResult<Order>;
        },
    });
};

export const useUpdateOrderStatusAdminMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: { orderId: string; status: OrderStatus }) => {
            const res = await ordersAPI.updateStatusAdmin(args.orderId, args.status);
            return res.data.data as Order;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['orders', 'admin'] });
        },
    });
};
