// categories.js
document.addEventListener('DOMContentLoaded', () => {
  const listing     = document.querySelector('.category-listing');
  const sections    = document.querySelectorAll('.category-section');
  const links       = document.querySelectorAll('.category-link');

  // Hide all detail sections
  function hideAllSections() {
    sections.forEach(s => s.classList.add('hidden'));
  }

  // Show exactly one section by its ID
  function showSectionById(id) {
    hideAllSections();
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
  }

  // When a "View All" link is clicked
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const hash = link.getAttribute('href').split('#')[1];
      if (!hash) return;

      // Hide the overview grid
      if (listing) listing.classList.add('hidden');

      // Show the chosen category
      showSectionById(hash);

      // Update URL (so reload/bookmark works)
      history.replaceState(null, '', `#${hash}`);
    });
  });

  // On page load, if there's a hash, show that section
  const initialHash = window.location.hash.replace('#','');
  if (initialHash && document.getElementById(initialHash)) {
    if (listing) listing.classList.add('hidden');
    showSectionById(initialHash);
  } else {
    // No hash → show overview, hide all detail sections
    if (listing) listing.classList.remove('hidden');
    hideAllSections();
  }
});
