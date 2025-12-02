/**
 * Centralized Theme Configuration
 * This file contains all theme-related colors and settings for the website.
 * Update colors here to change them across all pages.
 */

// Theme color configurations
const THEME_CONFIG = {
  light: {
    // Light theme colors
    highlightColor: 0xffffff,
    midtoneColor: 0x954f6c,
    lowlightColor: 0xffffff,
    baseColor: 0xffffff,
  },
  dark: {
    // Dark theme colors - current index.html dark theme
    highlightColor: 0x6e2b62, // Deep Plum (as a subtle highlight)
    midtoneColor: 0x1f162f, // Midnight Purple
    lowlightColor: 0x080707, // True Black
    baseColor: 0x080707, // True Black
  }
};

// Vanta.js configuration
const VANTA_CONFIG = {
  el: "body",
  mouseControls: true,
  touchControls: true,
  gyroControls: true,
  minHeight: 100.0,
  minWidth: 100.0,
  speed: 2.5,
  zoom: 1.6,
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { THEME_CONFIG, VANTA_CONFIG };
}
