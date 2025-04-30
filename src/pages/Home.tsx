import React from 'react';
import { products } from '../data/products';
import HeroSlideshow from '../components/home/HeroSlideshow';
import Flyers from '../components/home/Flyers';
import FeaturedCollections from '../components/home/FeaturedCollections';
import Story from '../components/home/Story'
import Vitals from '../components/home/Vitals'
import Gallery from '../components/home/Gallery'
import Benefits from '../components/home/Benefits';
import TestimonialCarousel from '../components/home/TestimonialCarousel';
import InstagramFeed from '../components/home/InstagramFeed';


function Home() {
  const gelProducts = products.filter(p => p.category === 'gel');
  const driedProducts = products.filter(p => p.category === 'dried');


  return (
    <div>
      <HeroSlideshow />
      <Vitals />
       <Flyers />
      <FeaturedCollections products={gelProducts} />
      <Story />
      <FeaturedCollections products={driedProducts} />
      <Gallery />
      <Benefits />
      <TestimonialCarousel />
      <InstagramFeed />



    </div>
  );
}

export default Home;