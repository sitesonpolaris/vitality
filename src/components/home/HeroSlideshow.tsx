import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function HeroSlideshow() {



  return (
    <div className="relative md:h-[calc(70vh)] h-[calc(90vh)]">
      <video 
        preload="metadata"
        autoPlay 
        muted 
        loop 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        playsInline
        poster="https://static.wixstatic.com/media/c73eb8_85787c9c9a494149befb2a50e52ee396~mv2.jpg"
      >
        <source 
          src="https://video.wixstatic.com/video/c73eb8_67563f46d4564a7b92ce47bac9931bff/480p/mp4/file.mp4" 
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-[#23408f]/40 p-10">
        <div className="container-custom h-full flex items-center">
          <div className="max-w-2xl text-white">
            {/* Logo with animated glow */}
            <div className="mb-8 relative inline-block">
              {/* Animated glowing circles */}
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-white rounded-full opacity-100 animate-pulse-slow mix-blend-screen"></div>
                <div className="absolute inset-0 bg-white rounded-full opacity-90 animate-pulse-slower mix-blend-screen"></div>
              </div>
              {/* Logo */}
              <img 
                src="https://static.wixstatic.com/media/c73eb8_f1111a297cd94b96bd2d0be6c9d2d39f~mv2.png"
                alt="Vitality = Longevity Logo"
                className="w-48 h-auto relative mix-blend-normal"
              />
            </div>
            <h1 className="font-montserrat font-bold text-4xl md:text-6xl leading-tight mb-6">
              <span className="text-white">Authentic</span>{' '}
              <span className="inline-block">
                <span className="text-white">
                  Irish Moss
                </span>
              </span>{' '}
              <span className="text-white">aka</span>{' '}
              <span className="inline-block">
                <span className="bg-gradient-to-r from-amber-500 via-purple-600 to-green-500 text-transparent bg-clip-text animate-gradient">
                  Seamoss
                </span>
              </span>
            </h1>
            <p className="text-xl mb-8">
              Sourced and Crafted in the Beautiful Caribbean Ocean
            </p>
              <div className="flex flex-wrap gap-4"> 
                <Link
                  to="/collections"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Shop Now
                </Link>
              <button
                onClick={() => {
                  const storySection = document.querySelector('#story');
                  if (storySection) {
                    storySection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center space-x-2 text-white hover:text-amber-600 transition-colors"
              >
                <Play size={24} />
                <span>Learn About Seamoss</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}