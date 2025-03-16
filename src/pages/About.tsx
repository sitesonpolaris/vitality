import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Lucille Smith</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Preserving tradition and crafting beauty through sweetgrass basketry for over six decades.
        </p>
      </div>

      {/* Artist Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative aspect-square">
          <img
            src="https://static.wixstatic.com/media/c73eb8_ec322889076447f6b11d930549fc53e6~mv2.jpg"
            alt="Lucille Smith"
            className="rounded-lg shadow-xl object-cover w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">My Story</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              My journey in sweetgrass basketry began at the tender age of 5, under the patient guidance
              of my grandmother. For over 65 years, I've dedicated myself to preserving and evolving
              this cherished art form.
            </p>
            <p className="mb-4">
              Each basket I create carries within it the stories, traditions, and techniques passed
              down through generations of skilled artisans in our community.
            </p>
            <p>
              Today, I continue to craft these unique pieces with the same passion and attention to
              detail that my grandmother instilled in me, ensuring that this beautiful tradition
              lives on for future generations.
            </p>
          </div>
        </div>
      </div>

      {/* Business Hours & Location */}
      <div className="bg-amber-50 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <Clock className="h-6 w-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Business Hours</h3>
              <p className="mt-2 text-gray-600">
                Monday - Saturday<br />
                9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Location</h3>
              <p className="mt-2 text-gray-600">
                123 Market Street<br />
                Charleston, SC 29401
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Contact</h3>
              <p className="mt-2 text-gray-600">
                (843) 555-0123<br />
                info@lucillesbaskets.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}