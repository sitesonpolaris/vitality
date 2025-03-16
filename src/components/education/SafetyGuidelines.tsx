import React from 'react';
import { Shield, Users, AlertCircle, CheckCircle } from 'lucide-react';

export default function SafetyGuidelines() {
  return (
    <section className="py-20 bg-primary/5 p-10">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-8">
            <Shield size={32} className="text-coral" />
            <h2 className="font-montserrat font-bold text-4xl text-primary">
              Safety & Usage Guidelines
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="font-montserrat font-semibold text-2xl text-primary">
                  Safe for Most People
                </h3>
              </div>

              <div className="space-y-6">
                <p className="text-gray-600">
                  Sea moss is generally safe for most people, including:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Infants and toddlers",
                    "Children and teenagers",
                    "Pregnant women",
                    "Nursing mothers",
                    "Adults of all ages",
                    "Elderly individuals"
                  ].map((group, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <CheckCircle size={20} className="text-green-500" />
                      {group}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-coral" />
                    <h4 className="font-montserrat font-semibold text-xl text-primary">
                      Precautions
                    </h4>
                  </div>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                      Consult healthcare provider if you have specific medical conditions
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                      Start with small amounts to test tolerance
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-coral rounded-full mt-2" />
                      Monitor for any adverse reactions
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 p-6 rounded-lg mt-8">
                  <h4 className="font-montserrat font-semibold text-xl text-primary mb-4">
                    Recommended Usage
                  </h4>
                  <ul className="space-y-3 text-gray-600">
                    <li>Start with 1-2 tablespoons daily</li>
                    <li>Can be taken morning or evening</li>
                    <li>Best consumed with food or beverages</li>
                    <li>Store properly in refrigerator</li>
                    <li>Use within recommended timeframe</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}