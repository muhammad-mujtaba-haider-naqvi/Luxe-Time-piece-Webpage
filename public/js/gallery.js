/**
 * Product Gallery - Image Switcher
 * Handles clicking on secondary images to display them as the primary image
 */
document.addEventListener('DOMContentLoaded', function() {
  const primaryImage = document.querySelector('.images .primary');
  const secondaryImages = document.querySelectorAll('.images .secondary img');
  
  if (!primaryImage || secondaryImages.length === 0) return;

  // Store original primary image src
  const originalPrimarySrc = primaryImage.src;
  
  // Add click handlers to secondary images
  secondaryImages.forEach(img => {
    img.addEventListener('click', function() {
      // Smooth transition effect
      primaryImage.style.opacity = '0';
      
      setTimeout(() => {
        primaryImage.src = this.src;
        primaryImage.style.opacity = '1';
      }, 200);
      
      // Update active state
      secondaryImages.forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Also make primary image clickable to show in a lightbox-style view (optional enhancement)
  primaryImage.addEventListener('click', function() {
    // Could add lightbox functionality here in future
  });
});
