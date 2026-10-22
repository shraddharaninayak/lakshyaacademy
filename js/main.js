/**
 * THE LAKSHYA CAREER ACADEMY — LIONHEART INTERACTION ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initCleanUrlRouter();
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
  initDirectorModals();
  initNavbarDropdowns();
  initCourseTabs();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER AUTO-HIDE SCROLL ENGINE (FLICKER-FREE SMART HEADER)
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);
  let accumulatedDelta = 0;
  let currentDirection = 'none';
  let isTicking = false;

  // Threshold constants for smooth, flicker-free movement
  const TOP_THRESHOLD = 20;      // Always visible and un-scrolled at the very top
  const HIDE_THRESHOLD = 80;     // Minimum scroll distance from top before header can hide
  const HIDE_DELTA = 12;         // Accumulated downward scroll to slide header up out of view
  const SHOW_DELTA = 8;          // Accumulated upward scroll to slide header down into view

  const updateHeader = () => {
    const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;

    // Do not hide if the mobile menu drawer or modal is open
    const isMenuOpen = document.body.classList.contains('menu-open') || 
                       Boolean(document.querySelector('.main-menu.is-active'));
    if (isMenuOpen) {
      header.classList.remove('header--hidden');
      lastScrollY = currentScrollY;
      isTicking = false;
      return;
    }

    // Top region of the page: always keep navbar visible without scroll shadow
    if (currentScrollY <= TOP_THRESHOLD) {
      header.classList.remove('header--scrolled');
      header.classList.remove('header--hidden');
      accumulatedDelta = 0;
      currentDirection = 'none';
      lastScrollY = currentScrollY;
      isTicking = false;
      return;
    }

    // Past top threshold: apply scrolled styling (subtle shadow and background)
    header.classList.add('header--scrolled');

    // Prevent hiding on iOS/macOS rubber-band bounce at bottom
    if (currentScrollY + winHeight >= docHeight - 10) {
      lastScrollY = currentScrollY;
      isTicking = false;
      return;
    }

    const diff = currentScrollY - lastScrollY;

    if (diff > 0) {
      // User is scrolling DOWN
      if (currentDirection !== 'down') {
        currentDirection = 'down';
        accumulatedDelta = 0;
      }
      accumulatedDelta += diff;

      // Smoothly hide navbar once scrolled past threshold with sufficient down movement
      if (currentScrollY > HIDE_THRESHOLD && accumulatedDelta >= HIDE_DELTA) {
        header.classList.add('header--hidden');
      }
    } else if (diff < 0) {
      // User is scrolling UP
      if (currentDirection !== 'up') {
        currentDirection = 'up';
        accumulatedDelta = 0;
      }
      accumulatedDelta += Math.abs(diff);

      // Smoothly reveal navbar on intentional upward scroll
      if (accumulatedDelta >= SHOW_DELTA) {
        header.classList.remove('header--hidden');
      }
    }

    lastScrollY = currentScrollY;
    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(updateHeader);
      isTicking = true;
    }
  }, { passive: true });

  // Initial check on page load
  updateHeader();
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
  
  // Close menu when clicking on an in-page anchor link (e.g. #admission-guidance)
  mainMenu.querySelectorAll('a[href*="#"]').forEach(a => {
    a.addEventListener('click', () => {
      closeMenu();
    });
  });
  
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
  const scrollToTarget = (target) => {
    const headerOffset = 100;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  document.querySelectorAll('a[href^="#"]:not([href="#"]):not([href^="#popover"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        scrollToTarget(target);
      }
    });
  });

  const handleInitialHash = () => {
    if (window.location.hash && window.location.hash !== '#') {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          scrollToTarget(target);
        }, 200);
      }
    }
  };

  window.addEventListener('load', handleInitialHash);
  window.addEventListener('hashchange', handleInitialHash);
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

/* --------------------------------------------------------------------------
   14. CLEAN URL ROUTING ENGINE (Extensionless Navigation)
   -------------------------------------------------------------------------- */
function initCleanUrlRouter() {
  const currentPath = window.location.pathname;

  // Clean up URL bar if pathname currently ends with .html
  if (currentPath.endsWith('.html')) {
    let cleanPath = currentPath.replace(/\.html$/, '');
    if (cleanPath.endsWith('/index')) cleanPath = cleanPath.replace(/\/index$/, '/');
    if (cleanPath === '') cleanPath = '/';
    try {
      window.history.replaceState(null, '', cleanPath + window.location.hash + window.location.search);
    } catch (e) {
      // Ignore if restricted
    }
  }

  // Handle file:// protocol local preview fallback transparently
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(link => {
      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref.startsWith('http') || rawHref.startsWith('tel:') || rawHref.startsWith('mailto:') || rawHref.startsWith('#')) return;

      link.addEventListener('click', (e) => {
        let targetHref = link.getAttribute('href');
        if (!targetHref) return;

        e.preventDefault();
        let targetFile = targetHref;
        if (targetHref === '/' || targetHref === '') targetFile = 'index.html';
        else if (!targetHref.endsWith('.html') && !targetHref.includes('.html#')) {
          const parts = targetHref.split('#');
          targetFile = parts[0] + '.html' + (parts[1] ? '#' + parts[1] : '');
        }
        window.location.href = targetFile;
      });
    });
  }
}

/* --------------------------------------------------------------------------
   14. DIRECTOR PROFILE MODAL ENGINE
   -------------------------------------------------------------------------- */
function initDirectorModals() {
  const triggers = document.querySelectorAll('[data-director-modal-trigger]');
  const cards = document.querySelectorAll('.director-profile-card');
  const modals = document.querySelectorAll('.director-modal');

  if (!triggers.length && !cards.length) return;

  const openModal = (directorId) => {
    const targetModal = document.getElementById(`modal-director-${directorId}`);
    if (!targetModal) return;
    targetModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    const closeBtn = targetModal.querySelector('.director-modal__close');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modal) => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  // Click triggers (buttons and cards)
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = trigger.getAttribute('data-director-modal-trigger');
      if (id) openModal(id);
    });
  });

  // Clicking anywhere on the card opens the profile
  cards.forEach(card => {
    const trigger = card.querySelector('[data-director-modal-trigger]');
    if (!trigger) return;
    const id = trigger.getAttribute('data-director-modal-trigger');

    card.addEventListener('click', (e) => {
      // Don't trigger twice if button itself clicked
      if (e.target.closest('[data-director-modal-trigger]')) return;
      if (id) openModal(id);
    });

    // Keyboard support (Enter/Space on card)
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View full profile of ${card.querySelector('.director-profile-card__name')?.textContent || 'Director'}`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (id) openModal(id);
      }
    });
  });

  // Close handlers
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.director-modal__close');
    const overlay = modal.querySelector('.director-modal__overlay');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
    if (overlay) {
      overlay.addEventListener('click', () => closeModal(modal));
    }
  });

  // ESC key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('is-active')) {
          closeModal(modal);
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   15. NAVBAR DROPDOWN ACCESSIBILITY & MOBILE TAP ENGINE
   -------------------------------------------------------------------------- */
function initNavbarDropdowns() {
  const dropdownItems = document.querySelectorAll('.has-dropdown');
  if (!dropdownItems.length) return;

  dropdownItems.forEach(item => {
    const trigger = item.querySelector(':scope > .nav-link-subtle');
    const dropdown = item.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;

    // Accessibility attributes
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    // Check if this dropdown is the Courses dropdown
    const isCoursesDropdown = trigger.textContent.trim().toLowerCase().includes('courses') ||
                              (trigger.getAttribute('href') && trigger.getAttribute('href').includes('courses'));

    if (isCoursesDropdown) {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('href', 'javascript:void(0);');
    }

    // Handle click/tap interaction on the trigger
    trigger.addEventListener('click', function(e) {
      // Always prevent direct navigation for Courses dropdown
      if (isCoursesDropdown) {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = item.classList.contains('is-active');

        // Close all other dropdowns
        dropdownItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('is-active');
            other.querySelector(':scope > .nav-link-subtle')?.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle this dropdown
        if (isOpen) {
          item.classList.remove('is-active');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-active');
          trigger.setAttribute('aria-expanded', 'true');
        }
        return;
      }

      // Touch / mobile click handling for other dropdowns
      const isTouchOrSmall = window.matchMedia('(hover: none), (max-width: 1024px)').matches;
      if (isTouchOrSmall) {
        if (!item.classList.contains('is-active')) {
          e.preventDefault();
          dropdownItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('is-active');
              other.querySelector(':scope > .nav-link-subtle')?.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.add('is-active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      }
    });

    // Close dropdown when clicking any individual course link inside
    dropdown.querySelectorAll('.dropdown-link').forEach(link => {
      link.addEventListener('click', function() {
        item.classList.remove('is-active');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    // Keyboard navigation: Enter / Space / ArrowDown
    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        if (!item.classList.contains('is-active')) {
          e.preventDefault();
          item.classList.add('is-active');
          trigger.setAttribute('aria-expanded', 'true');
          const firstLink = dropdown.querySelector('a');
          if (firstLink) firstLink.focus();
        }
      }
    });

    // Arrow keys inside dropdown
    const links = dropdown.querySelectorAll('.dropdown-link');
    links.forEach((link, idx) => {
      link.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextLink = links[idx + 1] || links[0];
          nextLink.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (idx === 0) {
            trigger.focus();
          } else {
            links[idx - 1].focus();
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          item.classList.remove('is-active');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-dropdown')) {
      dropdownItems.forEach(item => {
        item.classList.remove('is-active');
        item.querySelector(':scope > .nav-link-subtle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdowns on Escape key globally
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdownItems.forEach(item => {
        if (item.classList.contains('is-active')) {
          item.classList.remove('is-active');
          const trigger = item.querySelector(':scope > .nav-link-subtle');
          if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
          }
        }
      });
    }
  });

  // Mobile Drawer: Courses item accordion toggle (prevents direct navigation to courses page)
  const drawerCoursesLinks = document.querySelectorAll('.main-menu a[href*="courses"], .main-menu .menu-item-link--courses');
  drawerCoursesLinks.forEach(dLink => {
    if (dLink.closest('.main-menu__subitems')) return;

    dLink.setAttribute('href', 'javascript:void(0);');
    dLink.setAttribute('role', 'button');

    const subitems = dLink.parentElement.nextElementSibling;
    if (subitems && subitems.classList.contains('main-menu__subitems')) {
      dLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isCollapsed = subitems.classList.contains('is-collapsed');
        if (isCollapsed) {
          subitems.classList.remove('is-collapsed');
          dLink.classList.remove('is-collapsed');
          dLink.setAttribute('aria-expanded', 'true');
        } else {
          subitems.classList.add('is-collapsed');
          dLink.classList.add('is-collapsed');
          dLink.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   COURSE TABS SYSTEM
   -------------------------------------------------------------------------- */
function initCourseTabs() {
  const wrappers = document.querySelectorAll('.course-tabs-wrapper');
  if (!wrappers.length) return;

  function activateTab(wrapper, activeTab) {
    const targetId = activeTab.getAttribute('aria-controls');
    const tabs = wrapper.querySelectorAll('.course-tab-btn');
    const panes = wrapper.querySelectorAll('.course-tab-pane');

    tabs.forEach(tab => {
      const isActive = tab === activeTab;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    panes.forEach(pane => {
      if (pane.id === targetId) {
        pane.classList.add('is-active');
        pane.style.display = 'block';
      } else {
        pane.classList.remove('is-active');
        pane.style.display = 'none';
      }
    });

    // Keep active tab visible in horizontally scrollable tabs bar on mobile
    if (activeTab && typeof activeTab.scrollIntoView === 'function') {
      try {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } catch (err) {
        // Fallback for older browsers
        activeTab.scrollIntoView(false);
      }
    }
  }

  wrappers.forEach(wrapper => {
    const tabs = wrapper.querySelectorAll('.course-tab-btn');
    const panes = wrapper.querySelectorAll('.course-tab-pane');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        activateTab(wrapper, tab);
      });

      // Keyboard navigation
      tab.addEventListener('keydown', (e) => {
        let targetIndex = null;
        if (e.key === 'ArrowRight') {
          targetIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          targetIndex = 0;
        } else if (e.key === 'End') {
          targetIndex = tabs.length - 1;
        }

        if (targetIndex !== null) {
          e.preventDefault();
          tabs[targetIndex].focus();
          activateTab(wrapper, tabs[targetIndex]);
        }
      });
    });

    // Check if hash matches an element inside a pane
    if (window.location.hash) {
      try {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          const pane = targetElement.closest('.course-tab-pane');
          if (pane && pane.id) {
            const matchingTab = wrapper.querySelector(`.course-tab-btn[aria-controls="${pane.id}"]`);
            if (matchingTab) {
              activateTab(wrapper, matchingTab);
            }
          }
        }
      } catch (err) {
        // Invalid selector, ignore
      }
    }
  });
}
