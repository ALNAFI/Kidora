/* =======================================  Start Pre School S1 3001 ======================================= */
(function () {
  const section = document.querySelector(".preschoolS1");
  if (!section) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) section.classList.add("preschoolS1--js");

  const items = Array.from(section.querySelectorAll(".preschoolS1-anim"));
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

// 30k count
document.addEventListener("DOMContentLoaded", function () {
  const counter = document.querySelector(".preschoolS1-cloverNum");
  const target = 30; // সর্বোচ্চ সংখ্যা
  const duration = 2000; // মোট সময় (মিলিসেকেন্ড)
  const stepTime = Math.floor(duration / target);
  let current = 0;

  const timer = setInterval(() => {
    current++;
    counter.textContent = current;

    if (current >= target) {
      clearInterval(timer);
      counter.textContent = target + "K"; // শেষে 30K দেখাবে
    }
  }, stepTime);
});

/* =======================================  End Pre School S1 3001======================================= */
/* =======================================  Start Pre School S2 3002======================================= */
/* ======================================================
   preschoolS2 - Scroll Animation Logic
   ====================================================== */
(function () {
  const section = document.querySelector(".preschoolS2");
  if (!section) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) section.classList.add("preschoolS2--js");

  const items = Array.from(section.querySelectorAll(".preschoolS2-anim"));
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (reduce) {
          el.classList.add("is-in");
          return;
        }

        if (entry.isIntersecting) {
          const delay = items.indexOf(el) * 100;
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

  items.forEach((el) => observer.observe(el));
})();

/* =======================================  End Pre School S2 3002======================================= */
/* =======================================  Start Pre School S3 3003======================================= */
/* ======================================================
   preschoolS3 – IntersectionObserver animations
   ====================================================== */
(function () {
  const section = document.querySelector(".preschoolS3");
  if (!section) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) section.classList.add("preschoolS3--js");

  const items = Array.from(section.querySelectorAll(".preschoolS3-anim"));
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
          // tasteful stagger
          const delay = Math.min(items.indexOf(el) * 110, 420);
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
    { threshold: 0.22 }
  );

  items.forEach((el) => io.observe(el));

  // cleanup
  window.addEventListener("beforeunload", () => io.disconnect());
})();

/* =======================================  End Pre School S3 3003======================================= */
/* =======================================  Start Pre School S4 3004======================================= */
(function () {
  function preschoolS4Reveal(
    selector = ".js-preschoolS4-reveal",
    options = { threshold: 0.2 }
  ) {
    const nodes = document.querySelectorAll(selector);
    if (!nodes.length) return;

    // Fallback if IntersectionObserver not supported
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("preschoolS4-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("preschoolS4-visible");
          io.unobserve(entry.target);
        }
      });
    }, options);

    nodes.forEach((n) => io.observe(n));
  }

  document.addEventListener("DOMContentLoaded", () => preschoolS4Reveal());
})();
/* =======================================  End Pre School S4 3004======================================= */
/* =======================================  Start Pre School S5 3005======================================= */
function initScrollReveal(
  selector,
  animationClass = "visible",
  threshold = 0.2
) {
  const elements = document.querySelectorAll(selector);
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );
  elements.forEach((el) => observer.observe(el));
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal(".preschoolS5-card");
  initScrollReveal(".preschoolS5-main-img");
});
/* =======================================  End Pre School S5 3005======================================= */
/* =======================================  Start Pre School S6 3006======================================= */
// Toggle monthly/yearly pricing
(function () {
  const grid = document.querySelector(".preschoolS6-grid");
  const pills = document.querySelectorAll(".preschoolS6-pill");
  const amounts = document.querySelectorAll(".preschoolS6-amount");
  const suffixes = document.querySelectorAll(".preschoolS6-suffix");

  function setCycle(cycle) {
    grid.setAttribute("data-cycle", cycle);
    pills.forEach((p) =>
      p.classList.toggle("preschoolS6-active", p.dataset.cycle === cycle)
    );
    amounts.forEach((a) => {
      // Get monthly base value either from data attribute or current text
      const monthlyAttr = a.getAttribute("data-monthly");
      const monthly = monthlyAttr
        ? parseFloat(monthlyAttr)
        : parseFloat((a.textContent || "").replace(/[^0-9.]/g, "")) || 0;

      // Determine plan for discount mapping
      const card = a.closest(".preschoolS6-card");
      const planName = (card?.querySelector(".preschoolS6-plan")?.textContent || "")
        .toLowerCase()
        .trim();
      const discountMap = { basic: 0.02, premium: 0.05, advanced: 0.1 };
      const discount = discountMap[planName] || 0;

      let displayVal = monthly;
      if (cycle === "yearly") {
        const yearlyRaw = monthly * 12 * (1 - discount);
        displayVal = Math.round(yearlyRaw);
      }

      a.textContent = "$" + displayVal;
    });
    suffixes.forEach(
      (s) => (s.textContent = cycle === "yearly" ? "/Yearly" : "/Monthly")
    );
  }

  pills.forEach((p) =>
    p.addEventListener("click", () => setCycle(p.dataset.cycle))
  );
  setCycle("monthly"); // default
})();

/* =======================================  End Pre School S6 3006======================================= */
/* =======================================  Start Pre School S7 3007======================================= */
(function () {
  const section = document.querySelector(".preschoolS7");
  if (!section) return;

  // scroll reveal
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) section.classList.add("preschoolS7--js");
  const anims = section.querySelectorAll(".preschoolS7-anim");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-in");
        else e.target.classList.remove("is-in");
      });
    },
    { threshold: 0.2 }
  );
  anims.forEach((a) => obs.observe(a));

  // slider
  const slides = [...section.querySelectorAll(".preschoolS7-slide")];
  if (!slides.length) return;
  let index = 0;
  const barsGroups = slides.map((s) => [
    ...s.querySelectorAll(".preschoolS7-bars button"),
  ]);

  function show(i) {
    slides.forEach((s, idx) => {
      s.classList.toggle("is-active", idx === i);
      s.setAttribute("aria-hidden", idx === i ? "false" : "true");
      // update bars
      barsGroups[idx].forEach((b, bIdx) =>
        b.classList.toggle("is-on", idx === i && bIdx === i)
      );
    });
  }

  function next() {
    index = (index + 1) % slides.length;
    show(index);
  }

  let timer = setInterval(next, 5000);

  // hover pause
  section.addEventListener("mouseenter", () => {
    clearInterval(timer);
    timer = null;
  });
  section.addEventListener("mouseleave", () => {
    if (!timer) timer = setInterval(next, 5000);
  });

  // bar click control
  barsGroups.forEach((group, slideIdx) => {
    group.forEach((btn, btnIdx) => {
      btn.addEventListener("click", () => {
        index = btnIdx;
        show(index);
      });
    });
  });

  show(index);
})();

/* =======================================  End Pre School S7 3007======================================= */
/* =======================================  Start Pre School S8 3008======================================= */
// preschoolS8: IntersectionObserver reveal (staggered)
(() => {
  const root = document.querySelector(".preschoolS8");
  if (!root) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const observed = [...root.querySelectorAll(".preschoolS8-io")];

  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target;
          const idx = Number(el.getAttribute("data-io-idx") || 0);
          const delay = Math.min(idx * 120, 360);
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("preschoolS8-in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    observed.forEach((el) => io.observe(el));
  } else {
    observed.forEach((el) => el.classList.add("preschoolS8-in"));
  }
})();

/* =======================================  End Pre School S8 3008======================================= */
/* =======================================  Start Pre School S9 3009======================================= */
// PreschoolS9 • IO reveal + infinite marquee + lightbox
(() => {
  const section = document.querySelector(".preschoolS9");
  if (!section) return;

  /* -------- IntersectionObserver (enter/leave animations with stagger) -------- */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ioItems = [...section.querySelectorAll(".preschoolS9-io")];

  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const idx = Number(el.dataset.ioIdx || 0);
          const delay = Math.min(idx * 90, 450);

          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add("preschoolS9-in"), delay);
            el.classList.remove("preschoolS9-out-left", "preschoolS9-out-up");
          } else {
            if (entry.boundingClientRect.top < 0)
              el.classList.add("preschoolS9-out-up");
            else el.classList.add("preschoolS9-out-left");
            el.classList.remove("preschoolS9-in");
          }
        });
      },
      { threshold: 0.15 }
    );

    ioItems.forEach((el) => io.observe(el));
  } else {
    ioItems.forEach((el) => el.classList.add("preschoolS9-in"));
  }

  /* -------- Infinite Marquee Animation -------- */
  const track = section.querySelector(".preschoolS9-track");
  const speed = 0.3; // pixels per frame (slower speed)
  let pos = 0;
  let isPaused = false;
  let animationId = null;

  function loop() {
    if (!isPaused && track && !reduced) {
      pos -= speed;
      const firstCard = track.firstElementChild;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 24; // include gap
        // if first card fully out of view → move it to the end
        if (Math.abs(pos) >= cardWidth) {
          track.appendChild(firstCard);
          pos += cardWidth;
        }
      }
      track.style.transform = `translateX(${pos}px)`;
    }
    animationId = requestAnimationFrame(loop);
  }

  if (track && !reduced) {
    // Start the animation
    requestAnimationFrame(loop);

    /* -------- Pause marquee on touch/hover/focus -------- */
    const wrapper = section.querySelector(".preschoolS9-stripWrapper");

    const pauseEvents = ["pointerdown", "touchstart", "mouseenter", "focusin"];
    const resumeEvents = ["pointerup", "touchend", "mouseleave", "focusout"];

    pauseEvents.forEach((evt) =>
      wrapper.addEventListener(
        evt,
        () => {
          isPaused = true;
        },
        { passive: true }
      )
    );
    resumeEvents.forEach((evt) =>
      wrapper.addEventListener(
        evt,
        () => {
          isPaused = false;
        },
        { passive: true }
      )
    );
  }

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (animationId) cancelAnimationFrame(animationId);
  });

  /* -------- Lightbox (open on card click) -------- */
  const lb = section.querySelector(".preschoolS9-lightbox");
  const lbImg = section.querySelector(".preschoolS9-lightbox-img");
  const lbClose = section.querySelector(".preschoolS9-lightbox-close");
  let lastFocus = null;

  function openLB(src, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || "Preview image";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();

    // Pause marquee when lightbox opens
    isPaused = true;
  }
  function closeLB() {
    lb.hidden = true;
    document.body.style.overflow = "";
    lbImg.src = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();

    // Resume marquee when lightbox closes
    isPaused = false;
  }

  section.querySelectorAll(".preschoolS9-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      if (img) openLB(img.src, img.alt);
    });
  });
  lbClose.addEventListener("click", closeLB);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLB();
  });
  window.addEventListener("keydown", (e) => {
    if (!lb.hidden && e.key === "Escape") closeLB();
  });
})();

/* =======================================  End Pre School S9 3009======================================= */

/* =======================================  Start Pre School S10 3009======================================= */
// preschoolS10 • Simple IntersectionObserver entrance/exit (staggered)
(() => {
  const root = document.querySelector(".preschoolS10");
  if (!root) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const els = [...root.querySelectorAll(".preschoolS10-io")];

  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const idx = Number(el.dataset.ioIdx || 0);
          const delay = Math.min(idx * 120, 360);

          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add("preschoolS10-in"), delay);
            el.classList.remove("preschoolS10-out-up");
          } else {
            el.classList.add("preschoolS10-out-up");
            el.classList.remove("preschoolS10-in");
          }
        });
      },
      { threshold: 0.16 }
    );

    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("preschoolS10-in"));
  }
})();

/* =======================================  End Pre School S10 3009======================================= */
