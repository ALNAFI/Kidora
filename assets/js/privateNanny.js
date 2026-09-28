// =============================Side bar===========================

(function () {
  const panel = document.getElementById("pn1Sidebar");
  const dim = document.getElementById("pn1SidebarDim");
  const close = panel?.querySelector(".pn1-sidebar__close");

  // Collect all possible menu trigger buttons (mobile + desktop)
  const triggers = (() => {
    const btns = Array.from(
      document.querySelectorAll('.btn-icon[aria-label="Menu"]')
    );
    const legacy = document.getElementById("pn1MenuBtn");
    if (legacy && !btns.includes(legacy)) btns.push(legacy);
    return btns;
  })();

  if (!triggers.length || !panel || !dim) return;

  let lastTrigger = null; // remember which element opened the drawer

  const open = () => {
    panel.setAttribute("aria-hidden", "false");
    dim.classList.add("is-on");
    // ✨ removed: document.body.classList.add('body--pn1Lock');
    close?.focus(); // move focus into panel for accessibility
  };

  const closeDrawer = () => {
    panel.setAttribute("aria-hidden", "true");
    dim.classList.remove("is-on");
    // ✨ removed: document.body.classList.remove('body--pn1Lock');
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

/* ======================================================
   privatenannyS1 – IntersectionObserver animations
   - Staggered enter, fade on exit
   - Prefers-reduced-motion support
   ====================================================== */
(function () {
  const section = document.querySelector(".privatenannyS1");
  if (!section) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) section.classList.add("privatenannyS1--js");

  const items = Array.from(section.querySelectorAll(".privatenannyS1-anim"));
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (reduced) return el.classList.add("is-in");

        if (entry.isIntersecting) {
          const idx = items.indexOf(el);
          const delay = Math.min(idx * 100, 400);
          setTimeout(() => {
            el.classList.add("is-in");
            el.classList.remove("is-out");
          }, delay);
        } else {
          el.classList.remove("is-in");
          el.classList.add("is-out");
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((el) => io.observe(el));
  window.addEventListener("beforeunload", () => io.disconnect());
})();

// ===============================END private nanny S1 3001===========================

// =============================Start private nanny S2 3002===========================
/* ======================================================
   privatenannyS2 – IntersectionObserver + hover active
   ====================================================== */
(function () {
  const section = document.querySelector(".privatenannyS2");
  if (!section) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) section.classList.add("privatenannyS2--js");

  const items = Array.from(section.querySelectorAll(".privatenannyS2-anim"));
  if (items.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (reduce) return el.classList.add("is-in");
          if (entry.isIntersecting) {
            const idx = items.indexOf(el);
            const delay = Math.min(idx * 120, 400);
            setTimeout(() => el.classList.add("is-in"), delay);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((el) => io.observe(el));
  }

  // hover activation
  const cards = section.querySelectorAll(".privatenannyS2-card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      cards.forEach((c) => c.classList.remove("is-active"));
      card.classList.add("is-active");
    });
  });
})();

// ===============================END private nanny S2 3002===========================
// =============================Start private nanny S3 3003===========================
/* ======================================================
   privatenannyS3 – IntersectionObserver animations
   - tasteful stagger on enter, fade on exit
   - prefers-reduced-motion aware
   ====================================================== */
(function () {
  const section = document.querySelector(".privatenannyS3");
  if (!section) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) section.classList.add("privatenannyS3--js");

  // Elements that animate (visual column + content bits + list items + button)
  const items = Array.from(section.querySelectorAll(".privatenannyS3-anim"));
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (reduce) {
          el.classList.add("is-in");
          return;
        }

        if (entry.isIntersecting) {
          const i = items.indexOf(el);
          const delay = Math.min(i * 100, 400); // tasteful stagger
          setTimeout(() => {
            el.classList.add("is-in");
            el.classList.remove("is-out");
          }, delay);
        } else {
          el.classList.remove("is-in");
          el.classList.add("is-out"); // fade when leaving viewport
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((el) => io.observe(el));
  window.addEventListener("beforeunload", () => io.disconnect());
})();

// ===============================END private nanny S3 3003===========================
// =============================Start private nanny S4 3004===========================
// Scroll reveal animation
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".js-privatenannyS4-reveal");

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

// ===============================END private nanny S4 3004===========================
// =============================Start private nanny S5 3005===========================
// privatenannyS5: scroll reveal + (optional) count-up on reveal
(function () {
  function revealAU4(
    selector = ".js-privatenannyS5-reveal",
    options = { threshold: 0.2 }
  ) {
    const el = document.querySelector(selector);
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("privatenannyS5-visible");
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("privatenannyS5-visible");
          // optional: animate numbers
          animateNumbers(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, options);

    io.observe(el);
  }

  function animateNumbers(scope) {
    const nums = scope.querySelectorAll(".privatenannyS5-num[data-target]");
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
// ===============================END private nanny S5 3005===========================
// =============================Start private nanny S6 3006===========================
// Play & Learn S5: reveal left->right on enter, fade right->left on leave
(function () {
  const SECTION = ".privatenannyS6-section";
  const ITEMS = ".privatenannyS6-card";
  const HEADERS = ".js-privatenannyS6-reveal";
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
          el.classList.toggle("privatenannyS6-visible", show);
        } else {
          el.classList.toggle("privatenannyS6-revealed", show);
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
// ===============================END private nanny S6 3006===========================
// =============================Start private nanny S7 3007===========================
/* ======================================================
   privatenannyS7 – IntersectionObserver animations
   ====================================================== */
(function () {
  const section = document.querySelector(".privatenannyS7");
  if (!section) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!reduceMotion) section.classList.add("privatenannyS7--js");

  const items = Array.from(section.querySelectorAll(".privatenannyS7-anim"));
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (reduceMotion) {
          el.classList.add("is-in");
          return;
        }

        if (entry.isIntersecting) {
          const idx = items.indexOf(el);
          const delay = Math.min(idx * 100, 400);
          setTimeout(() => {
            el.classList.add("is-in");
            el.classList.remove("is-out");
          }, delay);
        } else {
          el.classList.remove("is-in");
          el.classList.add("is-out");
        }
      });
    },
    { threshold: 0.25 }
  );

  items.forEach((el) => io.observe(el));
  window.addEventListener("beforeunload", () => io.disconnect());
})();

// ===============================END private nanny S7 3007===========================
// =============================Start private nanny S8 3008===========================
/* ======================================================
   privatenannyS8 – IntersectionObserver animations
   - tasteful stagger on enter
   - fade on exit
   - prefers-reduced-motion support
   ====================================================== */
(function () {
  const section = document.querySelector(".privatenannyS8");
  if (!section) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Progressive enhancement: only apply hidden states if JS is on
  if (!reduceMotion) section.classList.add("privatenannyS8--js");

  const items = Array.from(section.querySelectorAll(".privatenannyS8-anim"));
  if (items.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (reduceMotion) {
          el.classList.add("is-in");
          return;
        }

        if (entry.isIntersecting) {
          const idx = items.indexOf(el);
          const delay = Math.min(idx * 100, 400);
          setTimeout(() => {
            el.classList.add("is-in");
            el.classList.remove("is-out");
          }, delay);
        } else {
          el.classList.remove("is-in");
          el.classList.add("is-out");
        }
      });
    },
    {
      root: null,
      threshold: 0.25,
    }
  );

  items.forEach((el) => observer.observe(el));

  window.addEventListener("beforeunload", () => observer.disconnect());
})();
// ===============================END private nanny S8 3008===========================
// =============================Start private nanny S9 3009===========================
(function () {
  function reveal(
    selector = ".js-privatenannyS9-reveal",
    options = { threshold: 0.2 }
  ) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("privatenannyS9-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("privatenannyS9-visible");
          io.unobserve(entry.target);
        }
      });
    }, options);

    els.forEach((el) => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => reveal());
})();
// ===============================END private nanny S9 3009===========================
// =============================Start private nanny S10 3010===========================
// ===============================END private nanny S10 3010===========================
// =============================Start private nanny S11 3011===========================
/* ======================================================
   Private Nanny S11 — IntersectionObserver animations
   - Vanilla JS
   - Staggered reveal on enter; fade when leaving
   - Disabled for prefers-reduced-motion
   ====================================================== */

(function () {
  const section = document.querySelector(".privatenannyS11");
  if (!section) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Progressive enhancement: only add initial hidden states when JS runs
  if (!reduceMotion) {
    section.classList.add("privatenannyS11--js");
  }

  const items = Array.from(section.querySelectorAll(".privatenannyS11-anim"));
  if (items.length === 0) return;

  // IntersectionObserver to toggle enter/exit classes
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (reduceMotion) {
          // If reduced motion is requested, make sure everything is visible
          el.classList.add("is-in");
          return;
        }

        if (entry.isIntersecting) {
          // Stagger via small timeout based on DOM order (left → right)
          const index = items.indexOf(el);
          const delay = Math.min(index * 90, 360); // tasteful stagger cap
          setTimeout(() => {
            el.classList.add("is-in");
            el.classList.remove("is-out");
          }, delay);
        } else {
          // When leaving section viewport, fade out in reverse direction
          el.classList.remove("is-in");
          el.classList.add("is-out");
        }
      });
    },
    {
      root: null,
      threshold: 0.25, // enter when 25% visible
    }
  );

  // Observe each animated element
  items.forEach((el) => io.observe(el));

  // Cleanup if this script is ever hot-reloaded
  window.addEventListener("beforeunload", () => io.disconnect());
})();

// ===============================END private nanny S11 3011===========================
