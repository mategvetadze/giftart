const animated = document.querySelectorAll(".gallery-item");

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
      threshold: 0.25,
    }
  );

  animated.forEach((el) => observer.observe(el));

  const filterButtons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      items.forEach(item => {
        if (filter === "all" || item.dataset.type === filter) {
          item.style.display = "block";
          requestAnimationFrame(() => item.classList.add("show"));
        } else {
          item.classList.remove("show");
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });

  