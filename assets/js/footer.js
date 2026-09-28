// Footer JavaScript

// Arrow rotation based on scroll
document.addEventListener("DOMContentLoaded", function () {
  const arrowImage = document.querySelector(".footx-vic--arrow");

  if (arrowImage) {
    function handleScroll() {
      // Get scroll position
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Calculate rotation based on scroll (adjust multiplier for sensitivity)
      const rotation = scrollTop * 0.9; // 0.1 degrees per pixel scrolled

      // Apply rotation to the arrow
      arrowImage.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial call to set starting position
    handleScroll();
  }
});
