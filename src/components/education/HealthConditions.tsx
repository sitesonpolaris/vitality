import React from 'react';
import { Heart, Brain, Wind, Bone, Activity, ShieldPlus } from 'lucide-react';

const HEALTH_SYSTEMS = [
  {
    icon: <Heart className="w-12 h-12" />,
    title: "Cardiovascular Health",
    conditions: [
      "Supports healthy blood pressure",
      "Improves circulation",
      "Reduces inflammation"
    ]
  },
  {
    icon: <Brain className="w-12 h-12" />,
    title: "Mental & Emotional",
    conditions: [
      "Enhances mood stability",
      "Supports cognitive function",
      "Reduces anxiety and stress"
    ]
  },
  {
    icon: <Wind className="w-12 h-12" />,
    title: "Respiratory System",
    conditions: [
      "Dissolves excess mucus",
      "Supports lung health",
      "Eases breathing difficulties"
    ]
  },
  {
    icon: <Bone className="w-12 h-12" />,
    title: "Musculoskeletal",
    conditions: [
      "Strengthens bones",
      "Improves joint mobility",
      "Supports muscle recovery"
    ]
  },
  {
    icon: <Activity className="w-12 h-12" />,
    title: "Hormonal Balance",
    conditions: [
      "Regulates menstrual cycle",
      "Supports thyroid function",
      "Balances hormones naturally"
    ]
  },
  {
    icon: <ShieldPlus className="w-12 h-12" />,
    title: "Immune System",
    conditions: [
      "Fights free radicals",
      "Boosts immune response",
      "Supports overall immunity"
    ]
  }
];

export default function HealthConditions() {
  return (
    <section className="py-20 bg-white p-10">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-montserrat font-bold text-4xl text-primary mb-6">
            Supporting Multiple Body Systems
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sea moss provides comprehensive support for various body systems, 
            helping to maintain optimal health and address multiple conditions naturally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HEALTH_SYSTEMS.map((system, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-primary mb-6">
                {system.icon}
              </div>
              <h3 className="font-montserrat font-semibold text-2xl text-primary mb-4">
                {system.title}
              </h3>
              <ul className="space-y-3">
                {system.conditions.map((condition, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-coral rounded-full" />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}