/**
 * Centralized Vanta.js Background Manager
 * This file handles the animated background for all pages.
 * Uses the theme configuration from theme-config.js
 */

// Initialize Vanta.js with theme-aware colors
function initVantaBackground() {
  // Wait for theme to be applied
  setTimeout(() => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    
    console.log("Initializing Vanta.js with theme:", isDark ? "dark" : "light");

    // Get colors from theme configuration
    const colors = isDark ? THEME_CONFIG.dark : THEME_CONFIG.light;

    // Destroy existing effect if it exists
    if (window.VANTA && window.VANTA.current) {
      window.VANTA.current.destroy();
    }

    // Initialize Vanta.js with current theme colors - using original OG implementation
    try {
      vantaEffect = VANTA.FOG({
        ...VANTA_CONFIG,
        el: document.body,
        highlightColor: colors.highlightColor,
        midtoneColor: colors.midtoneColor,
        lowlightColor: colors.lowlightColor,
        baseColor: colors.baseColor,
      });
      
  }, 200);
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit for theme manager to initialize
  setTimeout(initVantaBackground, 500);

  // Re-initialize when theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        console.log("Theme changed, reinitializing Vanta.js");
        initVantaBackground();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});

// Re-initialize when theme changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (
      mutation.type === "attributes" &&
      mutation.attributeName === "data-theme"
    ) {
      console.log("Theme changed, reinitializing Vanta.js");
      setTimeout(initVantaBackground, 300);
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});

// Export function for manual initialization if needed
if (typeof window !== 'undefined') {
  window.initVantaBackground = initVantaBackground;
}
