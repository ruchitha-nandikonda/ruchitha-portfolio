/**
 * Centralized Vanta.js Background Manager
 * This file handles the animated background for all pages.
 * Uses the theme configuration from theme-config.js
 */

let vantaEffect = null;
let isInitializing = false;

// Initialize Vanta.js with theme-aware colors
function initVantaBackground() {
  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    return;
  }
  
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
  if (!VANTA) {
    console.error("VANTA is not available");
    return;
  }
  
  // Try WAVES first (more wavy style), fallback to FOG
  const effectType = VANTA.WAVES ? 'WAVES' : (VANTA.FOG ? 'FOG' : null);
  if (!effectType) {
    console.error("No Vanta.js effect available");
    return;
  }

  // Mark as initializing
  isInitializing = true;

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
        // Remove any existing canvas elements
        const existingCanvases = document.body.querySelectorAll('canvas.vanta-canvas');
        existingCanvases.forEach(canvas => canvas.remove());
      } catch (e) {
        console.log("Error destroying previous effect:", e);
      }
      vantaEffect = null;
    }

    // Initialize Vanta.js with current theme colors - using WAVES for original wavy style
    try {
      if (effectType === 'WAVES') {
        vantaEffect = VANTA.WAVES({
          el: document.body,
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 100.0,
          minWidth: 100.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: colors.midtoneColor,
          shininess: 50,
          waveHeight: 20,
          waveSpeed: 1.5,
          zoom: 0.75,
        });
      } else {
        // Fallback to FOG with original settings
        vantaEffect = VANTA.FOG({
          el: document.body,
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 100.0,
          minWidth: 100.0,
          highlightColor: colors.highlightColor,
          midtoneColor: colors.midtoneColor,
          lowlightColor: colors.lowlightColor,
          baseColor: colors.baseColor,
          speed: 2.5,
          zoom: 1.6,
        });
      }
      
      console.log("Vanta.js background initialized successfully", vantaEffect);
      
      // Mark initialization as complete
      isInitializing = false;
      
      // Ensure canvas is positioned correctly for wavy flowy effect
      setTimeout(() => {
        const canvas = document.body.querySelector('canvas.vanta-canvas');
        if (canvas) {
          canvas.style.position = 'fixed';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.zIndex = '-1';
          canvas.style.pointerEvents = 'none';
          console.log("Canvas styled for wavy effect:", canvas);
        } else {
          console.warn("Canvas not found after initialization");
        }
      }, 500);
    } catch (error) {
      console.error("Error initializing Vanta.js:", error);
      isInitializing = false;
    }
  }, 300);
}

// Update canvas size on window resize for continuous wavy effect
if (typeof window !== 'undefined') {
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (vantaEffect && vantaEffect.resize) {
        vantaEffect.resize();
      }
    }, 250);
  });
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
