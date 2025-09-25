/**
 * Base Storyblok component interfaces
 */

export interface StoryblokComponent {
  _uid: string;
  component: string;
  _editable?: string;
  [key: string]: any;
}

export interface StoryblokAsset {
  id: number;
  alt: string;
  filename: string;
  copyright?: string;
  title?: string;
  focus?: string;
  name?: string;
  is_external_url?: boolean;
}

export interface StoryblokLink {
  id?: string;
  url?: string;
  linktype?: 'url' | 'story' | 'asset' | 'email';
  fieldtype?: string;
  cached_url?: string;
  anchor?: string;
  target?: '_self' | '_blank';
  story?: {
    id: number;
    name: string;
    slug: string;
    full_slug: string;
    url: string;
  };
}

export interface StoryblokRichtext {
  type: string;
  content?: StoryblokRichtext[];
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
  attrs?: Record<string, any>;
  text?: string;
}

export interface StoryblokStory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  created_at: string;
  published_at: string;
  first_published_at: string;
  content: Record<string, any>;
  sort_by_date: string | null;
  position: number;
  tag_list: string[];
  is_startpage: boolean;
  parent_id: number | null;
  meta_data: Record<string, any> | null;
  group_id: string;
  default_full_slug: string | null;
  translated_slugs: Array<{
    path: string;
    name: string;
    lang: string;
  }>;
  lang: string;
  path?: string;
  alternates?: StoryblokStory[];
  url?: string;
}

export interface StoryblokSEO extends StoryblokComponent {
  component: 'seo';
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: StoryblokAsset;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: StoryblokAsset;
  keywords?: string;
  canonical_url?: string;
  robots?: string;
}

export interface StoryblokMenu extends StoryblokComponent {
  component: 'menu';
  menu_items?: StoryblokMenuItem[];
}

export interface StoryblokMenuItem extends StoryblokComponent {
  component: 'menu_item';
  label?: string;
  link?: StoryblokLink;
  sub_menu?: StoryblokMenuItem[];
}

export interface StoryblokPage extends StoryblokComponent {
  component: 'page';
  SEO?: StoryblokSEO;
  body?: StoryblokComponent[];
}

export interface StoryblokMenuContent {
  header_menu?: StoryblokMenuItem[];
  footer_menu?: StoryblokMenuItem[];
}
