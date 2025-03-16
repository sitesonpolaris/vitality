import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Clock, Atom as Stomach, Heart, Brain, Flame, Shield, Activity, Scale, Sparkles, Dumbbell, Bone, Zap, HeartPulse } from 'lucide-react';

// Move benefits data outside component to prevent recreation on each render
const BENEFITS_DATA = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Helps with Anemia',
    description: 'Rich in iron and other minerals essential for healthy blood cell production'
  },
  {
    icon: <Flame className="w-8 h-8" />,
    title: 'Boosts Energy',
    description: 'Natural energy enhancement through essential nutrients and minerals'
  },
  {
    icon: <Activity className="w-8 h-8" />,
    title: 'Thyroid Support',
    description: 'Rich in iodine to support optimal thyroid function'
  },
  {
    icon: <Scale className="w-8 h-8" />,
    title: 'Regulates Appetite',
    description: 'Natural appetite regulation for healthy weight management'
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Detoxifies',
    description: 'Natural detoxification support for overall wellness'
  },
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: 'Muscle Recovery',
    description: 'Supports faster muscle recovery and reduced soreness'
  },
  {
    icon: <Bone className="w-8 h-8" />,
    title: 'Joint Health',
    description: 'Strengthens joints and bones for better mobility'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Prevents Illness',
    description: 'Boosts immune system to prevent and fight illness'
  },
  {
    icon: <HeartPulse className="w-8 h-8" />,
    title: 'Increases Vitality',
    description: 'Natural boost for sex drive and overall vitality'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Blood Circulation',
    description: 'Promotes efficient blood flow throughout the body'
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'Brain Function',
    description: 'Enhances cognitive function and mental clarity'
  },
  {
    icon: <Droplets className="w-8 h-8" />,
    title: 'Reduces Inflammation',
    description: 'Natural anti-inflammatory properties for whole-body health'
  }
];

// Memoized benefit card component
const BenefitCard = memo(({ benefit, index }: { benefit: typeof BENEFITS_DATA[0], index: number }) => (
  <div
    className="group relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative">
      <div className="mb-4 text-primary group-hover:text-amber-600 transition-colors duration-300">
        {benefit.icon}
      </div>
      <h3 className="font-montserrat font-semibold text-lg text-primary mb-2">
        {benefit.title}
      </h3>
      <p className="text-gray-600">
        {benefit.description}
      </p>
    </div>
  </div>
));

BenefitCard.displayName = 'BenefitCard';

export default function Benefits() {
  // Memoize background patterns to prevent recreation on each render
  const backgroundPatterns = useMemo(() => (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#23408f]/5 to-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(35,64,143,0.1),transparent_50%)]" />
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(98,182,203,0.1),transparent_50%)]" />
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(244,235,208,0.1),transparent_50%)]" />
        </div>
      </div>
    </div>
  ), []);

  return (
    <section className="relative overflow-hidden py-20 p-10">
      {backgroundPatterns}

      {/* Organic shapes with reduced animations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#23408f]/5 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sand/10 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-primary mb-6">
            Nature's Ultimate Superfood
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Sea moss is one of nature's most powerful superfoods, offering remarkable benefits from 
            dissolving excess mucus and slowing signs of aging to improving digestion and fighting 
            iron deficiency. With 92 of the 102 minerals our bodies need, it's a complete wellness solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {BENEFITS_DATA.map((benefit, index) => <BenefitCard key={index} benefit={benefit} index={index} />)}
        </div>
        <div className="mt-16 text-center">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            <span>Discover Our Products</span>
          </Link>
        </div>
      </div>
    </section>
  );
}