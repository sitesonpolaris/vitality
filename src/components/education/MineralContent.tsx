import React from 'react';
import { Sparkles } from 'lucide-react';

const KEY_MINERALS = [
  { name: 'Iodine', benefit: 'Essential for thyroid function' },
  { name: 'Iron', benefit: 'Supports blood health and energy' },
  { name: 'Magnesium', benefit: 'Vital for nerve and muscle function' },
  { name: 'Calcium', benefit: 'Strengthens bones and teeth' },
  { name: 'Potassium', benefit: 'Supports heart and muscle health' },
  { name: 'Zinc', benefit: 'Boosts immune system function' }
];

export default function MineralContent() {
  return (
    <section className="py-20 bg-primary/5 p-10">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-8">
            <Sparkles size={32} className="text-coral" />
            <h2 className="font-montserrat font-bold text-4xl text-primary">
              Mineral-Rich Composition
            </h2>
          </div>

          <p className="text-center text-gray-600 mb-12">
            Sea moss contains an impressive 92 out of 102 minerals that our bodies need. 
            These minerals work synergistically to support overall health and vitality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEY_MINERALS.map((mineral, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="font-montserrat font-semibold text-xl text-primary mb-2">
                  {mineral.name}
                </h3>
                <p className="text-gray-600">
                  {mineral.benefit}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white p-8 rounded-xl shadow-lg">
            <h3 className="font-montserrat font-semibold text-2xl text-primary mb-4">
              Why Mineral Content Matters
            </h3>
            <p className="text-gray-600 mb-6">
              The mineral composition of sea moss makes it uniquely beneficial for human health. 
              These minerals are in their natural form, making them more bioavailable and easier 
              for your body to absorb and utilize effectively.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Natural form for better absorption</li>
              <li>Synergistic mineral combinations</li>
              <li>Complete spectrum of trace minerals</li>
              <li>Balanced ratios for optimal health</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}