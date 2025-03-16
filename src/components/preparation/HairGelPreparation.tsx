import React from 'react';
import { Scissors, Timer, Droplets, Leaf } from 'lucide-react';

const PREPARATION_STEPS = [
  {
    icon: <Droplets className="w-6 h-6" />,
    title: 'Heat Preparation',
    description: 'Heat sea moss gel for at least 3 minutes to achieve optimal consistency.',
    duration: '3 minutes'
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: 'Optional Mix-ins',
    description: 'Mix with aloe vera, coconut oil, or avocado oil for enhanced benefits.',
    duration: '2-3 minutes'
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    title: 'Application',
    description: 'Apply directly to hair, ensuring complete coverage from roots to tips.',
    duration: '5-10 minutes'
  },
  {
    icon: <Timer className="w-6 h-6" />,
    title: 'Processing Time',
    description: 'Leave the treatment on for 20-30 minutes to allow absorption.',
    duration: '20-30 minutes'
  }
];

export default function HairGelPreparation() {
  return (
    <section className="py-16 bg-primary/5 p-10">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-montserrat font-bold text-3xl text-primary mb-8">
              Sea Moss Hair Gel Treatment
            </h2>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6">
                <h3 className="font-montserrat font-semibold text-xl text-primary mb-4">
                  Required Ingredients
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-coral rounded-full" />
                    Sea Moss Gel (Base)
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-coral rounded-full" />
                    Aloe Vera (Optional)
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-coral rounded-full" />
                    Coconut Oil (Optional)
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-coral rounded-full" />
                    Avocado Oil (Optional)
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              {PREPARATION_STEPS.map((step, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
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
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="relative">
              <img
                src="https://static.wixstatic.com/media/c73eb8_197ae77f0201407fa6b362de8d359dd7~mv2.jpg"
                alt="Sea Moss Hair Treatment"
                className="w-full rounded-xl shadow-lg mb-8"
              />
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-montserrat font-semibold text-xl text-primary mb-4">
                  Tips for Best Results
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                    Wash hair thoroughly 2-3 times after treatment
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                    Use regularly for optimal hair growth and shine
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                    Can be combined with other natural hair treatments
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                    Store any unused mixture in the refrigerator
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}