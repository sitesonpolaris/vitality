import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Heart, Shield } from 'lucide-react';

export default function EducationHero() {
  return (
    <div className="relative bg-primary text-white py-24 overflow-hidden p-10">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/90" />
        <div className="absolute inset-0 bg-[url('https://static.wixstatic.com/media/c73eb8_85787c9c9a494149befb2a50e52ee396~mv2.jpg')] bg-cover bg-center opacity-10" />
      </div>

      <div className="container-custom relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft size={20} />
          <span>Back to Store</span>
        </Link>

        <div className="max-w-4xl">
          <h1 className="font-montserrat font-bold text-5xl mb-6">
            The Power of Sea Moss:
            <span className="block text-coral mt-2">Nature's Complete Superfood</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl">
            Discover why sea moss is called nature's multivitamin, containing 92 of the 102 minerals 
            our bodies need for optimal health and vitality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "92 Essential Minerals",
                description: "Natural source of vital nutrients"
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Complete Wellness",
                description: "Supports multiple body systems"
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Ancient Wisdom",
                description: "Centuries of traditional use"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
              >
                <div className="text-coral mb-4">{item.icon}</div>
                <h3 className="font-montserrat font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-white/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}