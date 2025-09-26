import React from 'react';
import { StoryblokQuickActions } from 'types/storyblok';
import { QuickActionsFields } from 'types/figma/quick-actions.types';
import QuickActions from './quick-actions.component';

type Props = StoryblokQuickActions;

/**
 * Storyblok wrapper component for QuickActions
 * Transforms Storyblok data to Figma component props
 */
const QuickActionsStoryblok: React.FC<Props> = (props) => {
  console.log("QuickActionsStoryblok", props);
  const { 
    title, 
    items, 
    layout, 
    show_more_button, 
    more_button_text, 
    more_button_link 
  } = props;

  // Early return for validation
  if (!title || !items || items.length === 0) {
    return null;
  }

  // Transform Storyblok data to Figma component format
  const quickActionsProps: QuickActionsFields = {
    title,
    items: items.map(item => ({
      title: item.title,
      description: item.description,
      icon: item.icon?.filename,
      href: item.link?.cached_url || item.link?.url || undefined
    })),
    layout: layout || 'vertical',
    showMoreButton: show_more_button || false,
    moreButtonText: more_button_text || 'Bekijk meer',
    moreButtonHref: more_button_link?.cached_url || more_button_link?.url || undefined
  };

  return <QuickActions {...quickActionsProps} />;
};

export default QuickActionsStoryblok;
