/**
 * Centralized Vanta.js Background Manager
 * This file handles the animated background for all pages.
 * Uses the theme configuration from theme-config.js
 */

// Initialize Vanta.js with theme-aware colors
function initVantaBackground() {
  // Check if all dependencies are loaded
  if (typeof VANTA === 'undefined' || typeof THEME_CONFIG === 'undefined' || typeof VANTA_CONFIG === 'undefined') {
    console.log("Waiting for Vanta.js dependencies to load...");
    setTimeout(initVantaBackground, 100);
    return;
  }

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

    // Initialize Vanta.js with current theme colors
    try {
      window.VANTA.current = VANTA.FOG({
        ...VANTA_CONFIG,
        ...colors,
      });
      console.log("Vanta.js background initialized successfully");
    } catch (error) {
      console.error("Error initializing Vanta.js:", error);
    }
  }, 200);
}

// Initialize when DOM is ready and scripts are loaded
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", () => {
    // Wait for all scripts to load
    setTimeout(initVantaBackground, 800);
  });
} else {
  // DOM already loaded, wait for scripts
  setTimeout(initVantaBackground, 800);
}

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
