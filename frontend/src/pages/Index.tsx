import { HeroSection } from '../components/landing/HeroSection';
import { WhatIsTradeySection } from '../components/landing/WhatIsTradeySection';
import { FeaturedItemsSection } from '../components/landing/FeaturedItemsSection';
import { CommunitySection } from '../components/landing/CommunitySection';
import { StickyFooter, FooterContent } from '../components/navigation/StickyFooter';

export function IndexPage() {
  return (
    <>
      <HeroSection />
      <WhatIsTradeySection />
      <FeaturedItemsSection />
      <CommunitySection />
      <StickyFooter heightValue="100dvh">
        <FooterContent />
      </StickyFooter>
    </>
  );
} 