 const slider = document.getElementById("slider");
const afterImage = document.getElementById("afterImage");
const handle = document.getElementById("handle");

slider.addEventListener("input", () => {
  const value = slider.value;
  afterImage.style.width = value + "%";
  handle.style.left = value + "%";
});



const animated = document.querySelectorAll(".what .card");

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
    rootMargin: "0px 0px -50px 0px"
  }
);

animated.forEach((el) => observer.observe(el));


const reviews = document.querySelectorAll(".review");

const reviewObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: "0px 0px -60px 0px"
  }
);

reviews.forEach(r => reviewObserver.observe(r));



document.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;

  const active = document.activeElement;

  if (active && active.tagName === "VIDEO") {
    e.preventDefault(); // stop page scroll

    if (active.paused) {
      active.play();
    } else {
      active.pause();
    }
  }
});



const products = document.querySelectorAll(".product");

const productObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show"); // 👈 KEY LINE
      }
    });
  },
  {
    threshold: 0.25,
    rootMargin: "0px 0px -80px 0px"
  }
);

products.forEach(p => productObserver.observe(p));