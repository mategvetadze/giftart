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