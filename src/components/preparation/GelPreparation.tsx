import React from 'react';
import { Beaker, Clock, ThermometerSun, Leaf } from 'lucide-react';

const PREPARATION_STEPS = [
  {
    title: 'Initial Preparation',
    description: 'Rinse your sea moss thoroughly to remove any debris. Inspect for quality and prepare your alkaline water.',
    icon: <Beaker className="w-6 h-6" />,
    duration: '5-10 minutes'
  },
  {
    title: 'Soak and Hydrate',
    description: 'Place the cleaned sea moss in alkaline water. The moss will expand, so ensure there is enough water to cover it completely.',
    icon: <ThermometerSun className="w-6 h-6" />,
    duration: '12-24 hours'
  },
  {
    title: 'Blend and Store',
    description: 'Blend sea moss with fresh alkaline water, optional flaxseed, and key lime juice until smooth. Store in an airtight container.',
    icon: <Clock className="w-6 h-6" />,
    duration: '10-15 minutes'
  }
];

export default function GelPreparation() {
  return (
    <section className="py-16 bg-white p-10">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-montserrat font-bold text-3xl text-primary mb-8">
              Making Sea Moss Gel
            </h2>

            <div className="space-y-8">
              {PREPARATION_STEPS.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-montserrat font-semibold text-xl text-primary">
                        {step.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-sand/30 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-primary mb-4">Required Ingredients</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Sea Moss</li>
                <li>Alkaline Water</li>
                <li>Flaxseed (optional)</li>
                <li>Key Limes</li>
              </ul>
              <h3 className="font-semibold text-lg text-primary mt-6 mb-4">Health Benefits</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Nature's Collagen for skin health</li>
                <li>Helps rid the body of mucus and improves respiratory health</li>
                <li>Aids in digestion and supports gut health</li>
              </ul>
            </div>
          </div>
          
          <div className="lg:sticky lg:top-24">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://static.wixstatic.com/media/c73eb8_57d9e28698c24ab188f775c09ff6906d~mv2.jpg"
                alt="Sea Moss Gel Preparation"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-montserrat font-semibold text-xl mb-2">
                    Natural & Pure
                  </h3>
                  <p className="text-white/90">
                    Made with love and care for optimal wellness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}