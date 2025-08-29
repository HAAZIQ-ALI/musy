 // Color management module
let colorThief;
let trackColors = {};

// Fixed colors to use as fallbacks
const fallbackColors = [
  [30, 215, 96],   // Spotify green
  [75, 145, 239],  // Blue
  [233, 69, 96],   // Red
  [255, 184, 0]    // Yellow
];

// Function to apply background colors based on album art or track index
function applyBackground(trackIndex) {
  if (!colorThief) {
    colorThief = new ColorThief();
  }
  
  let r, g, b;
  
  try {
    // First try to use cached colors if we have them
    if (trackIndex !== undefined && trackColors[trackIndex]) {
      [r, g, b] = trackColors[trackIndex];
      console.log(`Using cached colors for track ${trackIndex}: rgb(${r},${g},${b})`);
    } else {
      // Try to get color from the specific album art image
      const imgId = trackIndex === 1 ? 'albumArt2' : 'albumArt1';
      const img = document.getElementById(imgId);
      
      if (img && img.complete && img.naturalWidth > 0) {
        [r, g, b] = colorThief.getColor(img);
        
        // Cache the colors we successfully extracted
        if (trackIndex !== undefined) {
          trackColors[trackIndex] = [r, g, b];
        }
        
        console.log(`Extracted colors from ${imgId}: rgb(${r},${g},${b})`);
      } else {
        // Use fallback colors if image isn't ready
        const fallbackColor = trackIndex !== undefined ? 
          fallbackColors[trackIndex % fallbackColors.length] : 
          fallbackColors[0];
        
        [r, g, b] = fallbackColor;
        console.log(`Using fallback colors: rgb(${r},${g},${b})`);
      }
    }
    
    // Apply the colors
    document.getElementById("dynamic-bg").style.background =
      `linear-gradient(80deg, rgba(${r},${g},${b},0.9),#0a0a0a)`;

    document.getElementById("playback").style.background =
      `linear-gradient(95deg, rgba(${r},${g},${b},0.7),#0a0a0a)`;
      
  } catch (error) {
    console.error("Error applying colors:", error);
    
    // Use default color in case of error
    [r, g, b] = fallbackColors[0];
    
    document.getElementById("dynamic-bg").style.background =
      `linear-gradient(80deg, rgba(${r},${g},${b},0.9),#0a0a0a)`;

    document.getElementById("playback").style.background =
      `linear-gradient(95deg, rgba(${r},${g},${b},0.7),#0a0a0a)`;
  }
}

// Export functions for use in other scripts
window.applyBackground = applyBackground;
window.preloadImages = function() {
  const images = document.querySelectorAll('img[id^="albumArt"]');
  images.forEach(img => {
    if (!img.complete) {
      img.onload = function() {
        console.log(`Image ${img.id} loaded successfully`);
      };
      img.onerror = function() {
        console.error(`Failed to load image ${img.id}`);
      };
    }
  });
};

// Initial setup on page load
window.onload = () => {
  // Preload all album art images
  window.preloadImages();
  
  // Set initial colors
  applyBackground(0);
  
  // Pre-cache colors for the second track after a short delay
  setTimeout(() => {
    try {
      if (colorThief) {
        const img2 = document.getElementById('albumArt2');
        if (img2 && img2.complete && img2.naturalWidth > 0) {
          trackColors[1] = colorThief.getColor(img2);
          console.log("Pre-cached colors for track 1:", trackColors[1]);
        }
      }
    } catch (e) {
      console.log("Could not pre-cache track colors:", e);
    }
  }, 1000);
};