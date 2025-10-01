'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Typography from 'components/ui/typography/typography.component';
import { ContentCardUspFields } from 'types/figma/card-slider.types';
import CardTopRight from '@assets/images/card-top-right.svg';

type Props = ContentCardUspFields & {
  isMobile?: boolean;
};

/**
 * ContentCardUsp (Content Card) - Card component with image, title, USPs, and action buttons
 * Features responsive design for desktop and mobile
 * Auto-detects "VIS" in title and colors it based on card index (even=orange, odd=purple)
 */
const ContentCardUsp: React.FC<Props> = ({
  title,
  image,
  usps,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  isMobile = false,
  cardIndex = 0,
}) => {
  // Early return for validation
  if (!title || !image || !usps || usps.length === 0) {
    return null;
  }

  // Auto-detect "VIS" in title and determine color based on card index
  const visRegex = /VIS/i;
  const hasVis = visRegex.test(title);
  const highlightColor = cardIndex % 2 === 0 ? '#fc4d16' : '#3053f9'; // Even=orange, Odd=purple
  const cardPadding = isMobile ? 'pt-2 px-2' : 'pt-3 px-3';
  const contentPadding = isMobile ? 'p-2 gap-3' : 'p-3 gap-4';
  const borderRadius = isMobile ? 'rounded-[8px]' : 'rounded-[12px]';
  const imageBorderRadius = isMobile ? 'rounded-[6px]' : 'rounded-[8px]';
  const titleSize = isMobile ? 'heading40' : 'heading48';
  const titleMobileSize = isMobile ? 'heading40' : 'heading48';

  // Render title with VIS highlighted if found
  const renderTitle = () => {
    if (!hasVis) {
      return (
        <Typography
          type="h3"
          size={titleSize}
          mobileSize={titleMobileSize}
          weight="bold"
          color="black"
          className="uppercase font-heading"
        >
          {title}
        </Typography>
      );
    }

    // Split title by "VIS" (case-insensitive)
    const parts = title.split(visRegex);
    const visMatch = title.match(visRegex)?.[0] || 'VIS';
    
    return (
      <Typography
        type="h3"
        size={titleSize}
        mobileSize={titleMobileSize}
        weight="bold"
        color="black"
        className="uppercase font-heading"
      >
        {parts[0]}
        <span style={{ color: highlightColor }}>{visMatch}</span>
        {parts[1]}
      </Typography>
    );
  };

  return (
    <div
      className={`bg-white border border-[#000017] ${borderRadius} overflow-hidden flex flex-col w-full`}
    >
      {/* Image Section */}
      <div className={`${cardPadding} pb-0 relative`}>
        <div className={`relative w-full aspect-[792/445.5] ${imageBorderRadius} overflow-hidden`}>
          <Image
            src={image.filename}
            alt={image.alt || title}
            fill
            className="object-cover"
          />
                  {/* Top Right SVG Overlay */}
        <div className="absolute top-[-14px] right-[-14px] pointer-events-none">
          <CardTopRight className="w-auto h-auto" />
        </div>
        </div>
        

      </div>

      {/* Content Section */}
      <div className={`flex flex-col ${contentPadding}`}>
        {/* Title and USPs */}
        <div className="flex flex-col gap-1.5">
          {renderTitle()}

          {/* USP List */}
          <div className="flex flex-col gap-[6px]">
            {usps.slice(0, 3).map((usp) => (
              <div key={usp} className="flex gap-[6px] items-start">
                {/* Check Icon */}
                <div className="w-3 h-3 flex-shrink-0 mt-[2px]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                      fill="#000017"
                    />
                  </svg>
                </div>

                {/* USP Text */}
                <Typography
                  type="p"
                  size="body16"
                  color="gray"
                  className="flex-1"
                >
                  {usp}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full">
          {/* Primary Button */}
          {primaryButtonHref ? (
            <Link
              href={primaryButtonHref}
              className="bg-[#000017] px-2.5 py-1.5 rounded-[360px] flex items-center gap-0.5 transition-opacity hover:opacity-90"
            >
              <Typography
                type="span"
                size="cta20"
                weight="bold"
                className="text-white uppercase tracking-[0.8px] font-heading"
              >
                {primaryButtonText}
              </Typography>
            </Link>
          ) : (
            <button
              type="button"
              className="bg-[#000017] px-2.5 py-1.5 rounded-[360px] flex items-center gap-0.5 transition-opacity hover:opacity-90"
            >
              <Typography
                type="span"
                size="cta20"
                weight="bold"
                className="text-white uppercase tracking-[0.8px] font-heading"
              >
                {primaryButtonText}
              </Typography>
            </button>
          )}

          {/* Secondary Button */}
          <div className="flex items-center gap-1.5">
            {secondaryButtonHref ? (
              <Link
                href={secondaryButtonHref}
                className="flex items-center gap-1.5 transition-opacity hover:opacity-90"
              >
                <Typography
                  type="span"
                  size="cta20"
                  weight="bold"
                  color="black"
                  className="uppercase tracking-[0.8px] font-heading"
                >
                  {secondaryButtonText}
                </Typography>
                <div className="w-[44px] h-[44px] border border-[#000017] rounded-[360px] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                      fill="#000017"
                    />
                  </svg>
                </div>
              </Link>
            ) : (
              <button
                type="button"
                className="flex items-center gap-1.5 transition-opacity hover:opacity-90"
              >
                <Typography
                  type="span"
                  size="cta20"
                  weight="bold"
                  color="black"
                  className="uppercase tracking-[0.8px] font-heading"
                >
                  {secondaryButtonText}
                </Typography>
                <div className="w-[44px] h-[44px] border border-[#000017] rounded-[360px] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                      fill="#000017"
                    />
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCardUsp;


