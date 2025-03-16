import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  Search, 
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import InventoryManagement from '../components/admin/InventoryManagement';
import OrderModal from '../components/admin/OrderModal';

interface Order {
  id: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  status: string;
  fulfillment_status: 'unfulfilled' | 'fulfilled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: {
    name: string;
    email: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

type SortField = 'created_at' | 'total_amount' | 'fulfillment_status';
type SortDirection = 'asc' | 'desc';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unfulfilled' | 'fulfilled'>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchOrders();
  }, [user, navigate, sortField, sortDirection, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .rpc('get_orders', {
          p_status: statusFilter === 'all' ? null : statusFilter,
          p_sort_field: sortField,
          p_sort_direction: sortDirection,
          p_limit: 100
        });

      if (fetchError) throw fetchError;
      
      // Transform the data to match the Order type
      const transformedOrders = data?.map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]'),
        shipping_address: typeof order.shipping_address === 'object' 
          ? order.shipping_address 
          : JSON.parse(order.shipping_address || '{}')
      }));
      
      setOrders(transformedOrders || []);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleFulfillmentStatus = async (orderId: string) => {
    try {
      setUpdatingStatus(orderId);
      const { data, error } = await supabase
        .rpc('toggle_fulfillment_status', { 
          order_id: orderId 
        });

      if (error) throw error;
      if (!data.success) {
        throw new Error(data.message || 'Failed to update status');
      }
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, fulfillment_status: data.fulfillment_status as 'unfulfilled' | 'fulfilled' }
          : order
      ));
      
      // Clear any existing error
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.shipping_address.name.toLowerCase().includes(searchLower) ||
      order.shipping_address.email.toLowerCase().includes(searchLower)
    );
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Inventory Management */}
      <div className="mb-12">
        <InventoryManagement />
      </div>

      {/* Order Management */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
        </div>
        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-2 py-2"
                >
                  <option value="all">All Orders</option>
                  <option value="unfulfilled">Unfulfilled</option>
                  <option value="fulfilled">Fulfilled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('created_at')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {renderSortIcon('created_at')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('total_amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    {renderSortIcon('total_amount')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('fulfillment_status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {renderSortIcon('fulfillment_status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <Loader2 className="h-8 w-8 text-amber-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 cursor-pointer" 
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.shipping_address?.name || 'Loading...'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shipping_address?.email || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.fulfillment_status === 'fulfilled'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.fulfillment_status === 'fulfilled' ? (
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mr-1" />
                        )}
                        {order.fulfillment_status === 'fulfilled' ? 'Fulfilled' : 'Unfulfilled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  <button
    onClick={(e) => {
      e.stopPropagation(); // Prevent row click event
      toggleFulfillmentStatus(order.id);
    }}
    disabled={updatingStatus === order.id || order.status === 'pending'}
    className="text-amber-600 hover:text-amber-900 disabled:opacity-50"
  >
    {updatingStatus === order.id ? (
      <Loader2 className="h-5 w-5 animate-spin" />
    ) : order.status === 'pending' ? (
      'Awaiting Payment'
    ) : order.fulfillment_status === 'fulfilled' ? (
      'Mark Unfulfilled'
    ) : (
      'Mark Fulfilled'
    )}
  </button>
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderModal
        order={selectedOrder}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}