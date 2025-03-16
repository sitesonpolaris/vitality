import React from 'react';
import { Coffee, Utensils, Salad, GlassWater } from 'lucide-react';

const USAGE_METHODS = [
  {
    title: 'Herbal Tea',
    description: 'Stir into warm herbal tea for a soothing and nourishing drink that helps support respiratory health.',
    icon: <Coffee className="w-6 h-6" />
  },
  {
    title: 'Stews & Soups',
    description: 'Add to stews for extra nourishment and flavor. The gel will help thicken while adding mineral content.',
    icon: <Utensils className="w-6 h-6" />
  },
  {
    title: 'Smoothies',
    description: 'Blend into smoothies for a creamy texture and added benefits. Perfect for morning wellness routines.',
    icon: <Salad className="w-6 h-6" />
  },
  {
    title: 'Porridge & Breakfast',
    description: 'Mix into morning porridge or breakfast bowls for a delicious, hearty meal with added nutrition.',
    icon: <GlassWater className="w-6 h-6" />
  }
];

export default function UsageGuide() {
  return (
    <section className="py-16 bg-gray-50 p-10">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-montserrat font-bold text-3xl text-primary mb-8">
            How to Use Sea Moss
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {USAGE_METHODS.map((method, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {method.icon}
                  </div>
                  <h3 className="font-montserrat font-semibold text-lg text-primary">
                    {method.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {method.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary/5 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-primary mb-4">
              Important Notes
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use within 1-4 weeks for best freshness</li>
              <li>Keep refrigerated between uses</li>
              <li>Can be added to any beverage for a nutrient boost</li>
              <li>Perfect addition to your daily wellness routine</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}