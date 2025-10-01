import React from 'react';
import { StoryblokCardSlider } from 'types/storyblok';
import { CardSliderFields } from 'types/figma/card-slider.types';
import CardSlider from './card-slider.component';

type Props = StoryblokCardSlider;

/**
 * Storyblok wrapper component for CardSlider
 * Transforms Storyblok CMS data to Figma component props
 * Handles spacing/padding from CMS
 */
const CardSliderStoryblok: React.FC<Props> = (props) => {
  const { 
    title, 
    cards, 
    padding, 
    paddingMobile 
  } = props;

  // Early return for validation
  if (!title || !cards || cards.length === 0) {
    return null;
  }

  // Transform Storyblok data to Figma component format
  const cardSliderProps: CardSliderFields = {
    title,
    cards: cards.map(card => {
      // Parse USPs from textarea (split by newlines or semicolons)
      const uspsArray = typeof card.usps === 'string' 
        ? card.usps
            .split(/\n|;/)
            .map(usp => usp.trim())
            .filter(usp => usp.length > 0)
        : card.usps || [];

      return {
        title: card.title,
        image: {
          filename: card.image.filename,
          alt: card.image.alt || card.title
        },
        usps: uspsArray,
        primaryButtonText: card.primary_button_text,
        primaryButtonHref: card.primary_button_href,
        secondaryButtonText: card.secondary_button_text,
        secondaryButtonHref: card.secondary_button_href,
      };
    }),
  };

  // Padding class mapping (applies to both top and bottom)
  const getPaddingClass = (size?: string, defaultSize = 'medium') => {
    const paddingMap: Record<string, string> = {
      'none': '',
      'small': 'py-2',      // 16px top & bottom
      'medium': 'py-4',     // 32px top & bottom
      'large': 'py-9',      // 64px top & bottom
      'xlarge': 'py-14',    // 128px top & bottom
    };
    return paddingMap[size || defaultSize] || paddingMap[defaultSize];
  };

  const desktopPadding = getPaddingClass(padding);
  const mobilePadding = getPaddingClass(paddingMobile || padding);

  return (
    <div 
      className={`
        ${mobilePadding}
        md:${desktopPadding}
      `}
    >
      <CardSlider {...cardSliderProps} />
    </div>
  );
};

export default CardSliderStoryblok;


