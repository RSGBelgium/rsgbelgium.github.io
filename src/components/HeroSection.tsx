/**
 * Hero/landing section component.
 *
 * Renders a prominent hero section with headline, intro text, and call-to-action button.
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
    <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 md:py-32 dark:text-lightblue">
      <Container>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">
          <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto">
            <Image src="/images/logo/rsgBe.svg" alt="RSG Belgium Logo" width={240} height={240} priority />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 dark:text-lightblue">
              {headline}
            </h1>
            <p className="text-lg md:text-xl mb-10 leading-relaxed dark:text-lightblue">
              {introText}
            </p>
            <Button href={ctaLink} size="lg" variant="outline" className="dark:text-lightblue">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
