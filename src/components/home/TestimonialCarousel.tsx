import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Kimberly W.',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
    text: "I've been using the purple sea moss gel for a month now and I can't believe the difference in my energy levels! My skin is glowing and I feel amazing.",
    rating: 5,
    date: '2024-03-10'
  },
  {
    id: '2',
    name: 'Marcus J.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
    text: 'The quality of this sea moss is exceptional. I mix it in my smoothies every morning and have noticed improved digestion and overall wellness.',
    rating: 5,
    date: '2024-03-05'
  },
  {
    id: '3',
    name: 'Sophia R.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    text: 'As someone with thyroid issues, this sea moss has been a game-changer. The natural iodine content has helped support my thyroid health tremendously.',
    rating: 5,
    date: '2024-02-28'
  },
  {
    id: '4',
    name: 'David L.',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800',
    text: 'I was skeptical at first, but after using the gold sea moss gel for two months, my joint pain has significantly decreased. This stuff is incredible!',
    rating: 5,
    date: '2024-02-20'
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
    <section className="py-20 bg-primary/5">
      <div className="container-custom">
        <h2 className="font-montserrat font-bold text-4xl text-primary text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="relative max-w-4xl mx-auto">
          <button 
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white p-2 rounded-full shadow-md hover:bg-sand transition-colors z-10"
            aria-label="Previous testimonial"
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
                    <div className="bg-white rounded-xl shadow-lg p-8">
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
                      <p className="text-gray-600 text-lg italic leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      <p className="text-sm text-gray-500 mt-4">
                        {new Date(testimonial.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white p-2 rounded-full shadow-md hover:bg-sand transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} className="text-primary" />
          </button>

          <div className="flex justify-center space-x-2 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}