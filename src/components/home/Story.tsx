import React from 'react';
import { Anchor, Leaf, Droplets } from 'lucide-react';

const BENEFITS = [
  {
    icon: <Anchor className="w-8 h-8 text-primary" />,
    title: 'Traditionally Sourced',
    description: 'Hand-picked from pristine Caribbean waters using traditional methods that preserve marine ecosystems.'
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: '100% Natural',
    description: "Pure sea moss with no additives, preservatives, or artificial ingredients. Just nature's goodness."
  },
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: 'Mineral Rich',
    description: 'Packed with 92 of the 102 minerals our bodies need, including iodine, zinc, and potassium.'
  }
];

export default function Story() {
  return (
    <section id="story" className="py-16 p-10">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <video
              preload="none"
              autoPlay
              muted
              loop
              playsInline
              loading="lazy"
              className="rounded-lg shadow-xl w-full h-full object-cover"
              poster="https://static.wixstatic.com/media/c73eb8_85787c9c9a494149befb2a50e52ee396~mv2.jpg"
            >
              <source
                src="https://video.wixstatic.com/video/c73eb8_cb03fc2c04244c54ad8709d34a623b7b/480p/mp4/file.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-[200px] h-[200px] rounded object-cover"
                poster="https://static.wixstatic.com/media/c73eb8_85787c9c9a494149befb2a50e52ee396~mv2.jpg"
              >
                <source
                  src="https://video.wixstatic.com/video/c73eb8_7ffc16d4e0c84a2d86b67e7260830348/480p/mp4/file.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          <div>
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-6">
              Our Story & Mission
            </h2>
            <p className="text-gray-600 mb-8">
              For generations, the pristine waters of the Caribbean Ocean have provided some of the world's finest sea moss. Our journey began with a simple mission: to share this natural superfood with health-conscious individuals while honoring traditional sourcing methods and supporting local communities.
            </p>
            
            <div className="space-y-6">
              {BENEFITS.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-sand p-3 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-montserrat font-semibold text-lg text-primary mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}