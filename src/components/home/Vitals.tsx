import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Brain, Settings as Lungs, Droplets, Dumbbell, ShieldPlus } from 'lucide-react';

const VITAL_METRICS = [
  {
    icon: <Heart className="w-8 h-8" />,
    label: 'Heart',
    description: 'Supports Cardiovascular Health'
  },
  {
    icon: <Brain className="w-8 h-8" />,
    label: 'Mind',
    description: 'Enhances Mental Clarity'
  },
  {
    icon: <Lungs className="w-8 h-8" />,
    label: 'Breath',
    description: 'Improves Respiratory Function'
  },
  {
    icon: <Droplets className="w-8 h-8" />,
    label: 'Flow',
    description: 'Optimizes Blood Circulation'
  },
  {
    icon: <Dumbbell className="w-8 h-8" />,
    label: 'Strength',
    description: 'Boosts Physical Performance'
  },
  {
    icon: <ShieldPlus className="w-8 h-8" />,
    label: 'Defense',
    description: 'Strengthens Immune System'
  }
];

export default function Vitals() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-[#23408f]/5 to-transparent overflow-hidden relative p-10">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-amber-600/5 rounded-full -top-48 -left-48 animate-pulse-slow" />
        <div className="absolute w-96 h-96 bg-[#23408f]/5 rounded-full -bottom-48 -right-48 animate-pulse-slower" />
      </div>

      <div className="container-custom relative">
        <div className="text-center mb-16">
          <h2 className="font-montserrat font-bold text-5xl md:text-6xl text-primary mb-6">
            What's your <span className="inline-block">
              <span className="bg-gradient-to-r from-amber-500 via-purple-600 to-green-500 text-transparent bg-clip-text animate-gradient">
                VITALS
              </span>
            </span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every vital sign tells a story about your health. Enhance them all naturally with our premium sea moss products.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {VITAL_METRICS.map((metric, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-coral/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="mb-4 text-primary group-hover:text-coral transition-colors duration-300 flex justify-center">
                  {metric.icon}
                </div>
                <h3 className="font-montserrat font-semibold text-xl text-primary mb-2">
                  {metric.label}
                </h3>
                <p className="text-gray-600 text-sm">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/collections"
            className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Boost Your Vitals Today
          </Link>
        </div>
      </div>
    </section>
  );
}