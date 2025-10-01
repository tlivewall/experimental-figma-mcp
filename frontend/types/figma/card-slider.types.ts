export interface ContentCardUspFields {
  title: string;
  image: {
    filename: string;
    alt?: string;
  };
  usps: string[]; // List of USP items
  primaryButtonText: string;
  primaryButtonHref?: string;
  secondaryButtonText: string;
  secondaryButtonHref?: string;
  cardIndex?: number; // Index in slider to determine color (even=orange, odd=purple)
}

export interface CardSliderFields {
  title: string;
  cards: ContentCardUspFields[];
}


