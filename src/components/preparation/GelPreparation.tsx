import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PREPARATION_INFO = {
  initial: {
    title: 'Initial Preparation',
    duration: '5-10 minutes',
    description: 'Rinse your sea moss thoroughly to remove any debris. Inspect for quality and prepare your alkaline water.'
  },
  soak: {
    title: 'Soak and Hydrate',
    duration: '12-24 hours',
    description: 'Place the cleaned sea moss in alkaline water. The moss will expand, so ensure there is enough water to cover it completely.'
  },
  blend: {
    title: 'Blend and Store',
    duration: '10-15 minutes',
    description: 'Blend sea moss with fresh alkaline water, optional flaxseed, and key lime juice until smooth. Store in an airtight container.'
  }
};

const PREPARATION_STEPS = [
  {
    title: 'Measure your sea moss',
    description: 'Start by accurately measuring your dried sea moss to ensure consistent results.',
    image: 'https://yrlwfarajldbigpdyfuu.supabase.co/storage/v1/object/public/media//Scale.jpg'
  },
  {
    title: 'Rinse your sea moss',
    description: 'Thoroughly rinse your sea moss to remove any sea salt and debris.',
    image: 'https://yrlwfarajldbigpdyfuu.supabase.co/storage/v1/object/public/media//Rinse.jpg'
  },
  {
    title: 'Soak your sea moss',
    description: 'Soak the sea moss in clean, filtered water for 12-24 hours until it expands.',
    image: 'https://yrlwfarajldbigpdyfuu.supabase.co/storage/v1/object/public/media//Cleaning.jpg'
  },
  {
    title: 'Blend and heat',
    description: 'Blend the soaked sea moss with fresh water until smooth, then heat gently.',
    image: 'https://yrlwfarajldbigpdyfuu.supabase.co/storage/v1/object/public/media//Prep.jpg'
  },
  {
    title: 'Measure out portions',
    description: 'Carefully measure out portions for consistent serving sizes.',
    image: 'https://yrlwfarajldbigpdyfuu.supabase.co/storage/v1/object/public/media//Pour%202.jpg'
  },
  {
    title: 'Fill your mason jar',
    description: 'Transfer the prepared sea moss gel into clean mason jars for storage.',
    image: 'https://yrlwfarajldbigpdyfuu.supabase.co/storage/v1/object/public/media//Pour.jpg'
  }
];

export default function GelPreparation() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % PREPARATION_STEPS.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + PREPARATION_STEPS.length) % PREPARATION_STEPS.length);
  };

  return (
    <section className="py-16 bg-white p-10">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-montserrat font-bold text-3xl text-primary mb-8 text-center">
            Making Sea Moss Gel
          </h2>
          
          {/* Preparation Info */}
          <div className="mb-12 space-y-8">
            {Object.values(PREPARATION_INFO).map((info, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-primary">{info.title}</h3>
                  <span className="text-sm text-gray-500">{info.duration}</span>
                </div>
                <p className="text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>

          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevStep}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Previous step"
            >
              <ChevronLeft size={24} className="text-primary" />
            </button>

            <button
              onClick={nextStep}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Next step"
            >
              <ChevronRight size={24} className="text-primary" />
            </button>

            {/* Slideshow Container */}
            <div className="overflow-hidden rounded-xl shadow-xl bg-white">
              <div
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentStep * 100}%)` }}
              >
                <div className="flex">
                  {PREPARATION_STEPS.map((step, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="relative">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-[600px] object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                          <h3 className="text-white text-2xl font-semibold mb-2">
                            Step {index + 1}: {step.title}
                          </h3>
                          <p className="text-white/90 text-lg">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {PREPARATION_STEPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-primary/5 rounded-lg p-8">
              <h3 className="font-semibold text-lg text-primary mb-4">
                Required Ingredients
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                  Sea Moss
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                  Alkaline Water
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                  Flaxseed (optional)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                  Key Limes
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 rounded-lg p-8">
              <h3 className="font-semibold text-lg text-primary mb-4">
                Health Benefits
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                  Nature's Collagen for skin health
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                  Helps rid the body of mucus and improves respiratory health
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                  Aids in digestion and supports gut health
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 bg-primary/5 rounded-lg p-8">
            <h3 className="font-semibold text-lg text-primary mb-4">
              Important Tips
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                Use filtered or spring water for best results
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                Store in airtight containers in the refrigerator
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                Gel will thicken more as it cools
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                Use within 3-4 weeks for best quality
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}