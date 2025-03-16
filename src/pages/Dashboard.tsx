import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogOut, Package, User, MapPin, Phone, Mail, Edit, ArrowRight } from 'lucide-react';
import CustomerInfoModal from '../components/customer/CustomerInfoModal';
import { supabase } from '../lib/supabase';

interface CustomerInfo {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  fulfillment_status: 'unfulfilled' | 'fulfilled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loadingCustomerInfo, setLoadingCustomerInfo] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        
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

    fetchOrders();
  }, [user, navigate]);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const { data, error } = await supabase.rpc('get_customer_info');

        if (error) throw error;
        if (data && data.length > 0) {
          setCustomerInfo(data[0]);
        }
      } catch (err) {
        console.error('Error fetching customer info:', err);
      } finally {
        setLoadingCustomerInfo(false);
      }
    };

    if (user) {
      fetchCustomerInfo();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="text-amber-600 hover:text-amber-700 flex items-center"
          >
            <Edit className="h-4 w-4 mr-1" />
            Update Info
          </button>
        </div>

        <div className="p-6">
          {loadingCustomerInfo ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
            </div>
          ) : customerInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{customerInfo.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-600">{customerInfo.email}</p>
                </div>
                {customerInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-600">{customerInfo.phone}</p>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-600">{customerInfo.street}</p>
                    <p className="text-gray-600">
                      {customerInfo.city}, {customerInfo.state} {customerInfo.postal_code}
                    </p>
                    <p className="text-gray-600">{customerInfo.country}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">No customer information found.</p>
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="text-amber-600 hover:text-amber-700 inline-flex items-center mt-2 bg-transparent border-0"
              >
                Add Information
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.fulfillment_status === 'fulfilled'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.fulfillment_status === 'fulfilled' ? 'Fulfilled' : 'Unfulfilled'}
                  </span>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500"> × {item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <p className="text-gray-600">
                    {order.shipping_address.name}<br />
                    {order.shipping_address.street}<br />
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                    {order.shipping_address.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isUpdateModalOpen && (
        <CustomerInfoModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          currentInfo={customerInfo ? {
            fullName: customerInfo.full_name,
            email: customerInfo.email,
            phone: customerInfo.phone || '',
            address: {
              street: customerInfo.street,
              city: customerInfo.city,
              state: customerInfo.state,
              postalCode: customerInfo.postal_code,
              country: customerInfo.country,
            },
          } : null}
          onUpdate={() => {
            // Refresh customer info after update
            const fetchCustomerInfo = async () => {
              try {
                const { data, error } = await supabase.rpc('get_customer_info');
                if (error) throw error;
                setCustomerInfo(data?.[0] || null);
              } catch (err) {
                console.error('Error fetching customer info:', err);
              }
            };
            fetchCustomerInfo();
          }}
        />
      )}
    </div>
  );
}