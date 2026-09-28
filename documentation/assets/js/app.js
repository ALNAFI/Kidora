// (doc global js) Kidora Documentation Scripts with Parallax
(() => {
  'use strict';

  // Initialize Lenis for smooth scrolling
  let lenis;
  
  function initLenis() {
    // Load Lenis from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js';
    script.onload = () => {
      lenis = new Lenis({
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      // Lenis scroll event
      lenis.on('scroll', (e) => {
        // Update parallax layers
        updateParallaxLayers(e.scroll);
        
        // Update active navigation
        updateActiveNavigation();
        
        // Update back to top button
        updateBackToTopButton(e.scroll);
      });

      // Start Lenis animation loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };
    document.head.appendChild(script);
  }

  // Initialize Lenis
  initLenis();

  // Theme Toggle Functionality
  function initThemeToggle() {
    const themeToggle = document.querySelector('.switch input');
    const body = document.body;
    
    // Track system listener so we can detach it after a manual choice
    let mql = null;
    let applySystemTheme = null;
    
    // Get saved theme or fall back to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    body.setAttribute('data-theme', initialTheme);
    themeToggle.checked = initialTheme === 'light';

    // If no saved preference, follow system changes
    if (!savedTheme && window.matchMedia) {
      mql = window.matchMedia('(prefers-color-scheme: light)');
      applySystemTheme = (e) => {
        const newSystemTheme = e.matches ? 'light' : 'dark';
        body.setAttribute('data-theme', newSystemTheme);
        themeToggle.checked = newSystemTheme === 'light';
      };
      if (mql.addEventListener) {
        mql.addEventListener('change', applySystemTheme);
      } else if (mql.addListener) {
        mql.addListener(applySystemTheme);
      }
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', (e) => {
      // On manual change, stop following system preference
      if (mql && applySystemTheme) {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', applySystemTheme);
        } else if (mql.removeListener) {
          mql.removeListener(applySystemTheme);
        }
        mql = null;
        applySystemTheme = null;
      }

      const newTheme = e.target.checked ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Smooth transition effect
      body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      setTimeout(() => {
        body.style.transition = '';
      }, 300);
    });
  }

  // Initialize theme toggle
  initThemeToggle();

  // Create parallax background layers
  function createParallaxBackground() {
    const body = document.body;
    
    // Create parallax container
    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'parallax-container';
    
    // Create layers
    const layers = [
      { className: 'parallax-layer-1', speed: 0.1 },
      { className: 'parallax-layer-2', speed: 0.2 },
      { className: 'parallax-layer-3', speed: 0.3 },
      { className: 'parallax-layer-4', speed: 0.5 }
    ];
    
    layers.forEach(layer => {
      const layerElement = document.createElement('div');
      layerElement.className = `parallax-layer ${layer.className}`;
      layerElement.setAttribute('data-speed', layer.speed);
      parallaxContainer.appendChild(layerElement);
    });
    
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'parallax-particles';
    
    // Generate particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particlesContainer.appendChild(particle);
    }
    
    parallaxContainer.appendChild(particlesContainer);
    body.insertBefore(parallaxContainer, body.firstChild);
    
    return parallaxContainer;
  }

  // Parallax scroll effect
  let parallaxLayers = [];
  
  function initParallax() {
    const parallaxContainer = createParallaxBackground();
    parallaxLayers = parallaxContainer.querySelectorAll('.parallax-layer');
  }

  // Update parallax layers (called by Lenis scroll event)
  function updateParallaxLayers(scroll) {
    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-speed'));
      const yPos = -(scroll * speed);
      layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  // Initialize parallax
  initParallax();

  // (doc nav js) mobile toggle
  const navToggle = document.querySelector('.doc-nav-toggle');
  const toc = document.getElementById('doc-toc');
  if (navToggle && toc) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      toc.classList.toggle('open');
    }, { passive: true });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (toc.classList.contains('open') && 
          !toc.contains(e.target) && 
          !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        toc.classList.remove('open');
      }
    }, { passive: true });

    // Close menu when clicking on navigation links
    const navLinks = toc.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        toc.classList.remove('open');
      }, { passive: true });
    });
  }

  // (doc reveal js) intersection observer for reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // (doc scroll js) smooth scroll + active toc link
  const links = Array.from(document.querySelectorAll('#doc-toc a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  };

  // Add smooth scrolling to navigation links using Lenis
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement && lenis) {
        const headerHeight = 76; // Height of fixed header
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        lenis.scrollTo(targetPosition, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }, { passive: false });
  });

  // Update active navigation (called by Lenis scroll event)
  function updateActiveNavigation() {
    let current = null;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 160) { current = sec; break; }
    }
    if (current && current.id) setActive(current.id);
  }

  // (doc copy js) copy code on click of pseudo-button
  document.querySelectorAll('.doc-code').forEach(block => {
    block.addEventListener('click', async () => {
      const code = block.innerText;
      try {
        await navigator.clipboard.writeText(code);
        block.setAttribute('data-copied', 'Copied!');
        setTimeout(() => block.removeAttribute('data-copied'), 1200);
      } catch {}
    });
  });

  // (doc backtotop js) visibility + behavior
  const back = document.querySelector('.doc-backtotop');
  
  // Update back to top button (called by Lenis scroll event)
  function updateBackToTopButton(scroll) {
    if (!back) return;
    back.classList.toggle('visible', scroll > 400);
  }
  
  // Back to top click handler
  back && back.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  }, { passive: true });

  // Mouse movement parallax effect for interactive elements
  function initMouseParallax() {
    const hero = document.querySelector('.doc-hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      hero.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      hero.style.transform = 'translate(0, 0)';
    });
  }

  // Initialize mouse parallax
  initMouseParallax();

})();