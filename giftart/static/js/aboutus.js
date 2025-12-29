const animaated = document.querySelectorAll(
  ".features, .stats-bar, .gallery-item"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -20% 0px"
  }
);
animaated.forEach((el) => observer.observe(el));


document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded");
  
  const animated = document.querySelectorAll(
    ".features, .stats-bar, .gallery-item"
  );

  if (animated.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -20% 0px"
      }
    );
    animated.forEach((el) => observer.observe(el));
  }

  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".header nav");
  const overlay = document.querySelector(".nav-overlay");

  console.log("Hamburger:", hamburger);
  console.log("Nav:", nav);
  console.log("Overlay:", overlay);

  if (hamburger && nav && overlay) {
    console.log("All elements found!");
    
    hamburger.addEventListener("click", (e) => {
      console.log("Hamburger clicked!", e);
      const isOpen = nav.classList.toggle("is-open");
      console.log("Menu is now:", isOpen ? "OPEN" : "CLOSED");
      hamburger.classList.toggle("is-active", isOpen);
      overlay.classList.toggle("is-active", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    overlay.addEventListener("click", () => {
      console.log("Overlay clicked!");
      nav.classList.remove("is-open");
      hamburger.classList.remove("is-active");
      overlay.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });

    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        console.log("Nav link clicked!");
        nav.classList.remove("is-open");
        hamburger.classList.remove("is-active");
        overlay.classList.remove("is-active");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
    
    console.log("Event listeners attached!");
  } else {
    console.error("MISSING ELEMENTS:");
    if (!hamburger) console.error("- Hamburger not found");
    if (!nav) console.error("- Nav not found");
    if (!overlay) console.error("- Overlay not found");
  }
});