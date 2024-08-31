import React from 'react';
import AppHeader from '@/components/HomeScreen/AppHeader';
import HeroSection from '@/components/HomeScreen/HeroSection';
import ServicesSection from '@/components/HomeScreen/ServicesSection';
import OffersSection from '@/components/HomeScreen/OffersSection';
import GallerySection from '@/components/HomeScreen/GallerySection';
import QuerySection from '@/components/HomeScreen/QuerySection';
import Footer from '@/components/HomeScreen/Footer';
import FacilitiesSection from '@/components/HomeScreen/FacilitiesSection';

const HomeScreen: React.FC = () => {
  return (
    <div>
      <AppHeader />
      <HeroSection />
      <ServicesSection />
      <OffersSection />
      <GallerySection />
      <FacilitiesSection />
      <QuerySection />
      <Footer />
    </div>
  );
};

export default HomeScreen;
