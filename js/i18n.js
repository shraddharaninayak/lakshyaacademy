/**
 * THE LAKSHYA CAREER ACADEMY — BILINGUAL (ENGLISH - MARATHI) ENGINE
 * Provides instant, controlled, lossless switching across all pages.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'lakshya_lang';
  const DEFAULT_LANG = 'en';

  // Nodes to skip during translation
  const IGNORED_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'CIRCLE', 'RECT', 'CODE', 'PRE'
  ]);

  // Track translated text nodes
  const trackedNodes = new Set();

  function getSavedLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function updateSwitcherUI(lang) {
    document.querySelectorAll('.lang-pill').forEach((btn) => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  function translateNodeTree(rootNode, dict) {
    const walker = document.createTreeWalker(
      rootNode,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (IGNORED_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest('.lang-selector') || parent.closest('.notranslate')) {
            return NodeFilter.FILTER_REJECT;
          }
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      // Store original English text
      if (typeof currentNode._origEnText === 'undefined') {
        currentNode._origEnText = currentNode.nodeValue;
        trackedNodes.add(currentNode);
      }

      const orig = currentNode._origEnText;
      const trimmed = orig.trim();

      if (dict && Object.prototype.hasOwnProperty.call(dict, trimmed)) {
        const leading = orig.match(/^\s*/)[0];
        const trailing = orig.match(/\s*$/)[0];
        currentNode.nodeValue = leading + dict[trimmed] + trailing;
      }
    }
  }

  function restoreNodeTree(rootNode) {
    trackedNodes.forEach((node) => {
      if (typeof node._origEnText !== 'undefined' && node.nodeValue !== node._origEnText) {
        node.nodeValue = node._origEnText;
      }
    });
  }

  function translateAttributes(dict) {
    // 1. Buttons with data-txt (Lionheart animated buttons)
    document.querySelectorAll('[data-txt]').forEach((el) => {
      if (!el.hasAttribute('data-en-txt')) {
        el.setAttribute('data-en-txt', el.getAttribute('data-txt'));
      }
      const orig = el.getAttribute('data-en-txt').trim();
      if (dict && Object.prototype.hasOwnProperty.call(dict, orig)) {
        const tr = dict[orig];
        el.setAttribute('data-txt', tr);
        el.textContent = tr;
      }
    });

    // 2. Input and textarea placeholders
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((el) => {
      if (!el.hasAttribute('data-en-placeholder')) {
        el.setAttribute('data-en-placeholder', el.getAttribute('placeholder'));
      }
      const orig = el.getAttribute('data-en-placeholder').trim();
      if (dict && Object.prototype.hasOwnProperty.call(dict, orig)) {
        el.setAttribute('placeholder', dict[orig]);
      }
    });

    // 3. Aria-labels (skip language pills)
    document.querySelectorAll('[aria-label]').forEach((el) => {
      if (el.classList.contains('lang-pill') || el.classList.contains('lang-selector')) return;
      if (!el.hasAttribute('data-en-aria')) {
        el.setAttribute('data-en-aria', el.getAttribute('aria-label'));
      }
      const orig = el.getAttribute('data-en-aria').trim();
      if (dict && Object.prototype.hasOwnProperty.call(dict, orig)) {
        el.setAttribute('aria-label', dict[orig]);
      }
    });
  }

  function restoreAttributes() {
    // 1. Buttons with data-txt
    document.querySelectorAll('[data-en-txt]').forEach((el) => {
      const orig = el.getAttribute('data-en-txt');
      el.setAttribute('data-txt', orig);
      el.textContent = orig;
    });

    // 2. Placeholders
    document.querySelectorAll('[data-en-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', el.getAttribute('data-en-placeholder'));
    });

    // 3. Aria-labels
    document.querySelectorAll('[data-en-aria]').forEach((el) => {
      el.setAttribute('aria-label', el.getAttribute('data-en-aria'));
    });
  }

  function applyLanguage(lang) {
    const dict = window.LAKSHYA_I18N || {};

    if (lang === 'mr') {
      document.documentElement.lang = 'mr';
      document.body.classList.add('lang-mr');
      translateNodeTree(document.body, dict);
      translateAttributes(dict);
    } else {
      document.documentElement.lang = 'en';
      document.body.classList.remove('lang-mr');
      restoreNodeTree(document.body);
      restoreAttributes();
    }

    updateSwitcherUI(lang);
    saveLanguage(lang);

    // Dispatch custom event for extensions/integrations
    window.dispatchEvent(new CustomEvent('lakshyaLanguageChange', { detail: { lang } }));
  }

  // Public API
  window.LakshyaI18n = {
    setLanguage: function (lang) {
      if (lang !== 'en' && lang !== 'mr') return;
      applyLanguage(lang);
    },
    getLanguage: function () {
      return getSavedLanguage();
    },
    reapply: function () {
      applyLanguage(getSavedLanguage());
    }
  };

  // Click handler delegation for all language switcher buttons
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.lang-pill');
    if (btn) {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang) {
        window.LakshyaI18n.setLanguage(targetLang);
      }
    }
  });

  // Initialize on DOM ready
  function init() {
    const currentLang = getSavedLanguage();
    updateSwitcherUI(currentLang);
    if (currentLang === 'mr') {
      applyLanguage('mr');
    }

    // Observe dynamic elements (e.g. popover modals, tab content toggles)
    const observer = new MutationObserver(function (mutations) {
      if (window.LakshyaI18n.getLanguage() === 'mr') {
        const dict = window.LAKSHYA_I18N || {};
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              translateNodeTree(node, dict);
              translateAttributes(dict);
            }
          });
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
