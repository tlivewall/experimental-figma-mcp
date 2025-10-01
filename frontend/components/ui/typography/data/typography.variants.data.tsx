import { cva } from "class-variance-authority";

// In this file you can pre define options for typography components
// These options have to correspond to the options in the design system you can find in the Figma file


export const typographyVariants = cva(
  "",
  {
    variants: {
      family: {
        default: 'font-default antialiased',
        heading: 'font-heading antialiased',
      },
      size: {
        default: "md:text-[16px] md:leading-[24px]",
        h1: "md:text-[36px] md:leading-[24px]",
        h2: "md:text-[28px] md:leading-[24px]",
        body16: "md:text-[16px] md:leading-[24px]",
        body14: "md:text-[14px] md:leading-[22px]",
        cta20: "md:text-[20px] md:leading-[20px]",
        heading56: "md:text-[56px] md:leading-[56px]",
        heading48: "md:text-[48px] md:leading-[48px]", 
        heading40: "md:text-[40px] md:leading-[40px]",
        // h3: ...more,
      },
      mobileSize: {
        default: "text-[16px] leading-[26px]",
        h1: "text-[48px] leading-[48px]",
        h2: "text-[32px] leading-[40px]",
        body16: "text-[16px] leading-[24px]",
        body14: "text-[14px] leading-[22px]",
        cta20: "text-[20px] leading-[20px]",
        heading56: "text-[48px] leading-[48px]",
        heading48: "text-[48px] leading-[48px]", 
        heading40: "text-[40px] leading-[40px]",
        // h3: ...more,
      },
      color: {
        default: "text-black",
        primary: "text-primary",
        secondary: "text-secondary",
        black: "text-[#000017]",
        gray: "text-[#666674]",
        // tertiary: "text-tertiary",
        // white: "text-white",
        // statusRed: ...more,
      },
      weight: {
        default: "font-normal",
        bold: "font-bold",
        semibold: "font-semibold",
        // light: "font-light",
        // medium: "font-medium",
      }
    },
    defaultVariants: {
      family: "default",
      color: "default",
      size: "default",
      mobileSize: "default",
      weight: "default"
    },
  }
);