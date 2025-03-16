import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Plus,
  Minus,
  History,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { products } from '../../data/products';

interface InventoryItem {
  product_id: string;
  product_name: string;
  product_image: string;
  inventory_level: number;
  low_stock_threshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  last_updated: string;
}

interface InventoryHistory {
  id: string;
  product_id: string;
  previous_level: number;
  new_level: number;
  change_type: 'restock' | 'sale' | 'adjustment';
  change_reason: string | null;
  changed_at: string;
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<InventoryHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('get_inventory_status');

      if (error) throw error;
      // Merge inventory data with product details
      let inventoryWithDetails = (data || []).map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
          ...item,
          product_name: product?.name || 'Unknown Product',
          product_image: product?.images[0] || ''
        };
      });
      
      // Sort by product name
      inventoryWithDetails.sort((a, b) => 
        a.product_name.localeCompare(b.product_name)
      );
      
      setInventory(inventoryWithDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (productId: string) => {
    try {
      setHistoryLoading(true);
      const { data, error } = await supabase
        .from('inventory_history')
        .select('*')
        .eq('product_id', productId)
        .order('changed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
      setShowHistory(true);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const updateInventory = async (
    productId: string, 
    newLevel: number, 
    changeType: 'restock' | 'sale' | 'adjustment',
    reason?: string
  ) => {
    try {
      setUpdating(productId);
      const { data, error } = await supabase
        .rpc('update_inventory_level', {
          p_product_id: productId,
          p_new_level: newLevel,
          p_change_type: changeType,
          p_change_reason: reason
        });

      if (error) throw error;
      if (!data.success) throw new Error(data.message);

      // Refresh inventory
      await fetchInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inventory');
      console.error('Error updating inventory:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleQuantityChange = async (
    productId: string, 
    currentLevel: number,
    delta: number
  ) => {
    const newLevel = Math.max(0, currentLevel + delta);
    const changeType = delta > 0 ? 'restock' : 'adjustment';
    await updateInventory(
      productId, 
      newLevel, 
      changeType,
      `${changeType === 'restock' ? 'Restocked' : 'Adjusted'} by ${Math.abs(delta)}`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'out_of_stock':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Inventory Management</h2>
        <button
          onClick={fetchInventory}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Low Stock Threshold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <Loader2 className="h-8 w-8 text-amber-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No inventory data found
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.product_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.inventory_level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.low_stock_threshold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">
                          {item.status.replace('_', ' ')}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.last_updated).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.inventory_level, -1)}
                          disabled={updating === item.product_id || item.inventory_level === 0}
                          className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.inventory_level, 1)}
                          disabled={updating === item.product_id}
                          className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => fetchHistory(item.product_id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        {updating === item.product_id && (
                          <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowHistory(false)} />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Inventory History</h3>
              </div>
              <div className="px-6 py-4">
                {historyLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((record) => (
                      <div key={record.id} className="border-b pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {record.previous_level} → {record.new_level}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(record.changed_at).toLocaleString()}
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded-full capitalize bg-gray-100">
                            {record.change_type}
                          </span>
                        </div>
                        {record.change_reason && (
                          <p className="mt-2 text-sm text-gray-600">
                            {record.change_reason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}