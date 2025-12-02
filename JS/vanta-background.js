/**
 * Centralized Vanta.js Background Manager
 * This file handles the animated background for all pages.
 * Uses the theme configuration from theme-config.js
 */

let vantaEffect = null;

// Initialize Vanta.js with theme-aware colors
function initVantaBackground() {
  // Check for VANTA (can be window.VANTA or global VANTA)
  const VANTA_AVAILABLE = (typeof window !== 'undefined' && window.VANTA) || (typeof VANTA !== 'undefined');
  
  if (!VANTA_AVAILABLE) {
    console.log("Waiting for Vanta.js to load...");
    setTimeout(initVantaBackground, 200);
    return;
  }
  
  if (typeof THEME_CONFIG === 'undefined' || typeof VANTA_CONFIG === 'undefined') {
    console.log("Waiting for theme config to load...");
    setTimeout(initVantaBackground, 200);
    return;
  }

  // Get the VANTA object
  const VANTA = window.VANTA || (typeof VANTA !== 'undefined' ? VANTA : null);
  if (!VANTA || !VANTA.FOG) {
    console.error("VANTA.FOG is not available");
    return;
  }

  // Wait for theme to be applied
  setTimeout(() => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    
    console.log("Initializing Vanta.js with theme:", isDark ? "dark" : "light");

    // Get colors from theme configuration
    const colors = isDark ? THEME_CONFIG.dark : THEME_CONFIG.light;

    // Destroy existing effect if it exists
    if (vantaEffect) {
      try {
        vantaEffect.destroy();
      } catch (e) {
        console.log("Error destroying previous effect:", e);
      }
      vantaEffect = null;
    }

    // Initialize Vanta.js with current theme colors
    try {
      vantaEffect = VANTA.FOG({
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
        speed: 1.0,
        zoom: 0.8,
      });
      
      console.log("Vanta.js background initialized successfully", vantaEffect);
      
      // Ensure canvas is positioned correctly after a short delay
      setTimeout(() => {
        const canvas = document.body.querySelector('canvas');
        if (canvas) {
          canvas.style.position = 'fixed';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.zIndex = '-1';
          canvas.style.pointerEvents = 'none';
          console.log("Canvas styled:", canvas);
        } else {
          console.warn("Canvas not found after initialization");
        }
      }, 500);
    } catch (error) {
      console.error("Error initializing Vanta.js:", error);
    }
  }, 300);
}

// Initialize when DOM is ready and scripts are loaded
function startVantaInit() {
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initVantaBackground, 1000);
    });
  } else {
    setTimeout(initVantaBackground, 1000);
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
