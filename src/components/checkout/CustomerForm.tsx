import React, { useEffect } from 'react';
import { CustomerInfo } from '../../types/customer';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface CustomerFormProps {
  onSubmit: (customerInfo: CustomerInfo) => void;
  isLoading: boolean;
}

export default function CustomerForm({ onSubmit, isLoading }: CustomerFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = React.useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  const [loadingCustomerInfo, setLoadingCustomerInfo] = React.useState(true);
  const [errors, setErrors] = React.useState<Partial<Record<keyof CustomerInfo, string>>>({});

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_customer_info');

        if (error) throw error;

        if (data && data.length > 0) {
          const customerInfo = data[0];
          setFormData({
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
          });
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
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format (e.g., +1234567890)';
    }

    if (!formData.address.street.trim()) {
      newErrors.address = 'Street address is required';
    }
    if (!formData.address.city.trim()) {
      newErrors.address = 'City is required';
    }
    if (!formData.address.state.trim()) {
      newErrors.address = 'State is required';
    }
    if (!formData.address.postalCode.trim()) {
      newErrors.address = 'Postal code is required';
    }
    if (!formData.address.country.trim()) {
      newErrors.address = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Save customer info to database
      supabase.rpc('upsert_customer_info', {
        p_full_name: formData.fullName,
        p_email: formData.email,
        p_phone: formData.phone,
        p_street: formData.address.street,
        p_city: formData.address.city,
        p_state: formData.address.state,
        p_postal_code: formData.address.postalCode,
        p_country: formData.address.country
      }).then(() => {
        onSubmit(formData);
      }).catch(err => {
        console.error('Error saving customer info:', err);
        onSubmit(formData);
      });
    }
  };

  if (loadingCustomerInfo) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          required
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number (with country code)
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1234567890"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
        
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Street Address *
          </label>
          <input
            type="text"
            id="street"
            value={formData.address.street}
            onChange={(e) => setFormData({
              ...formData,
              address: { ...formData.address, street: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={formData.address.city}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, city: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State/Province *
            </label>
            <input
              type="text"
              id="state"
              value={formData.address.state}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, state: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Postal Code *
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.address.postalCode}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, postalCode: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country *
            </label>
            <input
              type="text"
              id="country"
              value={formData.address.country}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, country: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>
        </div>
      </div>

      {errors.address && (
        <p className="text-sm text-red-600">{errors.address}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
}