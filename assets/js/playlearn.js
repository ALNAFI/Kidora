//================================================================== Start play learn Navbar 4001 ================================================================
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

//================================================================== End play learn Navbar 4001 ================================================================

//================================================================== Start play learn S1 4002 ================================================================
// Play & Learn S1: scroll-reveal + gentle parallax for shapes (no jQuery)
(function () {
  function reveal(
    selector = ".js-playlearnS1-reveal",
    options = { threshold: 0.2 }
  ) {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("playlearnS1-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("playlearnS1-visible");
          io.unobserve(e.target);
        }
      });
    }, options);

    targets.forEach((t) => io.observe(t));
  }

  // small background parallax on scroll for the shapes group
  function parallax() {
    const shapes = document.querySelectorAll(".playlearnS1-shape");
    if (!shapes.length) return;

    const y = window.scrollY || 0;
    shapes.forEach((el, i) => {
      const speed = (i + 1) * 0.04; // mild
      el.style.transform = `translateY(${-(y * speed)}px)`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    reveal();
    window.addEventListener("scroll", parallax, { passive: true });
  });
})();

//================================================================== End play learn S1 4002     ================================================================

//================================================================== Start play learn S2 4003 ================================================================
// Play & Learn S2: sequential reveal based on scroll direction
(function () {
  const SECTION_SELECTOR = ".js-playlearnS2-section";
  const ITEM_SELECTOR = ".playlearnS2-item";
  const THRESHOLD = 0.2;
  const STAGGER_MS = 140; // delay between items

  let lastScrollY = window.scrollY;
  let isScrollingDown = true;

  // Track scroll direction
  function updateScrollDirection() {
    const currentScrollY = window.scrollY;
    isScrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;
  }

  function setVisibleSerial(items, show, reverseOrder = false) {
    const list = [...items].sort(
      (a, b) => (+a.dataset.seq || 0) - (+b.dataset.seq || 0)
    );

    // Reverse order if needed
    const orderedList = reverseOrder ? list.reverse() : list;

    orderedList.forEach((el, i) => {
      const t = setTimeout(() => {
        el.classList.toggle("playlearnS2-visible", show);
      }, STAGGER_MS * i);
      // store timeout id in case you need to cancel later
      el.dataset.tid = t;
    });
  }

  function initSequentialReveal() {
    const section = document.querySelector(SECTION_SELECTOR);
    if (!section) return;

    const items = section.querySelectorAll(ITEM_SELECTOR);
    if (!items.length) return;

    // Track scroll direction
    window.addEventListener("scroll", updateScrollDirection, { passive: true });

    // Observer to handle whole section entrance/exit
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal based on scroll direction
            // Scrolling down: 1 → 2 → 3
            // Scrolling up: 3 → 2 → 1
            setVisibleSerial(items, true, !isScrollingDown);
          } else {
            // Hide in reverse of reveal order
            setVisibleSerial(items, false, isScrollingDown);
          }
        });
      },
      { threshold: THRESHOLD, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(section);

    // Add persistent hover functionality for S2 items
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        // Remove active class from all items
        items.forEach((i) => i.classList.remove("playlearnS2-item--active"));
        // Add active class to hovered item
        item.classList.add("playlearnS2-item--active");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initSequentialReveal);
})();

//================================================================== End play learn S2 4003 ================================================================

//================================================================== Start play learn S3 4004 ================================================================
// Play & Learn S3: Direction-aware sequential reveal (down: top->bottom, up: bottom->top)
(function () {
  const ROOT_SELECTOR = ".playlearnS3-section";
  const ITEM_SELECTOR = ".js-playlearnS3-reveal";
  const THRESHOLD = 0.2;
  const STAGGER = 120; // ms

  let lastY = window.scrollY || 0;
  let direction = "down";

  function getSorted(items) {
    const arr = Array.from(items);
    // read sequence when provided, fallback to DOM order
    arr.sort((a, b) => {
      const sa = Number(a.dataset.seq || a.getBoundingClientRect().top);
      const sb = Number(b.dataset.seq || b.getBoundingClientRect().top);
      return direction === "down" ? sa - sb : sb - sa;
    });
    return arr;
  }

  function toggleSerial(items, show) {
    const ordered = getSorted(items);
    ordered.forEach((el, i) => {
      setTimeout(() => {
        el.classList.toggle("playlearnS3-visible", show);
      }, i * STAGGER);
    });
  }

  function init() {
    const root = document.querySelector(ROOT_SELECTOR);
    if (!root) return;

    const items = root.querySelectorAll(ITEM_SELECTOR);
    if (!items.length) return;

    // Watch scroll direction
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY || 0;
        direction = y > lastY ? "down" : "up";
        lastY = y;
      },
      { passive: true }
    );

    // Observe the section as a whole
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            toggleSerial(items, true); // reveal with current direction order
          } else {
            toggleSerial(items, false); // hide with current direction order
          }
        });
      },
      { threshold: THRESHOLD }
    );

    sectionObserver.observe(root);

    // Add persistent hover functionality for S3 chips
    const chips = root.querySelectorAll(".playlearnS3-chip");
    chips.forEach((chip) => {
      chip.addEventListener("mouseenter", () => {
        // Remove active class from all chips
        chips.forEach((c) => c.classList.remove("playlearnS3-chip--active"));
        // Add active class to hovered chip
        chip.classList.add("playlearnS3-chip--active");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

//================================================================== End play learn S3 4004 ================================================================

//================================================================== Start play learn S4 4005 ================================================================
// Play & Learn S4: reveal left->right on enter, fade right->left on leave
(function () {
  const SECTION = ".playlearnS4-section";
  const REVEAL = ".js-playlearnS4-reveal";
  const THRESHOLD = 0.2;
  const STAGGER = 140;

  function order(items, reverse = false) {
    const arr = Array.from(items).sort((a, b) => {
      return (+a.dataset.seq || 0) - (+b.dataset.seq || 0);
    });
    return reverse ? arr.reverse() : arr;
  }

  function serialToggle(items, add, reverseOrder) {
    order(items, reverseOrder).forEach((el, i) => {
      setTimeout(() => {
        if (add) {
          if (el.classList.contains("playlearnS4-item")) {
            el.classList.add("playlearnS4-visible");
          } else {
            el.classList.add("playlearnS4-revealed");
          }
        } else {
          if (el.classList.contains("playlearnS4-item")) {
            el.classList.remove("playlearnS4-visible");
          } else {
            el.classList.remove("playlearnS4-revealed");
          }
        }
      }, i * STAGGER);
    });
  }

  function init() {
    const section = document.querySelector(SECTION);
    if (!section) return;

    const items = section.querySelectorAll(REVEAL + ", .playlearnS4-item");
    if (!items.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // Enter: left -> right (in our seq order)
            serialToggle(items, true, false);
          } else {
            // Leave: right -> left (reverse order)
            serialToggle(items, false, true);
          }
        });
      },
      { threshold: THRESHOLD, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(section);
  }

  document.addEventListener("DOMContentLoaded", init);
})();

//================================================================== End play learn S4 4005 ================================================================

//================================================================== Start play learn S5 4006 ================================================================
// Play & Learn S5: reveal left->right on enter, fade right->left on leave
(function () {
  const SECTION = ".playlearnS5-section";
  const ITEMS = ".playlearnS5-card";
  const HEADERS = ".js-playlearnS5-reveal";
  const THRESHOLD = 0.2;
  const STAGGER = 140;

  function order(nodes, reverse = false) {
    const arr = Array.from(nodes).sort(
      (a, b) => (+a.dataset.seq || 0) - (+b.dataset.seq || 0)
    );
    return reverse ? arr.reverse() : arr;
  }

  function serial(nodes, show, reverseOrder) {
    order(nodes, reverseOrder).forEach((el, i) => {
      setTimeout(() => {
        if (el.matches(ITEMS)) {
          el.classList.toggle("playlearnS5-visible", show);
        } else {
          el.classList.toggle("playlearnS5-revealed", show);
        }
      }, i * STAGGER);
    });
  }

  function init() {
    const section = document.querySelector(SECTION);
    if (!section) return;

    const nodes = section.querySelectorAll(`${HEADERS}, ${ITEMS}`);
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // enter: left -> right
            serial(nodes, true, false);
          } else {
            // leave: right -> left
            serial(nodes, false, true);
          }
        });
      },
      { threshold: THRESHOLD, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(section);
  }

  document.addEventListener("DOMContentLoaded", init);
})();

//================================================================== End play learn S5 4006 ================================================================

//================================================================== Start play learn S6 4007 ================================================================
// =========================================================
// Play & Learn S6 - Scroll Reveal Animations
// =========================================================
(function () {
  const SECTION = ".playlearnS6-section";
  const REVEAL = ".js-playlearnS6-reveal";
  const EVENTS = ".playlearnS6-event";
  const THRESHOLD = 0.25;
  const STAGGER = 150;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function order(elements, reverse = false) {
    const arr = Array.from(elements).sort(
      (a, b) => (+a.dataset.seq || 0) - (+b.dataset.seq || 0)
    );
    return reverse ? arr.reverse() : arr;
  }

  function staggerToggle(elements, visible, reverseOrder = false) {
    order(elements, reverseOrder).forEach((el, i) => {
      if (prefersReducedMotion) {
        el.classList.toggle("playlearnS6-revealed", visible);
        if (el.matches(EVENTS))
          el.classList.toggle("playlearnS6-visible", visible);
      } else {
        setTimeout(() => {
          el.classList.toggle("playlearnS6-revealed", visible);
          if (el.matches(EVENTS))
            el.classList.toggle("playlearnS6-visible", visible);
        }, i * STAGGER);
      }
    });
  }

  function init() {
    const section = document.querySelector(SECTION);
    if (!section) return;

    const allElements = section.querySelectorAll(`${REVEAL}, ${EVENTS}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            staggerToggle(allElements, true, false); // reveal left→right or up→down
          } else {
            staggerToggle(allElements, false, true); // fade right→left or down→up
          }
        });
      },
      { threshold: THRESHOLD }
    );

    observer.observe(section);

    // Add persistent hover functionality
    const eventCards = section.querySelectorAll(".playlearnS6-event");

    eventCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        // Remove active class from all cards
        eventCards.forEach((c) =>
          c.classList.remove("playlearnS6-event--active")
        );
        // Add active class to hovered card
        card.classList.add("playlearnS6-event--active");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

//================================================================== End play learn S6 4007 ================================================================

//================================================================== Start play learn S7 4008 ================================================================
// =========================================================
// Play & Learn S7 - Parallax background & video modal
// =========================================================
(function () {
  const SECTION = document.querySelector(".playlearnS7-section");
  if (!SECTION) return;

  const BG = SECTION.querySelector(".playlearnS7-bg-img");
  const PLAY = SECTION.querySelector(".playlearnS7-playbtn");
  const MODAL = SECTION.querySelector(".playlearnS7-modal");
  const IFRAME = SECTION.querySelector(".playlearnS7-iframe");
  const CLOSE_SELECTORS = "[data-close-modal]";

  // Ensure the modal overlays the full page and is not clipped by section overflow/transform
  if (MODAL && MODAL.parentElement !== document.body) {
    document.body.appendChild(MODAL);
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ----- Scroll-based Parallax effect -----
  let ticking = false;

  function onScroll() {
    if (reduceMotion) return;
    if (!BG) {
      return;
    }

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = SECTION.getBoundingClientRect();
        // only parallax while in view to save work
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          // progress from 0..1 across the viewport
          const progress =
            (window.innerHeight - rect.top) /
            (window.innerHeight + rect.height);
          const scrollTranslate = (progress - 0.5) * 300; // px, faster parallax

          // Apply scroll-based transform
          BG.style.transform = `translateY(${scrollTranslate}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  // Initialize
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // ----- Modal helpers -----
  function openModal() {
    const base = PLAY.getAttribute("data-video") || "";
    const src = base.includes("?")
      ? `${base}&autoplay=1`
      : `${base}?autoplay=1`;
    IFRAME.setAttribute("src", src);
    MODAL.classList.add("playlearnS7-open");
    MODAL.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    MODAL.classList.remove("playlearnS7-open");
    MODAL.setAttribute("aria-hidden", "true");
    IFRAME.setAttribute("src", ""); // stop playback
    document.body.style.overflow = "";
  }

  // open on click
  PLAY.addEventListener("click", openModal);

  // close (backdrop or button)
  MODAL.addEventListener("click", (e) => {
    if (e.target.matches(CLOSE_SELECTORS)) closeModal();
  });

  // close with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && MODAL.classList.contains("playlearnS7-open"))
      closeModal();
  });
})();

//================================================================== End play learn S7 4008 ================================================================

//================================================================== Start play learn S8 4009 ================================================================
// =========================================================
// Play & Learn S8 - Testimonials (Carousel + Scroll Reveal)
// =========================================================
(function () {
  const SECTION = document.querySelector(".playlearnS8-section");
  if (!SECTION) return;

  const slides = Array.from(SECTION.querySelectorAll(".playlearnS8-slide"));
  const dots = Array.from(SECTION.querySelectorAll(".playlearnS8-dot"));
  const avatars = Array.from(SECTION.querySelectorAll(".playlearnS8-avatar"));

  let current = 0;
  let autoAdvanceTimer = null;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // --- Auto-advance functions ---
  function startAutoAdvance() {
    if (prefersReduced) return; // Don't auto-advance if user prefers reduced motion

    // Clear any existing timer first
    stopAutoAdvance();

    autoAdvanceTimer = setInterval(() => {
      const nextIndex = (current + 1) % slides.length;
      showSlide(nextIndex);
    }, 5000); // 5 seconds
  }

  function stopAutoAdvance() {
    if (autoAdvanceTimer) {
      clearInterval(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
  }

  // --- Carousel logic ---
  function showSlide(idx) {
    const newIndex = (idx + slides.length) % slides.length;

    // If it's the same slide, don't animate
    if (newIndex === current) return;

    // Fade out current slide
    slides[current].classList.add("fade-out");
    slides[current].classList.remove("playlearnS8-slide--active");

    // Update current index
    current = newIndex;

    // Update dots and avatars
    dots.forEach((d, i) => {
      const active = i === current;
      d.classList.toggle("playlearnS8-dot--active", active);
      d.setAttribute("aria-selected", active ? "true" : "false");
    });
    avatars.forEach((a, i) =>
      a.classList.toggle("playlearnS8-avatar--active", i === current)
    );

    // Fade in new slide after a short delay
    setTimeout(() => {
      slides[current].classList.remove("fade-out");
      slides[current].classList.add("playlearnS8-slide--active", "fade-in");

      // Remove fade-in class after animation completes
      setTimeout(() => {
        slides[current].classList.remove("fade-in");
      }, 800);
    }, 100);

    // Ensure all other slides are hidden
    slides.forEach((slide, i) => {
      if (i !== current) {
        slide.classList.remove("playlearnS8-slide--active");
        slide.classList.remove("fade-in");
        slide.classList.add("fade-out");
      }
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(+dot.dataset.index);
      stopAutoAdvance(); // Stop auto-advance when user manually clicks
      setTimeout(() => {
        startAutoAdvance(); // Restart with fresh timer
      }, 10000); // Restart after 10 seconds
    });
    dot.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showSlide(+dot.dataset.index);
        stopAutoAdvance(); // Stop auto-advance when user manually navigates
        setTimeout(() => {
          startAutoAdvance(); // Restart with fresh timer
        }, 10000); // Restart after 10 seconds
      }
    });
  });

  // Initialize avatar state with smooth animation
  slides.forEach((slide, i) => {
    if (i === 0) {
      slide.classList.add("playlearnS8-slide--active");
      slide.classList.remove("fade-out");
    } else {
      slide.classList.remove("playlearnS8-slide--active");
      slide.classList.add("fade-out");
    }
  });

  // Update dots and avatars for initial state
  dots.forEach((d, i) => {
    const active = i === 0;
    d.classList.toggle("playlearnS8-dot--active", active);
    d.setAttribute("aria-selected", active ? "true" : "false");
  });
  avatars.forEach((a, i) =>
    a.classList.toggle("playlearnS8-avatar--active", i === 0)
  );

  // Start auto-advance
  startAutoAdvance();

  // Hover pause functionality - apply to section and all slides
  SECTION.addEventListener("mouseenter", stopAutoAdvance);
  SECTION.addEventListener("mouseleave", startAutoAdvance);

  // Also pause when hovering over individual slides
  slides.forEach((slide) => {
    slide.addEventListener("mouseenter", stopAutoAdvance);
    slide.addEventListener("mouseleave", startAutoAdvance);
  });

  // Pause when hovering over dots and avatars
  [...dots, ...avatars].forEach((element) => {
    element.addEventListener("mouseenter", stopAutoAdvance);
    element.addEventListener("mouseleave", startAutoAdvance);
  });

  // Pause auto-advance when page is not visible (tab switching)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoAdvance();
    } else {
      startAutoAdvance();
    }
  });

  // --- Scroll reveal (stagger) ---
  const revealTargets = SECTION.querySelectorAll(".js-playlearnS8-reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Stagger when entering
        if (entry.isIntersecting) {
          const siblings = Array.from(revealTargets).sort(
            (a, b) => (+a.dataset.seq || 0) - (+b.dataset.seq || 0)
          );
          siblings.forEach((el, i) => {
            const apply = () => el.classList.add("playlearnS8-revealed");
            if (prefersReduced) apply();
            else setTimeout(apply, i * 120);
          });
        } else {
          // Fade out when leaving (reverse order so it feels natural)
          const siblings = Array.from(revealTargets).sort(
            (a, b) => (+b.dataset.seq || 0) - (+a.dataset.seq || 0)
          );
          siblings.forEach((el, i) => {
            const remove = () => el.classList.remove("playlearnS8-revealed");
            if (prefersReduced) remove();
            else setTimeout(remove, i * 80);
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(SECTION);
})();

//================================================================== End play learn S8 4009 ================================================================

//================================================================== Start play learn S9 4010 ================================================================
// no js for this section
//================================================================== End play learn S9 4010 ================================================================

//================================================================== Start play learn S10 4011 ================================================================
// =========================================================
// Play & Learn S10 - Parallax background for CTA section
// =========================================================
(function () {
  const section = document.querySelector(".playlearnS10-section");
  if (!section) return;

  const bg = section.querySelector(".playlearnS10-parallax");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // lightweight parallax only while section is in view
  let ticking = false;
  function update() {
    if (reduce) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const progress =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height); // 0..1
      const translate = (progress - 0.5) * 60; // px
      bg.style.transform = `translateY(${translate}px)`;
    }
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();

//================================================================== End play learn S10 4011 ================================================================

//================================================================== Start play learn Footer 4013 ================================================================
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
//================================================================== End play learn Footer 4012 ================================================================
