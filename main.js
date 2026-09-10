/* Shared vanilla JS. No framework or external dependency required. */
'use strict';
document.documentElement.classList.add('js');

// Add verified chapter links here; null keeps an honest review notice.
const CHAPTER_LINKS = Object.freeze({ newsletter: null, discord: null });
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const mobile = window.matchMedia('(max-width: 900px)');

function setMenu(open, restoreFocus = false) {
  if (!toggle || !navigation) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open && mobile.matches);
  if (restoreFocus) toggle.focus();
}
if (toggle && navigation) {
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') setMenu(false, true);
    // Keep keyboard navigation inside the expanded mobile menu and its toggle.
    if (event.key === 'Tab' && mobile.matches) {
      const items = [toggle, ...navigation.querySelectorAll('a')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  mobile.addEventListener('change', () => setMenu(false));
}
document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });

const notice = document.querySelector('#preview-notice');
document.querySelectorAll('[data-community-link]').forEach(link => {
  const url = CHAPTER_LINKS[link.dataset.communityLink];
  if (url) {
    link.href = url;
    link.removeAttribute('data-pending-page');
  }
});
// Delete a link's data-pending-page attribute when its target page is available.
document.querySelectorAll('[data-pending-page]').forEach(link => {
  link.addEventListener('click', event => {
    if (!notice) return;
    event.preventDefault();
    setMenu(false);
    const isCommunityLink = Boolean(link.dataset.communityLink);
    notice.querySelector('#notice-message').textContent = isCommunityLink
      ? 'The chapter signup links have not been added yet. They will be connected before launch.'
      : 'This page is part of the next website step. The homepage is ready for review.';
    notice.showModal();
  });
});
if (notice) notice.addEventListener('click', event => {
  const bounds = notice.getBoundingClientRect();
  if (event.target === notice && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) notice.close();
});
