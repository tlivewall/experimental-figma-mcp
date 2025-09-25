'use client';

import { useStoryblokBridge } from '@storyblok/react';
import { ISbStoryData } from '@storyblok/react';
import { useState } from 'react';

interface StoryblokBridgeProps {
  story: ISbStoryData;
  enableBridge?: boolean;
}

/**
 * Storyblok Visual Editor Bridge
 * Enables live editing in the Storyblok visual editor
 */
export function StoryblokBridge({ story: initialStory, enableBridge = true }: StoryblokBridgeProps) {
  const [story, setStory] = useState(initialStory);

  // Only enable bridge in development and if explicitly enabled
  if (enableBridge && process.env.NODE_ENV === 'development') {
    useStoryblokBridge(story.id, (newStory) => {
      setStory(newStory);
      // Force a page refresh to update the content
      window.location.reload();
    }, {
      resolveRelations: [],
      resolveLinks: 'url',
    });
  }

  return null; // This component doesn't render anything
}

/**
 * Higher-order component to wrap pages with Storyblok bridge
 */
export function withStoryblokBridge<T extends { story: ISbStoryData }>(
  Component: React.ComponentType<T>
) {
  return function WrappedComponent(props: T) {
    return (
      <>
        <StoryblokBridge story={props.story} />
        <Component {...props} />
      </>
    );
  };
}
