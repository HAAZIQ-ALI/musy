 // Move applyBackground outside of window.onload to make it globally available
let colorThief;

// Function to apply background colors based on album art
function applyBackground() {
  const img = document.getElementById('albumArt');
  
  if (!colorThief) {
    colorThief = new ColorThief();
  }
  
  try {
    const [r, g, b] = colorThief.getColor(img);
    
    document.getElementById("dynamic-bg").style.background =
      `linear-gradient(80deg, rgba(${r},${g},${b},0.9),#0a0a0a)`;

    document.getElementById("playback").style.background =
      `linear-gradient(95deg, rgba(${r},${g},${b},0.7),#0a0a0a)`;
      
    console.log(`Applied color theme: rgb(${r},${g},${b})`);
  } catch (error) {
    console.error("Error applying colors:", error);
  }
}

// Export function for use in other scripts
window.applyBackground = applyBackground;

// Initial setup on page load
window.onload = () => {
  const img = document.getElementById('albumArt');

  if (img.complete) {
    applyBackground();
  } else {
    img.addEventListener('load', applyBackground);
  }
};