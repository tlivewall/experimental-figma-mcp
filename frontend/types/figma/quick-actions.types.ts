export interface QuickActionItemFields {
  title: string;
  description: string;
  icon?: string;
  href?: string;
}

export interface QuickActionsFields {
  title: string;
  items: QuickActionItemFields[];
  layout?: 'vertical' | 'horizontal';
  showMoreButton?: boolean;
  moreButtonText?: string;
  moreButtonHref?: string;
}
