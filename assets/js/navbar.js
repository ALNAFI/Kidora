// Start  Navbar Link
document.querySelectorAll(".nav-pod .nav-link").forEach((a) => {
  a.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-pod .nav-link")
      .forEach((x) => x.classList.remove("active"));
    a.classList.add("active");
    a.setAttribute("aria-current", "page");
  });
});
// End  Navbar Link

// Close mobile navbar when clicking outside (only when collapsed)
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("primaryNav");
  const toggler = document.querySelector(".navbar-toggler");
  if (!nav || !toggler) return;

  function isCollapsedOpen() {
    return nav.classList.contains("show");
  }

  document.addEventListener("click", function (e) {
    if (!isCollapsedOpen()) return;
    const clickedInsideNav =
      e.target.closest("#primaryNav") || e.target.closest(".navbar-toggler");
    if (!clickedInsideNav) {
      // Use Bootstrap Collapse API to close cleanly
      const collapse = bootstrap.Collapse.getOrCreateInstance(nav);
      collapse.hide();
    }
  });
});

// Start Mobile Submenu Toggle (click only on <992px)
document.addEventListener("DOMContentLoaded", function () {
  const submenuToggles = document.querySelectorAll(
    ".dropdown-submenu > .dropdown-toggle"
  );
  const isMobile = () => window.innerWidth < 992; // Bootstrap lg breakpoint

  function closeAllSubmenus(scope) {
    (scope || document)
      .querySelectorAll(".dropdown-submenu > .dropdown-menu.show")
      .forEach((menu) => menu.classList.remove("show"));
  }

  submenuToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      if (!isMobile()) {
        return;
      } // desktop handled by hover CSS
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const submenu = this.nextElementSibling; // the nested .dropdown-menu
      if (!submenu) {
        return;
      }
      const isOpen = submenu.classList.contains("show");

      // Close siblings within the same parent menu level
      const containerMenu = this.closest(".dropdown-menu");
      if (containerMenu) {
        containerMenu
          .querySelectorAll(".dropdown-submenu > .dropdown-menu.show")
          .forEach((menu) => {
            if (menu !== submenu) menu.classList.remove("show");
          });
      } else {
        closeAllSubmenus();
      }

      submenu.classList.toggle("show", !isOpen);
    });
  });

  // Close on outside click (mobile only)
  document.addEventListener("click", function (e) {
    if (!isMobile()) {
      return;
    }
    if (!e.target.closest(".dropdown-submenu")) {
      closeAllSubmenus();
    }
  });

  // Reset any open submenus on resize across breakpoints
  window.addEventListener("resize", () => closeAllSubmenus());
});
// End Mobile Submenu Toggle

// Start Mobile Dropdown Smooth Animations
document.addEventListener("DOMContentLoaded", function () {
  const isMobile = () => window.innerWidth < 992;

  // Animation helpers
  function animateDropdownOpen(menu) {
    if (!isMobile()) return;

    // Set initial state with height animation
    menu.style.display = "block";
    menu.style.position = "static";
    menu.style.overflow = "hidden";
    menu.style.maxHeight = "0px";
    menu.style.opacity = "0";
    menu.style.transform = "translateY(8px)";
    menu.style.transition =
      "max-height 300ms ease, opacity 220ms ease, transform 220ms ease";

    // Get target height
    const targetHeight = menu.scrollHeight;

    // Animate menu panel
    requestAnimationFrame(() => {
      menu.style.maxHeight = targetHeight + "px";
      menu.style.opacity = "1";
      menu.style.transform = "translateY(0)";
    });

    // Animate items with stagger
    const items = menu.querySelectorAll(".dropdown-item");
    items.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(6px)";
      item.style.transition = "opacity 150ms ease, transform 150ms ease";

      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, index * 80); // 80ms stagger
    });

    // Clean up after animation
    setTimeout(() => {
      menu.style.maxHeight = "none";
      menu.style.overflow = "";
      menu.style.transition = "opacity 220ms ease, transform 220ms ease";
    }, 300);
  }

  function animateDropdownClose(menu) {
    if (!isMobile()) return;

    // Set up for height animation
    const currentHeight = menu.scrollHeight;
    menu.style.maxHeight = currentHeight + "px";
    menu.style.overflow = "hidden";
    menu.style.transition =
      "max-height 300ms ease, opacity 220ms ease, transform 220ms ease";

    // Animate items out first
    const items = menu.querySelectorAll(".dropdown-item");
    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = "0";
        item.style.transform = "translateY(6px)";
      }, index * 40); // Faster stagger for close
    });

    // Then animate menu panel height and opacity
    setTimeout(() => {
      menu.style.maxHeight = "0px";
      menu.style.opacity = "0";
      menu.style.transform = "translateY(8px)";

      setTimeout(() => {
        menu.style.display = "none";
        menu.style.transition = "";
        menu.style.opacity = "";
        menu.style.transform = "";
        menu.style.maxHeight = "";
        menu.style.overflow = "";

        // Reset items
        items.forEach((item) => {
          item.style.transition = "";
          item.style.opacity = "";
          item.style.transform = "";
        });
      }, 300);
    }, items.length * 40);
  }

  // Handle main dropdowns (Home, Pages, Blog)
  const mainDropdowns = document.querySelectorAll(".nav-item.dropdown");
  mainDropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", function (e) {
      if (!isMobile()) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const isOpen = menu.classList.contains("show");

      // Close other dropdowns
      mainDropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          const otherMenu = otherDropdown.querySelector(".dropdown-menu");
          if (otherMenu && otherMenu.classList.contains("show")) {
            otherMenu.classList.remove("show");
            animateDropdownClose(otherMenu);
          }
        }
      });

      if (isOpen) {
        menu.classList.remove("show");
        animateDropdownClose(menu);
        toggle.setAttribute("aria-expanded", "false");
      } else {
        menu.classList.add("show");
        animateDropdownOpen(menu);
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Handle submenu dropdowns
  const submenuDropdowns = document.querySelectorAll(".dropdown-submenu");
  submenuDropdowns.forEach((submenu) => {
    const toggle = submenu.querySelector(".dropdown-toggle");
    const menu = submenu.querySelector(".dropdown-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", function (e) {
      if (!isMobile()) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const isOpen = menu.classList.contains("show");

      // Close other submenus in same parent
      const parentMenu = submenu.closest(".dropdown-menu");
      if (parentMenu) {
        parentMenu
          .querySelectorAll(".dropdown-submenu .dropdown-menu.show")
          .forEach((otherMenu) => {
            if (otherMenu !== menu) {
              otherMenu.classList.remove("show");
              animateDropdownClose(otherMenu);
            }
          });
      }

      if (isOpen) {
        menu.classList.remove("show");
        animateDropdownClose(menu);
        toggle.setAttribute("aria-expanded", "false");
      } else {
        menu.classList.add("show");
        animateDropdownOpen(menu);
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    if (!isMobile()) return;

    const clickedInsideDropdown =
      e.target.closest(".nav-item.dropdown") ||
      e.target.closest(".dropdown-submenu") ||
      e.target.closest(".navbar-toggler");

    if (!clickedInsideDropdown) {
      // Close all dropdowns
      mainDropdowns.forEach((dropdown) => {
        const menu = dropdown.querySelector(".dropdown-menu");
        if (menu && menu.classList.contains("show")) {
          menu.classList.remove("show");
          animateDropdownClose(menu);
          dropdown
            .querySelector(".dropdown-toggle")
            .setAttribute("aria-expanded", "false");
        }
      });

      submenuDropdowns.forEach((submenu) => {
        const menu = submenu.querySelector(".dropdown-menu");
        if (menu && menu.classList.contains("show")) {
          menu.classList.remove("show");
          animateDropdownClose(menu);
          submenu
            .querySelector(".dropdown-toggle")
            .setAttribute("aria-expanded", "false");
        }
      });
    }
  });

  // Reset on resize and ensure desktop behavior
  function resetAllDropdowns() {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.style.display = "";
      menu.style.opacity = "";
      menu.style.transform = "";
      menu.style.transition = "";
      menu.style.maxHeight = "";
      menu.style.overflow = "";
      menu.style.position = "";
      menu.querySelectorAll(".dropdown-item").forEach((item) => {
        item.style.opacity = "";
        item.style.transform = "";
        item.style.transition = "";
      });
    });
  }

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      resetAllDropdowns();
    }
  });

  // Also reset on page load if desktop
  if (!isMobile()) {
    resetAllDropdowns();
  }
});
// End Mobile Dropdown Smooth Animations

// Start Desktop Dropdown Smooth Animations
document.addEventListener("DOMContentLoaded", function () {
  const isDesktop = () => window.innerWidth >= 992;

  // Desktop animation helpers
  function animateDesktopDropdownOpen(menu) {
    if (!isDesktop()) return;

    menu.style.display = "block";
    menu.style.opacity = "0";
    menu.style.visibility = "hidden";
    menu.style.transform = "translateY(-10px)";
    menu.style.transition =
      "opacity 200ms ease, transform 200ms ease, visibility 200ms ease";

    requestAnimationFrame(() => {
      menu.style.opacity = "1";
      menu.style.visibility = "visible";
      menu.style.transform = "translateY(0)";
    });

    // Animate items with stagger
    const items = menu.querySelectorAll(".dropdown-item");
    items.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(6px)";
      item.style.transition = "opacity 200ms ease, transform 200ms ease";

      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 50 + index * 50); // 50ms stagger starting at 50ms - much faster
    });

    // Keep transitions active for future animations
    setTimeout(() => {
      menu.style.transition =
        "opacity 200ms ease, transform 200ms ease, visibility 200ms ease";
    }, 200);
  }

  function animateDesktopDropdownClose(menu) {
    if (!isDesktop()) return;

    // Immediate close - no stagger for closing
    menu.style.opacity = "0";
    menu.style.transform = "translateY(-10px)";

    setTimeout(() => {
      menu.style.display = "none";
      menu.style.visibility = "hidden";
      // Don't reset transition - keep it for future animations
      menu.style.opacity = "";
      menu.style.transform = "";

      // Reset items immediately
      const items = menu.querySelectorAll(".dropdown-item");
      items.forEach((item) => {
        item.style.transition = "";
        item.style.opacity = "";
        item.style.transform = "";
      });
    }, 150); // Faster close - 150ms instead of 200ms
  }

  function animateDesktopSubmenuOpen(menu) {
    if (!isDesktop()) return;

    menu.style.display = "block";
    menu.style.opacity = "0";
    menu.style.visibility = "hidden";
    menu.style.transform = "translateX(-10px)";
    menu.style.transition =
      "opacity 200ms ease, transform 200ms ease, visibility 200ms ease";

    requestAnimationFrame(() => {
      menu.style.opacity = "1";
      menu.style.visibility = "visible";
      menu.style.transform = "translateX(0)";
    });

    // Animate items with stagger
    const items = menu.querySelectorAll(".dropdown-item");
    items.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(6px)";
      item.style.transition = "opacity 150ms ease, transform 150ms ease";

      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 50 + index * 50); // 50ms stagger starting at 50ms - much faster
    });

    // Keep transitions active for future animations
    setTimeout(() => {
      menu.style.transition =
        "opacity 200ms ease, transform 200ms ease, visibility 200ms ease";
    }, 200);
  }

  function animateDesktopSubmenuClose(menu) {
    if (!isDesktop()) return;

    // Immediate close - no stagger for closing
    menu.style.opacity = "0";
    menu.style.transform = "translateX(-10px)";

    setTimeout(() => {
      menu.style.display = "none";
      menu.style.visibility = "hidden";
      // Don't reset transition - keep it for future animations
      menu.style.opacity = "";
      menu.style.transform = "";

      // Reset items immediately
      const items = menu.querySelectorAll(".dropdown-item");
      items.forEach((item) => {
        item.style.transition = "";
        item.style.opacity = "";
        item.style.transform = "";
      });
    }, 150); // Faster close - 150ms instead of 200ms
  }

  // Handle main dropdowns (Home, Pages, Blog) on desktop
  const mainDropdowns = document.querySelectorAll(".nav-item.dropdown");
  mainDropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (!toggle || !menu) return;

    // Mouse enter - open dropdown
    dropdown.addEventListener("mouseenter", function () {
      if (!isDesktop()) return;

      // Close other dropdowns immediately
      mainDropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          const otherMenu = otherDropdown.querySelector(".dropdown-menu");
          if (otherMenu && otherMenu.style.display === "block") {
            animateDesktopDropdownClose(otherMenu);
          }
        }
      });

      // Small delay to prevent rapid switching
      setTimeout(() => {
        animateDesktopDropdownOpen(menu);
      }, 50);
    });

    // Mouse leave - close dropdown
    dropdown.addEventListener("mouseleave", function () {
      if (!isDesktop()) return;
      animateDesktopDropdownClose(menu);
    });
  });

  // Handle submenu dropdowns on desktop
  const submenuDropdowns = document.querySelectorAll(".dropdown-submenu");
  submenuDropdowns.forEach((submenu) => {
    const toggle = submenu.querySelector(".dropdown-toggle");
    const menu = submenu.querySelector(".dropdown-menu");

    if (!toggle || !menu) return;

    // Mouse enter - open submenu
    submenu.addEventListener("mouseenter", function () {
      if (!isDesktop()) return;

      // Close other submenus in same parent immediately
      const parentMenu = submenu.closest(".dropdown-menu");
      if (parentMenu) {
        parentMenu
          .querySelectorAll(".dropdown-submenu .dropdown-menu")
          .forEach((otherMenu) => {
            if (otherMenu !== menu && otherMenu.style.display === "block") {
              animateDesktopSubmenuClose(otherMenu);
            }
          });
      }

      // Small delay to prevent rapid switching
      setTimeout(() => {
        animateDesktopSubmenuOpen(menu);
      }, 50);
    });

    // Mouse leave - close submenu
    submenu.addEventListener("mouseleave", function () {
      if (!isDesktop()) return;
      animateDesktopSubmenuClose(menu);
    });
  });

  // Reset on resize
  window.addEventListener("resize", () => {
    if (!isDesktop()) {
      // Reset all desktop animations when switching to mobile
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.style.display = "";
        menu.style.opacity = "";
        menu.style.visibility = "";
        menu.style.transform = "";
        menu.style.transition = "";
      });
    }
  });
});
// End Desktop Dropdown Smooth Animations

// Start Search Overlay Toggle
const searchBtns = document.querySelectorAll('.btn-icon[aria-label="Search"]'); // only real search buttons
const searchOverlay = document.getElementById("searchOverlay");
const closeBtn = searchOverlay
  ? searchOverlay.querySelector(".btn-close-overlay")
  : null;
const searchInput = searchOverlay
  ? searchOverlay.querySelector(".search-input")
  : null;
const navCollapseEl = document.getElementById("primaryNav");

if (searchBtns && searchOverlay) {
  searchBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      setTimeout(() => searchInput && searchInput.focus(), 300); // focus after fade-in

      // If mobile menu is open, close it
      if (navCollapseEl && navCollapseEl.classList.contains("show")) {
        const collapse = bootstrap.Collapse.getOrCreateInstance(navCollapseEl);
        collapse.hide();
      }
    });
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    searchOverlay.classList.remove("active");
  });
}

// Close on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchOverlay.classList.remove("active");
  }
});
// End Search Overlay Toggle
