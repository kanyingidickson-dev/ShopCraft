import React, { useMemo, useState } from 'react';
import { useAdminOrdersQuery, useUpdateOrderStatusAdminMutation } from '../hooks/useAdminOrders';
import type { OrderStatus } from '../services/api';

const AdminOrders: React.FC = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [statusUpdateError, setStatusUpdateError] = useState('');

    const { data, isLoading, isError } = useAdminOrdersQuery({ page, limit });
    const updateStatusMutation = useUpdateOrderStatusAdminMutation();

    const rows = useMemo(() => data?.items ?? [], [data]);

    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        setStatusUpdateError('');
        try {
            await updateStatusMutation.mutateAsync({ orderId, status });
        } catch {
            setStatusUpdateError('Failed to update order status');
        }
    };

    if (isLoading) {
        return <div className="text-gray-600">Loading orders...</div>;
    }

    if (isError) {
        return <div className="text-red-600">Failed to load admin orders</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Orders</h1>
                <p className="text-gray-600">Manage and review customer orders</p>
            </div>

            {statusUpdateError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {statusUpdateError}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Order</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Customer</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Update Status</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Total</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rows.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{o.id.slice(0, 8)}...</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {o.user?.email || o.userId}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{o.status}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <select
                                            className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
                                            value={o.status}
                                            disabled={updateStatusMutation.isPending}
                                            onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PAID">PAID</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">${Number(o.total).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {new Date(o.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                        Page {data?.page ?? page} of {data?.totalPages ?? 1}
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Prev
                        </button>
                        <button
                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
                            disabled={page >= (data?.totalPages ?? 1)}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
