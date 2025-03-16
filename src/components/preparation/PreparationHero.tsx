import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function PreparationHero() {
  return (
    <div className="relative bg-primary text-white py-20 p-10 md:h-[calc(50vh)] h-[calc(70vh)]">
      <div className="absolute inset-0 bg-[url('https://static.wixstatic.com/media/c73eb8_6ac8b51ac1e04822b5ce0a4478176884~mv2.png')] bg-cover bg-center opacity-20" />
      
      <div className="container-custom relative z-10 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Store</span>
        </Link>

        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Leaf size={24} className="text-coral" />
            <h1 className="font-montserrat font-bold text-4xl">
              Sea Moss Preparation Guide
            </h1>
          </div>
          <p className="text-lg text-white/80">
            Learn how to prepare and use our different sea moss products for maximum benefits. 
            Follow our detailed guides for the best results.
          </p>
        </div>
      </div>
    </div>
  );
}