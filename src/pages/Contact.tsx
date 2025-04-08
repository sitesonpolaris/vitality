import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';

// Reusable Contact Detail Component
const ContactDetail = ({ icon: Icon, title, content }: { icon: any; title: string; content: string }) => (
  <div className="flex items-start space-x-4">
    <Icon className="h-6 w-6 text-primary flex-shrink-0" />
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{content}</p>
    </div>
  </div>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            Have questions about our products or interested in placing a custom order?
            We'd love to hear from you.
          </p>
          <div className="space-y-6">
            <ContactDetail icon={Phone} title="Call Us" content="(919) 730-8782" />
            <ContactDetail icon={Mail} title="Email Us" content="kayobless@gmail.com" />
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            className="space-y-6"
          >
            {/* Required hidden input for Netlify */}
            <input type="hidden" name="form-name" value="contact" />

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-80"
            >
              Send Message
            </button>

            {status === 'success' && <p className="text-green-600">Thanks! Your message was sent.</p>}
            {status === 'error' && <p className="text-red-600">Oops! Something went wrong.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
