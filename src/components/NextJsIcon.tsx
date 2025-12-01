import React from "react";

interface NextJsIconProps {
  size?: number | string;
  color?: string;
}

/**
 * Next.js SVG Icon
 * @param size - width/height of the icon (default: 40)
 * @param color - color of the icon (default: currentColor)
 */
const NextJsIcon: React.FC<NextJsIconProps> = ({ size = 40, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Next.js logo"
  >
    <circle cx="90" cy="90" r="90" fill={color} fillOpacity="0.1" />
    <path
      d="M120.744 144.188h10.08L99.36 69.6h-10.08l-31.464 74.588h10.08l7.92-19.08h36.048l7.92 19.08Zm-38.52-27.72 15.48-37.32 15.48 37.32h-30.96Z"
      fill={color}
    />
    <ellipse
      cx="144.52"
      cy="123.5"
      rx="7.5"
      ry="7.5"
      fill={color}
    />
  </svg>
);

export default NextJsIcon;
