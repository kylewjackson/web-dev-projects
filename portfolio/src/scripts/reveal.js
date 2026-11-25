const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");

if (motion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      // Each animation ends with the same styles as the static page.
      entry.target.classList.add("reveal-in");
    }
  });

  for (const element of document.querySelectorAll("[data-reveal], .footer-content > :is(h2, .container)")) {
    observer.observe(element);
  }
}
