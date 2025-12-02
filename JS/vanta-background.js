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
        el: document.body,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: colors.highlightColor,
        midtoneColor: colors.midtoneColor,
        lowlightColor: colors.lowlightColor,
        baseColor: colors.baseColor,
        speed: 2.5,
        zoom: 1.6,
      });
      console.log("Vanta.js background initialized successfully");
      
      // Ensure canvas is positioned correctly
      const canvas = document.body.querySelector('canvas');
      if (canvas) {
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
      }
    } catch (error) {
      console.error("Error initializing Vanta.js:", error);
    }
  }, 200);
}

// Initialize when DOM is ready and scripts are loaded
function startVantaInit() {
  // Wait for window.VANTA to be available (loaded from CDN)
  if (typeof window.VANTA === 'undefined') {
    setTimeout(startVantaInit, 100);
    return;
  }
  
  // Wait for theme config
  if (typeof THEME_CONFIG === 'undefined' || typeof VANTA_CONFIG === 'undefined') {
    setTimeout(startVantaInit, 100);
    return;
  }
  
  // Now initialize
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initVantaBackground, 500);
    });
  } else {
    setTimeout(initVantaBackground, 500);
  }
}

// Start initialization
startVantaInit();

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
