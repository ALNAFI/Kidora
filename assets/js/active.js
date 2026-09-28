/* ================================ Start Parallax effect for hero background ================================ */
function initParallax() {
  const heroBg = document.querySelector(".hero-bg");

  if (heroBg) {
    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;

      heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true });
  }
}
document.addEventListener("DOMContentLoaded", initParallax);
/* ================================ End Parallax effect for hero background ================================ */

/* ================================ Scroll to Top ================================ */
const scrollButton = document.getElementById("scrollTopButton");
const topDistance = 600;
if (scrollButton) {
  window.addEventListener("scroll", () => {
    if (
      document.body.scrollTop > topDistance ||
      document.documentElement.scrollTop > topDistance
    ) {
      scrollButton.classList.add("scrolltop-show");
      scrollButton.classList.remove("scrolltop-hide");
    } else {
      scrollButton.classList.add("scrolltop-hide");
      scrollButton.classList.remove("scrolltop-show");
    }
  });
  scrollButton.addEventListener("click", () => {
    if (window.lenis && typeof window.lenis.scrollTo === "function") {
      try {
        window.lenis.scrollTo(0, { immediate: false, lock: false });
        return;
      } catch (_) {
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });
  function updateScrollProgress() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercent = (scrollY / (documentHeight - windowHeight)) * 100;
    scrollButton.style.setProperty("--scroll-progress", `${scrollPercent}%`);
  }
  window.addEventListener("scroll", updateScrollProgress);
}
/* ================================ End Scroll to Top ================================ */

/* ================================ Start Lenis ================================ */
const lenis = new Lenis({
  duration: 3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: true,
  syncTouch: false,
});
window.lenis = lenis;
try {
  const root = document.documentElement;
  const body = document.body;
  if (getComputedStyle(root).scrollBehavior !== "auto")
    root.style.scrollBehavior = "auto";
  if (getComputedStyle(body).scrollBehavior !== "auto")
    body.style.scrollBehavior = "auto";
} catch (_) {}
window.addEventListener(
  "keydown",
  (ev) => {
    const targetEl = ev.target;
    const tag =
      targetEl && targetEl.tagName ? targetEl.tagName.toLowerCase() : "";
    if (
      tag === "input" ||
      tag === "textarea" ||
      (targetEl && targetEl.isContentEditable)
    )
      return;
    const docEl = document.documentElement;
    const maxScroll = docEl.scrollHeight - window.innerHeight;
    const current = window.scrollY || docEl.scrollTop || 0;
    const isHeld = ev.repeat === true;
    const arrowBase = 100;
    const arrowStep = Math.round(arrowBase * (isHeld ? 2.5 : 1));
    const pageBase = Math.max(100, Math.floor(window.innerHeight * 0.9));
    const pageStep = Math.round(pageBase * (isHeld ? 1.4 : 1));
    let target = null;
    switch (ev.key) {
      case "ArrowDown":
        target = Math.min(current + arrowStep, maxScroll);
        break;
      case "ArrowUp":
        target = Math.max(current - arrowStep, 0);
        break;
      case "PageDown":
        target = Math.min(current + pageStep, maxScroll);
        break;
      case "PageUp":
        target = Math.max(current - pageStep, 0);
        break;
      case "Home":
        target = 0;
        break;
      case "End":
        target = maxScroll;
        break;
      case " ":
        target = ev.shiftKey
          ? Math.max(current - pageStep, 0)
          : Math.min(current + pageStep, maxScroll);
        break;
      default:
        break;
    }
    if (target !== null) {
      ev.preventDefault();
      try {
        lenis.scrollTo(target);
      } catch (_) {
        window.scrollTo({ top: target, left: 0, behavior: "smooth" });
      }
    }
  },
  { passive: false }
);
(() => {
  let pausedByScrollbar = false;
  const EDGE_THRESHOLD_PX = 24;

  function isNearRightEdge(evt) {
    return window.innerWidth - evt.clientX <= EDGE_THRESHOLD_PX;
  }

  function pauseLenisForScrollbar() {
    if (!pausedByScrollbar) {
      pausedByScrollbar = true;
      try {
        lenis.stop && lenis.stop();
      } catch (_) {}
    }
  }
  function resumeLenisAfterScrollbar() {
    if (pausedByScrollbar) {
      pausedByScrollbar = false;
      try {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        if (typeof lenis.scrollTo === "function") {
          lenis.scrollTo(y, { immediate: true });
        }
      } catch (_) {}
      try {
        lenis.start && lenis.start();
      } catch (_) {}
    }
  }
  window.addEventListener(
    "pointerdown",
    (e) => {
      if (e.isPrimary !== false && e.button === 0 && isNearRightEdge(e)) {
        pauseLenisForScrollbar();
      }
    },
    { capture: true }
  );

  window.addEventListener("pointerup", resumeLenisAfterScrollbar, {
    capture: true,
  });
  window.addEventListener("pointercancel", resumeLenisAfterScrollbar, {
    capture: true,
  });
  window.addEventListener("blur", resumeLenisAfterScrollbar);
})();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
/* ================================ End Lenis ================================ */

/* ================================  Start Magnet cursor ================================  */
document.addEventListener("DOMContentLoaded", () => {
  const magnet = document.querySelector(".magnet");
  const cursor = document.querySelector(".magnet-cursor");
  const circle = document.querySelector(".magnet-circle");
  if (magnet) {
    let [startX, startY, endX, endY] = [0, 0, 0, 0];
    let time = 0.1;
    let raf;
    const lerp = (start, end, t) => start * (1 - t) + end * t;
    function updateCircle() {
      startX = lerp(startX, endX, time);
      startY = lerp(startY, endY, time);
      circle.style.transform = `translate(${startX}px,${startY}px)`;
      raf = requestAnimationFrame(updateCircle);
      startX.toFixed(1) === endX.toFixed(1) && cancelAnimationFrame(raf);
    }
    function trackCircle(e) {
      endX = e.clientX - circle.clientWidth / 2;
      endY = e.clientY - circle.clientHeight / 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateCircle);
    }
    function trackCursor(e) {
      cursor.style.setProperty("--x", `${e.clientX - cursor.clientWidth / 2}px`);
      cursor.style.setProperty("--y", `${e.clientY - cursor.clientHeight / 2}px`);
      magnet.classList.remove("reset");
    }
    function init(e) {
      trackCursor(e);
      trackCircle(e);
      return e.target.matches(".magnet-link") && magnet.classList.add("reset");
    }
    window.addEventListener("pointermove", init, false);
    window.addEventListener("load", updateCircle, false);
  }
});
/* ================================ End Magnet cursor ================================ */

/*================================ Start Preloader ================================*/
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const mainContent = document.getElementById("main-content");

  function hidePreloader() {
    if (!preloader || preloader.classList.contains("preloader-hidden")) {
      return;
    }
    preloader.style.transition =
      "opacity 0.8s ease-out, visibility 0.8s ease-out";
    preloader.classList.add("preloader-hidden");

    if (mainContent) {
      mainContent.style.transition =
        "opacity 0.8s ease-in, visibility 0.8s ease-in";
      mainContent.classList.remove("main-content-hidden");
      mainContent.classList.add("main-content-visible");
    }

    setTimeout(() => {
      if (preloader) {
        preloader.style.display = "none";
      }
    }, 800);
  }

  if (document.readyState === "complete") {
    setTimeout(hidePreloader, 100);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hidePreloader, 300);
    });
  }

  setTimeout(() => {
    if (preloader && !preloader.classList.contains("preloader-hidden")) {
      hidePreloader();
    }
  }, 5000);
}
document.addEventListener("DOMContentLoaded", initPreloader);
window.addEventListener("load", initPreloader);
/*================================ End Preloader ================================*/
/* ================================  Start Cookie Alert ================================  */
class KidoraCookieAlert {
  constructor() {
    this.banner = null;
    this.storageKey = "kidora_cookie_consent";
    this.showDelay = 2000; 
    this.init();
  }
  init() {
    const isForceShow =
      (location.pathname || "").toLowerCase().includes("index.html") ||
      (location.pathname || "").toLowerCase().includes("play-learn.html") ||
      (location.pathname || "").toLowerCase().includes("private-nanny.html") ||
      (location.pathname || "").toLowerCase().includes("pre-school.html");
    const existing = document.getElementById("kidora-cookie-alert");
    if (existing) {
      this.banner = existing;
      this.addEventListeners();
    }

    if (isForceShow) {
      if (!this.banner) this.createBanner();

      const preloader = document.getElementById("preloader");
      const isHidden = (el) => {
        if (!el) return true;
        if (el.classList && el.classList.contains("preloader-hidden"))
          return true;
        const cs = window.getComputedStyle(el);
        return (
          cs.display === "none" ||
          cs.visibility === "hidden" ||
          cs.opacity === "0"
        );
      };

      const showAfterPreloader = () => {
        const prev = this.showDelay;
        this.showDelay = 2000; 
        this.showBanner();
        this.showDelay = prev;
      };

      if (isHidden(preloader)) {
        showAfterPreloader();
      } else {
        const start = Date.now();
        const maxWait = 6000;
        const timer = setInterval(() => {
          if (isHidden(preloader) || Date.now() - start > maxWait) {
            clearInterval(timer);
            showAfterPreloader();
          }
        }, 120);
      }
      return;
    }
    if (this.hasConsent()) return;
    if (!this.banner) this.createBanner();
    this.showBanner();
  }

  createBanner() {
    const existing = document.getElementById("kidora-cookie-alert");
    if (existing) {
      this.banner = existing;
      return;
    }

    const bannerHTML = `
      <div id="kidora-cookie-alert" class="cookie-alert">
        <div class="cookie-alert-content">
          <div class="cookie-alert-header">
            <div class="cookie-alert-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http:
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
            <h3 class="cookie-alert-title">🍪 Cookie Consent</h3>
          </div>
          
          <p class="cookie-alert-text">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
          
          <div class="cookie-alert-actions">
            <button id="cookie-decline" class="cookie-alert-btn cookie-alert-btn-secondary">
              Decline
            </button>
            <button id="cookie-accept" class="cookie-alert-btn cookie-alert-btn-primary">
              Accept All
            </button>
          </div>
          
          <button id="cookie-close" class="cookie-alert-close" aria-label="Close cookie banner">
            ×
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", bannerHTML);
    this.banner = document.getElementById("kidora-cookie-alert");
    this.addEventListeners();
  }
  addEventListeners() {
    const acceptBtn = document.getElementById("cookie-accept");
    const declineBtn = document.getElementById("cookie-decline");
    const closeBtn = document.getElementById("cookie-close");
    acceptBtn.addEventListener("click", () => this.handleAccept());
    declineBtn.addEventListener("click", () => this.handleDecline());
    closeBtn.addEventListener("click", () => this.handleClose());
  }
  showBanner() {
    setTimeout(() => {
      if (this.banner) {
        this.banner.classList.add("show");
        setTimeout(() => {
          this.banner.classList.add("pulse");
        }, 3000);
      }
    }, this.showDelay);
  }
  hideBanner() {
    if (this.banner) {
      this.banner.classList.remove("show", "pulse");
      setTimeout(() => {
        if (this.banner) {
          this.banner.remove();
          this.banner = null;
        }
      }, 400);
    }
  }
  handleAccept() {
    this.setConsent("accepted");
    this.hideBanner();
    this.enableAnalytics();
  }
  handleDecline() {
    this.setConsent("declined");
    this.hideBanner();
    this.disableAnalytics();
  }
  handleClose() {
    this.setConsent("dismissed");
    this.hideBanner();
  }
  hasConsent() {
    return localStorage.getItem(this.storageKey) !== null;
  }
  setConsent(value) {
    localStorage.setItem(this.storageKey, value);
    localStorage.setItem(this.storageKey + "_date", new Date().toISOString());
  }
  getConsent() {
    return localStorage.getItem(this.storageKey);
  }
  enableAnalytics() {
  }
  disableAnalytics() {
  }
  resetConsent() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKey + "_date");
  }
  hasAcceptedCookies() {
    return this.getConsent() === "accepted";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  window.kidoraCookieAlert = new KidoraCookieAlert();

  window.resetCookieConsent = () => window.kidoraCookieAlert.resetConsent();
  window.hasAcceptedCookies = () =>
    window.kidoraCookieAlert.hasAcceptedCookies();
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = KidoraCookieAlert;
}
/* ================================  End Cookie Alert ================================  */


/* ================================  Start Aboutus ================================  */
/* ================================  Start AboutusS1 5001 ================================  */
(function () {
  function aboutusReveal(
    selector = ".js-aboutus-reveal",
    options = { threshold: 0.2 }
  ) {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("aboutus-s1-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("aboutus-s1-visible");
          io.unobserve(e.target);
        }
      });
    }, options);

    targets.forEach((t) => io.observe(t));
  }

  document.addEventListener("DOMContentLoaded", () => aboutusReveal());
})();

(function () {
  let isAnimating = false;
  function initTabs() {
    const pills = document.querySelectorAll(".aboutus-s1-pill");
    const contentElements = document.querySelectorAll(".aboutus-content");

    contentElements.forEach((content, index) => {
      if (index === 0) {
        content.style.display = "block";
        content.style.opacity = "1";
      } else {
        content.style.display = "none";
        content.style.opacity = "0";
      }
    });

    pills.forEach((pill, index) => {
      if (index === 0) {
        pill.classList.add("is-active");
      } else {
        pill.classList.remove("is-active");
      }
    });

    pills.forEach((pill) => {
      pill.addEventListener("click", function () {
        if (isAnimating) {
          return;
        }

        if (this.classList.contains("is-active")) {
          return;
        }

        isAnimating = true;

        pills.forEach((p) => p.classList.remove("is-active"));

        this.classList.add("is-active");

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

        let currentlyVisible = null;
        contentElements.forEach((content) => {
          if (
            content.style.display !== "none" &&
            parseFloat(content.style.opacity || "1") > 0
          ) {
            currentlyVisible = content;
          }
        });

        if (!currentlyVisible || currentlyVisible === targetContent) {
          if (targetContent) {
            targetContent.style.display = "block";
            targetContent.style.opacity = "1";
          }
          contentElements.forEach((content) => {
            if (content !== targetContent) {
              content.style.display = "none";
              content.style.opacity = "0";
            }
          });
          isAnimating = false;
          return;
        }

        let fadeOutDuration = 300;
        let fadeInDuration = 400;
        const fadeSteps = 20;
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
                  isAnimating = false;
                }
              }, fadeInDuration / fadeSteps);
            } else {
              isAnimating = false;
            }
          }
        }, fadeOutDuration / fadeSteps);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => initTabs());
})();

/* ================================  End AboutusS1 5001 ================================  */

/* ================================  Start AboutusS2 5002 ================================  */
(function () {
  function aboutusS2Reveal(
    selector = ".js-aboutusS2-reveal",
    options = { threshold: 0.2 }
  ) {
    const nodes = document.querySelectorAll(selector);
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("aboutusS2-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aboutusS2-visible");
          io.unobserve(entry.target);
        }
      });
    }, options);

    nodes.forEach((n) => io.observe(n));
  }

  document.addEventListener("DOMContentLoaded", () => aboutusS2Reveal());
})();
/* ================================  End AboutusS2 5002 ================================  */

/* ================================  Start AboutusS3 5003 ================================  */
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

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal(".aboutusS3-card");
  initScrollReveal(".aboutusS3-main-img");
});
/* ================================  End AboutusS3 5003 ================================  */

/* ================================  Start AboutusS4 5004 ================================  */
(function () {
  function revealAU4(
    selector = ".js-aboutusS4-reveal",
    options = { threshold: 0.2 }
  ) {
    const el = document.querySelector(selector);
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("aboutusS4-visible");
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aboutusS4-visible");
          animateNumbers(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, options);

    io.observe(el);
  }

  function animateNumbers(scope) {
    const nums = scope.querySelectorAll(".aboutusS4-num[data-target]");
    nums.forEach((n) => {
      const target = parseInt(n.getAttribute("data-target"), 10);
      if (isNaN(target)) return;

      const originalText = n.textContent;
      const hasPlus = originalText.includes("+");

      const start = 0;
      const dur = 1200;
      const startTime = performance.now();

      function tick(now) {
        const p = Math.min((now - startTime) / dur, 1);
        const val = Math.floor(
          start + (target - start) * (0.5 - Math.cos(Math.PI * p) / 2)
        );
        n.textContent = hasPlus ? `${val}+` : `${val}`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  document.addEventListener("DOMContentLoaded", () => revealAU4());
})();

/* ================================  End AboutusS4 5004 ================================  */
/* ================================  Start Aboutus ================================  */

/* ================================  Start FAQs 1300 ================================  */
(function () {
  const items = document.querySelectorAll(".faqx-item");

  const lockHeight = (panel, height) => {
    panel.style.maxHeight = height + "px";
  };

  const closeItem = (item) => {
    if (!item || !item.classList.contains("faqx-open")) return;

    const panel = item.querySelector(".faqx-panel");
    const inner = panel.querySelector(".faqx-panel-inner");

    const current =
      panel.style.maxHeight === "" || panel.style.maxHeight === "none"
        ? inner.offsetHeight
        : parseFloat(panel.style.maxHeight);

    lockHeight(panel, current);
    panel.offsetHeight;
    item.classList.remove("faqx-open");
    lockHeight(panel, 0);

    const end = (e) => {
      if (e.propertyName !== "max-height") return;
      panel.removeEventListener("transitionend", end);
    };
    panel.addEventListener("transitionend", end);
  };

  const openItem = (item) => {
    const panel = item.querySelector(".faqx-panel");
    const inner = panel.querySelector(".faqx-panel-inner");

    lockHeight(panel, 0);
    item.classList.add("faqx-open");

    requestAnimationFrame(() => {
      lockHeight(panel, inner.offsetHeight);
    });

    const end = (e) => {
      if (e.propertyName !== "max-height") return;
      panel.removeEventListener("transitionend", end);
      panel.style.maxHeight = "none";
    };
    panel.addEventListener("transitionend", end);
  };

  const getOpenItem = () => document.querySelector(".faqx-item.faqx-open");

  items.forEach((item) => {
    const trigger = item.querySelector(".faqx-trigger");

    trigger.addEventListener("click", () => {
      const wasOpen = item.classList.contains("faqx-open");
      const currentlyOpen = getOpenItem();

      if (currentlyOpen && currentlyOpen !== item) closeItem(currentlyOpen);

      if (wasOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });

  requestAnimationFrame(() => {
    const initial = getOpenItem();
    if (initial) {
      const panel = initial.querySelector(".faqx-panel");
      panel.style.maxHeight = "none";
    }
  });

  window.addEventListener("resize", () => {
    const open = getOpenItem();
    if (!open) return;
    const panel = open.querySelector(".faqx-panel");
    panel.style.maxHeight = "none";
  });
})();
/* ================================  End FAQs 1300 ================================  */

/* ================================  End Teacher Details 1100 ================================  */
(function () {
  const section = document.getElementById("biox");
  if (!section) return;
  const skills = section.querySelectorAll(".biox-skill");

  function animateBars() {
    skills.forEach((skill) => {
      const target = parseInt(skill.getAttribute("data-perc"), 10) || 0;
      const fill = skill.querySelector(".biox-fill");
      fill.style.width = target + "%";     });
  }

    const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateBars();
          io.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  io.observe(section);
})();
/* ================================  End Teacher Details 1100 ================================  */
/* ================================  Start Pricing 1200 ================================  */
(function () {
  window.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".pricex-grid");
    if (!grid) return; // No pricing grid on this page

    const wrapper = grid.closest(".pricex-wrap") || document;
    const pills = wrapper.querySelectorAll(".pricex-pill");
    const amounts = grid.querySelectorAll(".pricex-amount");
    const suffixes = grid.querySelectorAll(".pricex-suffix");

    function setCycle(cycle) {
      grid.setAttribute("data-cycle", cycle);
      pills.forEach((p) =>
        p.classList.toggle("pricex-active", p.dataset.cycle === cycle)
      );
      amounts.forEach((a) => {
        const monthlyAttr = a.getAttribute("data-monthly");
        const monthly = monthlyAttr
          ? parseFloat(monthlyAttr)
          : parseFloat((a.textContent || "").replace(/[^0-9.]/g, "")) || 0;

        const card = a.closest(".pricex-card");
        const planName = (card?.querySelector(".pricex-plan")?.textContent || "")
          .toLowerCase()
          .trim();
        const discountMap = { basic: 0.02, premium: 0.05, advanced: 0.1 };
        const discount = discountMap[planName] || 0;

        let displayVal = monthly;
        if (cycle === "yearly") {
          const yearlyAttr = a.getAttribute("data-yearly");
          if (yearlyAttr) {
            displayVal = parseFloat(yearlyAttr) || 0;
          } else {
            const yearlyRaw = monthly * 12 * (1 - discount);
            displayVal = Math.round(yearlyRaw);
          }
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
    setCycle("monthly");
  });
})();
/* ================================  End Pricing 1200 ================================  */
/* ========== Start blogDetails cards (1700) ========== */
(function () {
  function blogdetailsReveal(
    selector = ".js-blogdetails-reveal",
    options = { threshold: 0.2 }
  ) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("blogdetails-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("blogdetails-visible");
          io.unobserve(entry.target);
        }
      });
    }, options);

    els.forEach((el) => io.observe(el));
  }
  document.addEventListener("DOMContentLoaded", () => blogdetailsReveal());
})();
/* ========== End blogDetails cards (1700) ========== */

/* ========== Start EventGrid cards (8000) ========== */
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".js-reveal");

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
/* ========== End EventGrid cards (8000) ========== */
/* ========== Start blogList cards (1600) ========== */
(function () {
  function bloglistReveal(
    selector = ".js-bloglist-reveal",
    options = { threshold: 0.2 }
  ) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("bloglist-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("bloglist-visible");
          io.unobserve(entry.target);
        }
      });
    }, options);

    elements.forEach((el) => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    bloglistReveal();
    document.querySelectorAll(".bloglist-btn-primary").forEach((btn) => {
      btn.addEventListener("keyup", (e) => {
        if (e.key === "Enter" || e.key === " ")
          btn.classList.toggle("is-pressed");
      });
    });
  });
})();
/* ========== End blogList (1600) ========== */
/* ========== Start programGrid (600) ========== */
(function () {
  const reveal = (
    selector = ".js-eg2-reveal",
    opts = { threshold: 0.2, rootMargin: "0px" }
  ) => {
    const els = document.querySelectorAll(selector);
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach((el) => el.classList.add("eg2-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("eg2-visible");
          io.unobserve(entry.target);
        }
      });
    }, opts);

    els.forEach((el) => io.observe(el));
  };

  document.addEventListener("DOMContentLoaded", () => {
    reveal();

    document.querySelectorAll(".eg2-btn-primary").forEach((btn) => {
      btn.addEventListener("keyup", (e) => {
        if (e.key === "Enter" || e.key === " ")
          btn.classList.toggle("is-pressed");
      });
    });
  });
})();
/* ========== End programGrid (600) ========== */
/* ========== Start programDetails (700) ========== */
(function () {
  const section = document.getElementById("programdetails");
  if (!section) return;
  const skills = section.querySelectorAll(".programdetails-skill");

  function animateBars() {
    skills.forEach((skill) => {
      const target = parseInt(skill.getAttribute("data-perc"), 10) || 0;
      const fill = skill.querySelector(".programdetails-fill");
      fill.style.width = target + "%";
    });
  }
  function resetBars() {
    skills.forEach((skill) => {
      const fill = skill.querySelector(".programdetails-fill");
      fill.style.width = "0%";
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add("active");
          animateBars();
        } else {
          section.classList.remove("active");
          resetBars();
        }
      });
    },
    { threshold: 0.3 }
  );

  io.observe(section);
})();

(function () {
  function reveal(
    selector = ".js-programdetails-pds3-reveal",
    options = { threshold: 0.2 }
  ) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("programdetails-pds3-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("programdetails-pds3-visible");
          io.unobserve(entry.target);
        }
      });
    }, options);

    els.forEach((el) => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => reveal());
})();
/* ========== End programDetails (700) ========== */
