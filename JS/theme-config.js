/**
 * Centralized Theme Configuration
 * This file contains all theme-related colors and settings for the website.
 * Update colors here to change them across all pages.
 */

// Theme color configurations
const THEME_CONFIG = {
  light: {
    // Light theme colors - soft purple fog
    highlightColor: 0xf5e6f0,
    midtoneColor: 0xdfb8b2,
    lowlightColor: 0xf5e6f0,
    baseColor: 0xfaf5f8,
  },
  dark: {
    // Dark theme colors - smooth purple fog
    highlightColor: 0x623b5b, // Deep muted purple
    midtoneColor: 0x2b124c, // Dark violet
    lowlightColor: 0x190019, // Near-black wine
    baseColor: 0x190019, // Near-black wine
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
