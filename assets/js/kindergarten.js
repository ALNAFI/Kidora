// ====================================== StART Kindergarten sidebar/menu drawer functionality
(function () {
  const panel = document.getElementById("kSidebar");
  const dim = document.getElementById("kSidebarDim");
  const close = panel?.querySelector(".k-sidebar__close");

  // Collect all possible menu trigger buttons (mobile + desktop)
  const triggers = (() => {
    const btns = Array.from(
      document.querySelectorAll('.btn-icon[aria-label="Menu"]')
    );
    const legacy = document.getElementById("kMenuBtn");
    if (legacy && !btns.includes(legacy)) btns.push(legacy);
    return btns;
  })();

  if (!triggers.length || !panel || !dim) return;

  let lastTrigger = null; // remember which element opened the drawer

  const open = () => {
    panel.setAttribute("aria-hidden", "false");
    dim.classList.add("is-on");
    close?.focus(); // move focus into panel for accessibility
  };

  const closeDrawer = () => {
    panel.setAttribute("aria-hidden", "true");
    dim.classList.remove("is-on");
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  };

  const toggle = () => {
    const isHidden = panel.getAttribute("aria-hidden") !== "false";
    isHidden ? open() : closeDrawer();
  };

  // Bind click handlers to all triggers
  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      lastTrigger = btn;
      toggle();
    });
  });

  close?.addEventListener("click", closeDrawer);
  dim.addEventListener("click", closeDrawer);

  // Esc key closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.getAttribute("aria-hidden") === "false") {
      closeDrawer();
    }
  });
})();

// ====================================== End Kindergarten sidebar/menu drawer functionality

// Keep navbar fixed only after topbar scrolls out (fallback if CSS sticky is broken)
document.addEventListener("DOMContentLoaded", function () {
  const topbar = document.querySelector(".topbar");
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  let navHeight = 0;
  const updateNavHeight = () => {
    navHeight = navbar.getBoundingClientRect().height || 0;
    document.body.style.setProperty("--nav-height", navHeight + "px");
  };
  updateNavHeight();
  window.addEventListener("resize", updateNavHeight, { passive: true });

  const threshold = topbar ? topbar.offsetHeight || 0 : 0;

  const onScroll = () => {
    const y = window.scrollY || 0;
    if (y > threshold) {
      if (!navbar.classList.contains("is-fixed")) {
        navbar.classList.add("is-fixed");
        document.body.classList.add("has-fixed-nav");
      }
    } else {
      if (navbar.classList.contains("is-fixed")) {
        navbar.classList.remove("is-fixed");
        document.body.classList.remove("has-fixed-nav");
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

// kindergartenS2: scroll-reveal with threshold 0.2
(function () {
  function aboutusReveal(
    selector = ".js-aboutus-reveal",
    options = { threshold: 0.2 }
  ) {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("kindergartenS2-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("kindergartenS2-visible");
          io.unobserve(e.target);
        }
      });
    }, options);

    targets.forEach((t) => io.observe(t));
  }

  document.addEventListener("DOMContentLoaded", () => aboutusReveal());
})();

//   start kindergartenS2 button click for chnage paragraph

// Tab functionality for pill buttons 7001
(function () {
  let isAnimating = false; // Flag to prevent rapid clicking

  function initTabs() {
    const pills = document.querySelectorAll(".kindergartenS2-pill");
    const contentElements = document.querySelectorAll(".aboutus-content");

    // Initialize content state - ensure only the first content is visible
    contentElements.forEach((content, index) => {
      if (index === 0) {
        content.style.display = "block";
        content.style.opacity = "1";
      } else {
        content.style.display = "none";
        content.style.opacity = "0";
      }
    });

    // Ensure first pill is active by default
    pills.forEach((pill, index) => {
      if (index === 0) {
        pill.classList.add("is-active");
      } else {
        pill.classList.remove("is-active");
      }
    });

    pills.forEach((pill) => {
      pill.addEventListener("click", function () {
        // Prevent rapid clicking during animation
        if (isAnimating) {
          return;
        }

        // If this pill is already active, do nothing
        if (this.classList.contains("is-active")) {
          return;
        }

        // Set animation flag
        isAnimating = true;

        // Remove active class from all pills immediately
        pills.forEach((p) => p.classList.remove("is-active"));

        // Add active class to clicked pill immediately
        this.classList.add("is-active");

        // Get target content
        const buttonText = this.textContent.trim();
        let targetClass;

        switch (buttonText) {
          case "Our history":
            targetClass = "aboutus-content-history";
            break;
          case "Our School":
            targetClass = "aboutus-content-school";
            break;
          case "Our Kids":
            targetClass = "aboutus-content-kids";
            break;
        }

        const targetContent = document.querySelector("." + targetClass);

        // Find currently visible content
        let currentlyVisible = null;
        contentElements.forEach((content) => {
          if (content.style.display !== "none" && parseFloat(content.style.opacity || "1") > 0) {
            currentlyVisible = content;
          }
        });

        // If no content is currently visible or target is already visible, just show target
        if (!currentlyVisible || currentlyVisible === targetContent) {
          if (targetContent) {
            targetContent.style.display = "block";
            targetContent.style.opacity = "1";
          }
          // Hide all other content
          contentElements.forEach((content) => {
            if (content !== targetContent) {
              content.style.display = "none";
              content.style.opacity = "0";
            }
          });
          isAnimating = false;
          return;
        }

        // Fade out current content first
        let fadeOutDuration = 300; // Reduced duration for faster response
        let fadeInDuration = 400; // Reduced duration for faster response
        const fadeSteps = 20; // Reduced steps for smoother animation

        // Animate fade out of currently visible content
        let startOpacity = parseFloat(currentlyVisible.style.opacity || "1");
        let currentOpacity = startOpacity;
        const opacityDecrement = startOpacity / fadeSteps;

        const fadeOutInterval = setInterval(() => {
          currentOpacity -= opacityDecrement;
          currentlyVisible.style.opacity = currentOpacity;

          if (currentOpacity <= 0) {
            clearInterval(fadeOutInterval);
            currentlyVisible.style.opacity = "0";
            currentlyVisible.style.display = "none";

            // Fade in new content after fade out completes
            if (targetContent) {
              targetContent.style.display = "block";
              targetContent.style.opacity = "0";

              let fadeInOpacity = 0;
              const opacityIncrement = 1 / fadeSteps;

              const fadeInInterval = setInterval(() => {
                fadeInOpacity += opacityIncrement;
                targetContent.style.opacity = fadeInOpacity;

                if (fadeInOpacity >= 1) {
                  clearInterval(fadeInInterval);
                  targetContent.style.opacity = "1";
                  // Reset animation flag when animation completes
                  isAnimating = false;
                }
              }, fadeInDuration / fadeSteps);
            } else {
              // Reset animation flag if no target content
              isAnimating = false;
            }
          }
        }, fadeOutDuration / fadeSteps);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => initTabs());
})();
//   end kindergartenS2 button click for chnage paragraph 5001

/* ================================================= End AboutusS1 5001 =============================== */

// =============================Start kindergartenS3 3004===========================
(function () {
  function revealAU4(
    selector = ".js-kindergartenS3-reveal",
    options = { threshold: 0.2 }
  ) {
    const el = document.querySelector(selector);
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("kindergartenS3-visible");
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("kindergartenS3-visible");
          // optional: animate numbers
          animateNumbers(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, options);

    io.observe(el);
  }

  function animateNumbers(scope) {
    const nums = scope.querySelectorAll(".kindergartenS3-num[data-target]");
    nums.forEach((n) => {
      const target = parseInt(n.getAttribute("data-target"), 10);
      if (isNaN(target)) return;

      // Store original text to preserve symbols like "+"
      const originalText = n.textContent;
      const hasPlus = originalText.includes("+");

      const start = 0;
      const dur = 1200; // ms
      const startTime = performance.now();

      function tick(now) {
        const p = Math.min((now - startTime) / dur, 1);
        const val = Math.floor(
          start + (target - start) * (0.5 - Math.cos(Math.PI * p) / 2)
        ); // ease-in-out
        n.textContent = hasPlus ? `${val}+` : `${val}`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  // Parallax effect for background image
  function initParallax() {
    const bgImg = document.querySelector(".kindergartenS3-bg-img img");
    const section = document.querySelector(".kindergartenS3-section");

    if (!bgImg || !section) return;

    const updateParallax = () => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

      if (isVisible) {
        // Calculate parallax offset based on scroll position
        const scrollProgress =
          (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const parallaxOffset = (scrollProgress - 0.5) * 90; // Adjust multiplier for effect intensity

        bgImg.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    window.addEventListener("scroll", updateParallax, { passive: true });
    updateParallax(); // Initial call
  }

  document.addEventListener("DOMContentLoaded", () => {
    revealAU4();
    initParallax();
  });
})();
// =============================end kindergartenS3 3004===========================
// =============================Start kindergartenS4 3004===========================
// Scroll reveal animation
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".js-kindergartenS4-reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealEls.forEach((el) => observer.observe(el));
});

// ===============================END kindergartenS4 3004===========================
// =============================Start kindergartenS5 3006===========================
// kindergartenS5 • IntersectionObserver enter/leave animations
(() => {
  const section = document.querySelector(".kindergartenS5");
  if (!section) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = [...section.querySelectorAll(".kindergartenS5-io")];

  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const idx = Number(el.getAttribute("data-io-idx") || 0);
          const delay = Math.min(idx * 120, 360);

          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add("kindergartenS5-in"), delay);
            el.classList.remove(
              "kindergartenS5-out-left",
              "kindergartenS5-out-up"
            );
          } else {
            // leaving viewport
            const r = entry.boundingClientRect;
            if (r.top < 0) el.classList.add("kindergartenS5-out-up");
            else el.classList.add("kindergartenS5-out-left");
            el.classList.remove("kindergartenS5-in");
          }
        });
      },
      { threshold: 0.18 }
    );

    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("kindergartenS5-in"));
  }
})();
// kindergartenS5 • Play button -> YouTube lightbox with blur halo
(() => {
  const playBtn = document.querySelector(".kindergartenS5-play");
  const modal = document.querySelector(".kindergartenS5-modal");
  const iframe = document.querySelector(".kindergartenS5-iframe");
  const closeEls = modal ? modal.querySelectorAll("[data-close-modal]") : null;
  if (!playBtn || !modal || !iframe) return;

  // Ensure modal is at document.body level to avoid being constrained by transformed ancestors
  if (modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }

  const YT_BASE =
    playBtn.getAttribute("data-yt") ||
    "https://www.youtube.com/embed/CaBEdunlaOU";

  function openVideo() {
    const url = `${YT_BASE}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.src = url;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const btn = modal.querySelector(".kindergartenS5-close");
    btn?.focus();
  }

  function closeVideo() {
    modal.setAttribute("aria-hidden", "true");
    iframe.src = "";
    document.body.style.overflow = "";
    playBtn.focus();
  }

  playBtn.addEventListener("click", openVideo);
  closeEls?.forEach((el) => el.addEventListener("click", closeVideo));

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeVideo();
  });

  // Close on ESC
  window.addEventListener("keydown", (e) => {
    if (modal.getAttribute("aria-hidden") !== "true" && e.key === "Escape") closeVideo();
  });
})();

// =============================end kindergartenS5 3006===========================\
// =============================Start private nanny S6 3005===========================
// kindergartenS6: scroll reveal + (optional) count-up on reveal
(function () {
  function revealAU4(
    selector = ".js-kindergartenS6-reveal",
    options = { threshold: 0.2 }
  ) {
    const el = document.querySelector(selector);
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("kindergartenS6-visible");
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("kindergartenS6-visible");
          // optional: animate numbers
          animateNumbers(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, options);

    io.observe(el);
  }

  function animateNumbers(scope) {
    const nums = scope.querySelectorAll(".kindergartenS6-num[data-target]");
    nums.forEach((n) => {
      const target = parseInt(n.getAttribute("data-target"), 10);
      if (isNaN(target)) return;

      // Store original text to preserve symbols like "+"
      const originalText = n.textContent;
      const hasPlus = originalText.includes("+");

      const start = 0;
      const dur = 1200; // ms
      const startTime = performance.now();

      function tick(now) {
        const p = Math.min((now - startTime) / dur, 1);
        const val = Math.floor(
          start + (target - start) * (0.5 - Math.cos(Math.PI * p) / 2)
        ); // ease-in-out
        n.textContent = hasPlus ? `${val}+` : `${val}`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  document.addEventListener("DOMContentLoaded", () => revealAU4());
})();
// ===============================END private nanny S6 3005===========================
// =============================Start kindergartenS7 3006===========================
// Play & Learn S5: reveal left->right on enter, fade right->left on leave
(function () {
  const SECTION = ".kindergartenS7-section";
  const ITEMS = ".kindergartenS7-card";
  const HEADERS = ".js-kindergartenS7-reveal";
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
          el.classList.toggle("kindergartenS7-visible", show);
        } else {
          el.classList.toggle("kindergartenS7-revealed", show);
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
// ===============================END kindergartenS7 3006===========================

// =============================Start kindergartenS S10 3005===========================
// kindergartenS10: scroll reveal + (optional) count-up on reveal
(function () {
  function revealAU4(
    selector = ".js-kindergartenS10-reveal",
    options = { threshold: 0.2 }
  ) {
    const el = document.querySelector(selector);
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("kindergartenS10-visible");
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("kindergartenS10-visible");
          // optional: animate numbers
          animateNumbers(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, options);

    io.observe(el);
  }

  function animateNumbers(scope) {
    const nums = scope.querySelectorAll(".kindergartenS10-num[data-target]");
    nums.forEach((n) => {
      const target = parseInt(n.getAttribute("data-target"), 10);
      if (isNaN(target)) return;

      // Store original text to preserve symbols like "+"
      const originalText = n.textContent;
      const hasPlus = originalText.includes("+");

      const start = 0;
      const dur = 1200; // ms
      const startTime = performance.now();

      function tick(now) {
        const p = Math.min((now - startTime) / dur, 1);
        const val = Math.floor(
          start + (target - start) * (0.5 - Math.cos(Math.PI * p) / 2)
        ); // ease-in-out
        n.textContent = hasPlus ? `${val}+` : `${val}`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  document.addEventListener("DOMContentLoaded", () => revealAU4());
})();
// ===============================END kindergartenS S10 3005===========================
