import React from 'react';
import { Heart, Brain, Activity, Scale, Shield, Dumbbell, Bone, Droplets } from 'lucide-react';

const BENEFITS = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Boosts Sex Drive",
    description: "Natural libido enhancement and hormonal balance support"
  },
  {
    icon: <Activity className="w-8 h-8" />,
    title: "Fights Anemia",
    description: "Rich in iron and minerals essential for blood health"
  },
  {
    icon: <Scale className="w-8 h-8" />,
    title: "Aids Weight-loss",
    description: "Supports metabolism and healthy appetite control"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Improves Mental Health",
    description: "Supports cognitive function and emotional well-being"
  },
  {
    icon: <Droplets className="w-8 h-8" />,
    title: "Eliminates Mucus",
    description: "Natural expectorant properties for respiratory health"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Enhances Thyroid Function",
    description: "Rich in iodine for optimal thyroid health"
  },
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: "Improves Mobility",
    description: "Supports joint health and muscle recovery"
  },
  {
    icon: <Bone className="w-8 h-8" />,
    title: "Strengthens Bones",
    description: "Rich in calcium and minerals for bone health"
  }
];

export default function BenefitsOverview() {
  return (
    <section className="py-20 bg-white p-10">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-montserrat font-bold text-4xl text-primary mb-6">
            Comprehensive Health Benefits
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sea moss offers a wide range of health benefits, supporting everything from 
            immune function to digestive health. Discover how this superfood can enhance 
            your overall wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-primary group-hover:text-coral transition-colors duration-300 mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-montserrat font-semibold text-xl text-primary mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}