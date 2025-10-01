/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-array-index-key */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Typography from 'components/ui/typography/typography.component';
import Container from 'components/ui/container/container.component';
import { CardSliderFields } from 'types/figma/card-slider.types';
import { ContentCardUsp } from './components';

type Props = CardSliderFields;

/**
 * CardSlider - Horizontal card carousel component
 * Desktop: Shows 3 cards with navigation, scrolls 3 at a time
 * Mobile: Horizontal scroll with pagination dots
 */
const CardSlider: React.FC<Props> = ({ title, cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Cards per view on desktop
  const CARDS_PER_VIEW = 3;

  // Early return for validation
  if (!title || !cards || cards.length === 0) {
    return null;
  }

  // Calculate navigation state
  useEffect(() => {
    const maxIndex = Math.max(0, cards.length - CARDS_PER_VIEW);
    setIsAtStart(currentIndex === 0);
    setIsAtEnd(currentIndex >= maxIndex);
  }, [currentIndex, cards.length]);

  // Desktop navigation: scroll by step size (3 cards or remaining cards)
  const handleNext = () => {
    const remainingCards = cards.length - (currentIndex + CARDS_PER_VIEW);
    const stepSize = Math.min(CARDS_PER_VIEW, remainingCards);
    
    if (stepSize > 0) {
      setCurrentIndex((prev) => prev + stepSize);
    }
  };

  const handlePrev = () => {
    const stepSize = Math.min(CARDS_PER_VIEW, currentIndex);
    setCurrentIndex((prev) => Math.max(0, prev - stepSize));
  };

  // Mobile: Calculate which dot should be active based on scroll position
  const [activeDotIndex, setActiveDotIndex] = useState(0);

  const handleMobileScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.scrollWidth / cards.length;
    const activeIndex = Math.round(scrollLeft / cardWidth);
    
    setActiveDotIndex(activeIndex);
  };

  // Calculate pagination dots (max 5 visible)
  const maxDots = 5;
  const totalDots = Math.min(cards.length, maxDots);

  return (
    <section className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <Container>
          <div className="flex flex-col gap-4">
            {/* Title */}
            <Typography
              type="h2"
              size="heading56"
              mobileSize="heading48"
              weight="bold"
              color="black"
              className="uppercase font-heading"
            >
              {title}
            </Typography>

            {/* Cards Container */}
            <div className="relative overflow-hidden">
              <div
                className="flex gap-3 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / CARDS_PER_VIEW + (24 / (1312 / CARDS_PER_VIEW)))}%)`,
                }}
              >
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0"
                    style={{ width: 'calc((100% - 48px) / 3)' }}
                  >
                    <ContentCardUsp {...card} cardIndex={index} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              {/* Pagination Dots */}
              <div className="flex gap-1 items-center">
                {Array.from({ length: totalDots }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1 h-1 rounded-bl-[16px] transition-colors duration-200 ${
                      index === Math.floor(currentIndex / CARDS_PER_VIEW)
                        ? 'bg-[rgba(252,77,22,1)]'
                        : 'bg-[rgba(204,204,209,1)]'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-1 items-center">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isAtStart}
                  className={`w-[44px] h-[44px] border border-[#000017] rounded-[360px] flex items-center justify-center transition-opacity ${
                    isAtStart
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:opacity-80 cursor-pointer'
                  }`}
                  aria-label="Previous cards"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="rotate-180"
                  >
                    <path
                      d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                      fill="#000017"
                    />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isAtEnd}
                  className={`w-[44px] h-[44px] border border-[#000017] rounded-[360px] flex items-center justify-center transition-opacity ${
                    isAtEnd
                      ? 'opacity-30 cursor-not-allowed'
                      : 'hover:opacity-80 cursor-pointer'
                  }`}
                  aria-label="Next cards"
                >
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
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden px-2">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <Typography
            type="h2"
            size="heading48"
            mobileSize="heading48"
            weight="bold"
            color="black"
            className="uppercase font-heading"
          >
            {title}
          </Typography>

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleMobileScroll}
            className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex-shrink-0 snap-start w-[312px]"
              >
                <ContentCardUsp {...card} cardIndex={index} isMobile={true} />
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center">
            <div className="flex gap-1 items-center">
              {Array.from({ length: totalDots }).map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-1 rounded-full transition-colors duration-200 ${
                    index === activeDotIndex ? 'bg-[#000017]' : 'bg-[#CCCCD1]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar globally for mobile */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default CardSlider;


