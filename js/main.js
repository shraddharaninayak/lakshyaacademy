/**
 * THE LAKSHYA CAREER ACADEMY — LIONHEART INTERACTION ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initParallaxEngine();
  initHeroBannerSlider();
  initMainMenuDrawer();
  initSearchModal();
  initVideoModals();
  initLinkCardsTabs();
  initImageLinksAccordion();
  initQuoteSlider();
  initStorySlider();
  initPopovers();
  initScrollReveals();
  initSmoothAnchorScroll();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER AUTO-HIDE SCROLL ENGINE
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  const scrollThreshold = 80;
  let isScrolling = false;

  const handleScroll = () => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Add background blur and shadow when scrolled
    if (currentScrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    // Auto-hide navigation on scroll down, show on scroll up
    if (currentScrollY > scrollThreshold) {
      const scrollDiff = currentScrollY - lastScrollY;

      // Scrolling down -> hide navbar
      if (scrollDiff > 6) {
        header.classList.add('header--hidden');
      }
      // Scrolling up -> reveal navbar
      else if (scrollDiff < -6) {
        header.classList.remove('header--hidden');
      }
    } else {
      // Top region of page -> always visible
      header.classList.remove('header--hidden');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  };

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  handleScroll();
}

/* --------------------------------------------------------------------------
   2. PARALLAX ENGINE (Smooth Scroll-Tied Transforms)
   -------------------------------------------------------------------------- */
function initParallaxEngine() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;

  let ticking = false;

  const updateParallax = () => {
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    parallaxElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const speed = el.classList.contains('img-w-txt__secondary-img') ? -0.12 : 0.06;
        const offset = (scrollTop - elementTop) * speed;
        
        const img = el.querySelector('img') || el;
        img.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}

/* --------------------------------------------------------------------------
   3. MULTI-DEPTH SLIDING MENU DRAWER
   -------------------------------------------------------------------------- */
function initMainMenuDrawer() {
  const menuTrigger = document.querySelector('[data-menu-target="main"]');
  const mainMenu = document.querySelector('.main-menu');
  const overlay = document.querySelector('.main-menu__overlay');
  const closeBtns = document.querySelectorAll('[data-menu-close]');

  if (!menuTrigger || !mainMenu) return;

  const openMenu = () => {
    mainMenu.classList.add('is-active');
    if (overlay) overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mainMenu.classList.remove('is-active');
    if (overlay) overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  menuTrigger.addEventListener('click', openMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
  closeBtns.forEach(btn => btn.addEventListener('click', closeMenu));
  
  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainMenu.classList.contains('is-active')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   4. SEARCH OVERLAY MODAL
   -------------------------------------------------------------------------- */
function initSearchModal() {
  const searchTriggers = document.querySelectorAll('[data-modal-target="search"]');
  const searchModal = document.querySelector('[data-modal="search"]');

  if (!searchModal) return;

  searchTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      searchModal.classList.toggle('is-active');
      const input = searchModal.querySelector('input');
      if (input && searchModal.classList.contains('is-active')) {
        setTimeout(() => input.focus(), 150);
      }
    });
  });

  const closeBtns = searchModal.querySelectorAll('[data-modal-target="search"]');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => searchModal.classList.remove('is-active'));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('is-active')) {
      searchModal.classList.remove('is-active');
    }
  });
}

/* --------------------------------------------------------------------------
   5. VIDEO STORY MODALS
   -------------------------------------------------------------------------- */
function initVideoModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target^="section-6-video"]');
  
  modalTriggers.forEach(trigger => {
    const targetId = trigger.getAttribute('data-modal-target');
    const modal = document.querySelector(`[data-modal="${targetId}"]`);
    if (!modal) return;

    const iframeHtml = modal.getAttribute('data-modal-vid') || '';
    const innerContainer = modal.querySelector('.vid-modal__inner');
    const closeBtns = modal.querySelectorAll('[data-modal-close]');

    trigger.addEventListener('click', () => {
      if (innerContainer) innerContainer.innerHTML = iframeHtml;
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
      modal.classList.remove('is-active');
      if (innerContainer) innerContainer.innerHTML = '';
      document.body.style.overflow = '';
    };

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  });
}

/* --------------------------------------------------------------------------
   6. LINK CARDS / ACCORDION TABS
   -------------------------------------------------------------------------- */
function initLinkCardsTabs() {
  const linkCardItems = document.querySelectorAll('.link-cards__item');
  if (!linkCardItems.length) return;

  linkCardItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      linkCardItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });

    item.addEventListener('click', () => {
      linkCardItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   7. 4-COLUMN VERTICAL IMAGE LINKS ACCORDION
   -------------------------------------------------------------------------- */
function initImageLinksAccordion() {
  const imgLinkItems = document.querySelectorAll('[data-img-link]');
  if (!imgLinkItems.length) return;

  imgLinkItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      imgLinkItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   8. QUOTE SLIDER (Typographic Carousel)
   -------------------------------------------------------------------------- */
function initQuoteSlider() {
  const slider = document.querySelector('.flickity--quote');
  if (!slider) return;

  const slides = slider.querySelectorAll('.flickity__item');
  if (slides.length <= 1) return;

  let currentIndex = 0;

  // Create dot pagers
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'slider-dots';

  slides.forEach((slide, index) => {
    if (index !== 0) slide.style.display = 'none';
    const dot = document.createElement('button');
    dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsContainer.appendChild(dot);
  });

  slider.appendChild(dotsContainer);
  const dots = dotsContainer.querySelectorAll('.slider-dot');

  function showSlide(index) {
    slides[currentIndex].style.display = 'none';
    dots[currentIndex].classList.remove('active');
    currentIndex = index;
    slides[currentIndex].style.display = 'block';
    dots[currentIndex].classList.add('active');
  }

  // Auto rotation every 5.5s
  setInterval(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }, 5500);
}

/* --------------------------------------------------------------------------
   9. STORY SLIDER WITH FULL-BLEED CARDS
   -------------------------------------------------------------------------- */
function initStorySlider() {
  const storyContainer = document.querySelector('.section-quote-over-image-slider');
  if (!storyContainer) return;

  const slides = storyContainer.querySelectorAll('.flickity__item');
  if (slides.length <= 1) return;

  let currentStory = 0;

  slides.forEach((slide, idx) => {
    if (idx !== 0) slide.style.display = 'none';
  });

  // Create bottom switcher
  const controls = document.createElement('div');
  controls.style.cssText = 'position: absolute; bottom: 2rem; right: 2rem; z-index: 10; display: flex; gap: 0.75rem;';

  slides.forEach((_, idx) => {
    const btn = document.createElement('button');
    btn.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
    btn.style.cssText = 'width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; border: none;';
    if (idx === 0) btn.style.background = '#C5A059';

    btn.addEventListener('click', () => {
      slides[currentStory].style.display = 'none';
      controls.children[currentStory].style.background = 'rgba(255,255,255,0.4)';
      currentStory = idx;
      slides[currentStory].style.display = 'block';
      controls.children[currentStory].style.background = '#C5A059';
    });

    controls.appendChild(btn);
  });

  storyContainer.appendChild(controls);
}

/* --------------------------------------------------------------------------
   10. POPOVER CONSULTATION DRAWER
   -------------------------------------------------------------------------- */
function initPopovers() {
  const popoverTriggers = document.querySelectorAll('[href="#popover-start-your-journey"], [data-popover-target="start-your-journey"], [data-open-enquiry]');
  const popover = document.querySelector('#popover-start-your-journey, .enquiry-drawer');
  const popoverOverlay = document.querySelector('.popover__overlay, .mobile-drawer__overlay');

  if (!popover) return;

  const openPopover = (e) => {
    if (e) e.preventDefault();
    popover.classList.add('is-active');
    if (popoverOverlay) popoverOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closePopover = () => {
    popover.classList.remove('is-active');
    if (popoverOverlay) popoverOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  popoverTriggers.forEach(t => t.addEventListener('click', openPopover));
  const closeBtns = popover.querySelectorAll('.popover__header-close, .enquiry-drawer__close');
  closeBtns.forEach(b => b.addEventListener('click', closePopover));
  if (popoverOverlay) popoverOverlay.addEventListener('click', closePopover);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popover.classList.contains('is-active')) {
      closePopover();
    }
  });
}

/* --------------------------------------------------------------------------
   11. SCROLL REVEALS INTERSECTION OBSERVER WITH FAILSAFE
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(
    '[data-animate="fade"], .reveal, .reveal-fade-up, .reveal-fade-in, .reveal-slide-left, .reveal-slide-right, .img-reveal-mask, .line-reveal, .director-card, .director-card-home'
  );
  if (!revealElements.length) return;

  // Immediate check for above-the-fold or in-viewport elements
  const checkInViewport = () => {
    const winHeight = window.innerHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < winHeight + 100) {
        el.classList.add('is-revealed');
      }
    });
  };

  checkInViewport();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px 50px 0px',
      threshold: 0.02
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Final safety reveal timeout: Ensures zero elements remain hidden
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }, 800);
}

/* --------------------------------------------------------------------------
   12. SMOOTH ANCHOR SCROLLING
   -------------------------------------------------------------------------- */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"]):not([href^="#popover"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   13. HERO BANNER ROTATING SLIDESHOW ENGINE
   -------------------------------------------------------------------------- */
function initHeroBannerSlider() {
  const slideshow = document.getElementById('hero-slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.flagship-banner__slide');
  const dots = document.querySelectorAll('.flagship-banner__dot');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const counterCurrent = document.getElementById('hero-counter-current');
  const counterTotal = document.querySelector('.hero-bottom__counter-total');

  if (slides.length <= 1) return;

  if (counterTotal) {
    counterTotal.textContent = String(slides.length).padStart(2, '0');
  }

  let currentIndex = 0;
  let intervalId = null;
  const slideDuration = 4500; // 4.5 seconds per slide

  const showSlide = (index) => {
    // Normalise wrap-around index
    let targetIndex = index;
    if (targetIndex < 0) targetIndex = slides.length - 1;
    if (targetIndex >= slides.length) targetIndex = 0;

    slides.forEach((slide, i) => {
      if (i === targetIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === targetIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (counterCurrent) {
      counterCurrent.textContent = String(targetIndex + 1).padStart(2, '0');
    }

    currentIndex = targetIndex;
  };

  const nextSlide = () => {
    showSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    showSlide(currentIndex - 1);
  };

  const startAutoplay = () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextSlide, slideDuration);
  };

  const stopAutoplay = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // Manual Previous Button
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      startAutoplay();
    });
  }

  // Manual Next Button
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      startAutoplay();
    });
  }

  // Slide navigation dots (if present)
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        showSlide(idx);
        startAutoplay();
      }
    });
  });

  // Pause on hover or touch
  const banner = document.querySelector('.flagship-banner');
  if (banner) {
    banner.addEventListener('mouseenter', stopAutoplay);
    banner.addEventListener('mouseleave', startAutoplay);
    banner.addEventListener('touchstart', stopAutoplay, { passive: true });
    banner.addEventListener('touchend', startAutoplay, { passive: true });
  }

  startAutoplay();
}