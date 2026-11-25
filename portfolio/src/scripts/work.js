function enhanceContents() {
  const contents = document.querySelector("#work-toc");
  const dock = document.querySelector(".work-dock");
  const end = document.querySelector(".work-end");
  let headerClearance;
  let frame;

  function update() {
    frame = undefined;
    const pastContents = contents.getBoundingClientRect().bottom <= headerClearance;
    const nearEnd = end.getBoundingClientRect().top <= window.innerHeight - 24;
    const visible = pastContents && !nearEnd;
    dock.inert = !visible && document.activeElement !== dock;
  }

  function scheduleUpdate() {
    frame ??= requestAnimationFrame(update);
  }

  function measure() {
    headerClearance = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    scheduleUpdate();
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("pageshow", measure);
  dock.addEventListener("blur", scheduleUpdate);
  measure();
}

function enhanceSectionReveal() {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.intersectionRatio < 0.5) continue;
      entry.target.classList.add("work-project__heading--entered");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.5 });

  document.querySelectorAll(".work-project__heading").forEach((heading) => observer.observe(heading));
}

function enhanceScreenshots() {
  const viewer = document.querySelector("#work-viewer");
  if (typeof viewer.showModal !== "function") return;

  const caption = viewer.querySelector("#work-viewer-caption");
  const stage = viewer.querySelector(".work-viewer__stage");
  const gallery = viewer.querySelector(".work-viewer__gallery");
  const position = viewer.querySelector(".work-viewer__position");
  const original = viewer.querySelector(".work-viewer__original");
  const screenshot = new Image();
  stage.append(screenshot);

  let opener;
  let images;
  let index;

  function showImage() {
    const link = images[index];
    const preview = link.querySelector("img");
    caption.textContent = link.closest("figure").querySelector("figcaption").textContent.trim();
    stage.style.aspectRatio = `${preview.getAttribute("width")} / ${preview.getAttribute("height")}`;
    screenshot.alt = preview.alt;
    screenshot.src = link.href;
    original.href = link.href;
    position.textContent = `Image ${index + 1} of ${images.length}`;
  }

  function step(direction) {
    index = (index + direction + images.length) % images.length;
    showImage();
  }

  for (const link of document.querySelectorAll("[data-work-image]")) {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      images = [...link.closest(".work-project").querySelectorAll("[data-work-image]")];
      index = images.indexOf(link);
      gallery.hidden = images.length < 2;
      showImage();

      try {
        viewer.showModal();
      } catch {
        return;
      }

      event.preventDefault();
      opener = link;
    });
    link.setAttribute("aria-haspopup", "dialog");
  }

  gallery.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => step(Number(button.dataset.step)));
  });

  viewer.addEventListener("keydown", (event) => {
    if (images.length < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    step(event.key === "ArrowLeft" ? -1 : 1);
  });

  viewer.addEventListener("close", () => {
    opener?.focus({ preventScroll: true });
  });
}

enhanceContents();
enhanceSectionReveal();
enhanceScreenshots();
