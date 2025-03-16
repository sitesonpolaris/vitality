import React from 'react';
import { Instagram } from 'lucide-react';

const INSTAGRAM_POSTS = [
  {
    id: '1',
    image: 'https://static.wixstatic.com/media/c73eb8_582ab6883bbb4ecba5cf287ac12b349b~mv2.jpg',
    likes: 312,
    caption: 'Experience the power of nature with our premium sea moss products 🌿 #ZazuMalazu #Wellness'
  },
  {
    id: '2',
    image: 'https://static.wixstatic.com/media/c73eb8_7da0ee2bc18c4eeeb4792603d3f66178~mv2.jpg',
    likes: 278,
    caption: 'Transform your health journey with our authentic Caribbean sea moss 🌊 #NaturalWellness'
  },
  {
    id: '3',
    image: 'https://static.wixstatic.com/media/c73eb8_4b74d36502764a20b144049bfe1f3fe9~mv2.jpg',
    likes: 425,
    caption: 'Start your day with the power of sea moss 🌅 #MorningRoutine #Vitality'
  },
  {
    id: '4',
    image: 'https://static.wixstatic.com/media/c73eb8_5d7f8f50c89a4be4b4776967beea9c75~mv2.jpg',
    likes: 367,
    caption: 'Quality you can trust, results you can feel 💪 #ZazuMalazu #SeaMoss'
  }
];

export default function InstagramFeed() {
  return (
    <section className="py-16 p-10">
      <div className="container-custom">
        <div className="flex items-center justify-center space-x-2 mb-12">
          <Instagram size={28} className="text-primary" />
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary">
            @zazu_malazu_lifestyle_brooklyn
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/zazu_malazu_lifestyle_brooklyn"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
                <span className="font-semibold mb-2">❤️ {post.likes}</span>
                <p className="text-sm text-center line-clamp-3">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="#"
            className="inline-flex items-center space-x-2 text-primary hover:text-amber-600 transition-colors"
            href="https://www.instagram.com/zazu_malazu_lifestyle_brooklyn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="font-montserrat font-semibold">Follow Us on Instagram</span>
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}