import React from 'react';
import PreparationHero from '../components/preparation/PreparationHero';
import GelPreparation from '../components/preparation/GelPreparation';
import UsageGuide from '../components/preparation/UsageGuide';
import HairGelPreparation from '../components/preparation/HairGelPreparation';
import Header from '../components/Header';
import Footer from '../components/Footer';


export default function PreparationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PreparationHero />
      <GelPreparation />
      <HairGelPreparation />
      <UsageGuide />

    </div>
  );
}