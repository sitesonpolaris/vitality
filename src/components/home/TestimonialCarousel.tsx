import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Testimonial } from '../types';

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    text: "I've noticed a significant improvement in my energy levels since incorporating this sea moss into my daily routine. The quality is unmatched!",
    rating: 5,
    date: '2024-02-15'
  },
  {
    id: '2',
    name: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    text: 'The transparency about sourcing and the educational content really sets this brand apart. Plus, the product quality is exceptional.',
    rating: 5,
    date: '2024-02-10'
  },
  {
    id: '3',
    name: 'Emma Davis',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
    text: "As someone who's tried multiple sea moss products, this is by far the best. The difference in quality is noticeable from day one.",
    rating: 5,
    date: '2024-02-05'
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container-custom">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="relative max-w-4xl mx-auto">
          <button 
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white p-2 rounded-full shadow-md hover:bg-sand transition-colors"
          >
            <ChevronLeft size={24} className="text-primary" />
          </button>

          <div className="overflow-hidden">
            <div 
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              <div className="flex">
                {TESTIMONIALS.map((testimonial) => (
                  <div 
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-montserrat font-semibold text-lg text-primary">
                            {testimonial.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < testimonial.rating
                                    ? 'fill-coral text-coral'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-lg italic">{testimonial.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white p-2 rounded-full shadow-md hover:bg-sand transition-colors"
          >
            <ChevronRight size={24} className="text-primary" />
          </button>

          <div className="flex justify-center space-x-2 mt-6">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}