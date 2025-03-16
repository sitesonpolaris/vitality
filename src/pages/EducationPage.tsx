import React from 'react';
import Header from '../components/Header';
import EducationHero from '../components/education/EducationHero';
import BenefitsOverview from '../components/education/BenefitsOverview';
import MineralContent from '../components/education/MineralContent';
import HealthConditions from '../components/education/HealthConditions';
import SeaMossTypes from '../components/education/SeaMossTypes';
import SafetyGuidelines from '../components/education/SafetyGuidelines';
import Footer from '../components/Footer';

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <EducationHero />
        <BenefitsOverview />
        <MineralContent />
        <SeaMossTypes />
        <HealthConditions />
        <SafetyGuidelines />
      </main>
    </div>
  );
}