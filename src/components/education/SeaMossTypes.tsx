import React from 'react';
import { Dna, Sparkles, Eye, Shield, Heart, Leaf, Brain, Battery as Bacteria } from 'lucide-react';

const PURPLE_BENEFITS = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Immune Support',
    description: 'Strengthens immune system response and overall defense mechanisms'
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Fights Free Radicals',
    description: 'Rich in anthocyanins that combat oxidative stress and aging'
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Visual Health',
    description: 'Supports eye health and maintains visual acuity'
  },
  {
    icon: <Bacteria className="w-6 h-6" />,
    title: 'Fights Infections',
    description: 'Natural antimicrobial and antifungal properties'
  }
];

const GOLD_BENEFITS = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Gut Health',
    description: 'Promotes digestive health and nutrient absorption'
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: 'Thyroid Regulation',
    description: 'Supports optimal thyroid function with natural iodine'
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Nature's Multivitamin",
    description: '92 essential minerals for complete nutrition'
  },
  {
    icon: <Dna className="w-6 h-6" />,
    title: 'Natural Decongestant',
    description: 'Helps clear airways and reduce mucus buildup'
  }
];

export default function SeaMossTypes() {
  return (
    <section className="py-20 bg-white p-10">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-montserrat font-bold text-4xl text-primary mb-6">
            Purple vs Gold Sea Moss
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            While both varieties offer incredible health benefits, purple sea moss contains a powerful 
            antioxidant called "anthocyanin" - the pigment that gives it its distinctive color. This 
            unique compound provides additional health-promoting properties.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Purple Sea Moss */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-3"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles size={32} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-2xl text-primary">
                    Purple Sea Moss
                  </h3>
                  <p className="text-purple-600">Rich in Anthocyanins</p>
                </div>
              </div>

              <div className="space-y-6">
                {PURPLE_BENEFITS.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-montserrat font-semibold text-lg text-primary mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gold Sea Moss */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl transform -rotate-3"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <Leaf size={32} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-2xl text-primary">
                    Gold Sea Moss
                  </h3>
                  <p className="text-amber-600">Traditional Powerhouse</p>
                </div>
              </div>

              <div className="space-y-6">
                {GOLD_BENEFITS.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-montserrat font-semibold text-lg text-primary mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-primary/5 rounded-xl p-8">
          <h3 className="font-montserrat font-semibold text-2xl text-primary mb-4 text-center">
            Making the Right Choice
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-montserrat font-semibold text-lg text-primary mb-2">
                Choose Purple Sea Moss if you want:
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  Enhanced antioxidant protection
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  Stronger immune system support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  Better visual health benefits
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-montserrat font-semibold text-lg text-primary mb-2">
                Choose Gold Sea Moss if you want:
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  Traditional thyroid support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  Comprehensive mineral intake
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  Digestive system benefits
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}