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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Form submission will be handled by Netlify
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
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
         <form name="contact" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <p>
    <label>
      Name <input type="text" name="name" required />
    </label>
  </p>
  <p>
    <label>
      Email <input type="email" name="email" required />
    </label>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>


          <form name="contact" data-netlify="true" hidden>
  <input type="text" name="name" />
  <input type="email" name="email" />
</form>

        </div>
      </div>
    </div>
  );
}
