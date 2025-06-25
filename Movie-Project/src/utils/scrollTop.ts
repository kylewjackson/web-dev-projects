export default function scrollTop() {
  const root = document.scrollingElement || document.documentElement;
  // feature-detect Safari’s support
  if ("scrollBehavior" in document.documentElement.style) {
    root.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  } else {
    root.scrollTo(0, 0);
  }
}
