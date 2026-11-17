/**
 * Hero/landing section component.
 *
 * Renders a prominent hero section with headline, intro text, and call-to-action button.
 * The background is the brand gradient from the `hero-start`/`hero-end` tokens
 * (deeper in dark mode); white text stays above 6.4:1 contrast along all of it.
 */

import React from 'react';
import Button from './Button'; // Assuming Button is in the same directory or adjust path
import Container from '@/app/_components/container'; // Common container
import Image from 'next/image';

interface HeroSectionProps {
  headline: string;
  introText: string;
  ctaLabel: string;
  ctaLink: string;
}

/**
 * Displays a hero section with headline, intro, and CTA button.
 *
 * @param headline - Main headline text
 * @param introText - Supporting intro text
 * @param ctaLabel - Call-to-action button label
 * @param ctaLink - Call-to-action button link
 */
const HeroSection: React.FC<HeroSectionProps> = ({ headline, introText, ctaLabel, ctaLink }) => {
  return (
    <section className="bg-gradient-to-r from-hero-start to-hero-end text-primary-foreground py-20 md:py-32">
      <Container>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
          <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto">
            {/* The logo's black lettering vanishes on the dark-mode gradient, so dark mode
                shows the variant with grey lettering on its own dark tile (rounded here).
                An image can't follow the colour tokens, hence the dark: classes. */}
            <Image src="/images/logo/rsgBe.svg" alt="RSG Belgium Logo" width={240} height={240} priority className="dark:hidden" />
            <Image src="/images/logo/rsgBe_light.svg" alt="RSG Belgium Logo" width={240} height={240} priority className="hidden dark:block rounded-2xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {headline}
            </h1>
            <p className="text-lg md:text-xl mb-10 leading-relaxed">
              {introText}
            </p>
            <Button href={ctaLink} size="lg" variant="inverse">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
