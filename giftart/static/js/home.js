document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded!');
  
  const slider = document.getElementById("slider");
  const afterImage = document.getElementById("afterImage");
  const handle = document.getElementById("handle");

  if (slider && afterImage && handle) {
    slider.addEventListener("input", () => {
      const value = slider.value;
      afterImage.style.width = value + "%";
      handle.style.left = value + "%";
    });
  }

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
      e.preventDefault();

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
          entry.target.classList.remove("show");
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -80px 0px"
    }
  );

  products.forEach(p => productObserver.observe(p));

  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.header nav');
  const overlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.header nav a');

  console.log('Hamburger:', hamburger);
  console.log('Nav:', nav);
  console.log('Overlay:', overlay);
  console.log('Nav links:', navLinks);

  if (hamburger && nav && overlay) {
    console.log('All elements found! Setting up event listeners...');
    
    function toggleMenu() {
      console.log('Toggle menu called!');
      hamburger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      overlay.classList.toggle('is-active');

      const isOpen = nav.classList.contains('is-open');
      console.log('Menu is now:', isOpen ? 'OPEN' : 'CLOSED');
      
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'მენიუს დახურვა' : 'მენიუს გახსნა');

      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      console.log('Close menu called!');
      hamburger.classList.remove('is-active');
      nav.classList.remove('is-open');
      overlay.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'მენიუს გახსნა');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', (e) => {
      console.log('Hamburger clicked!', e);
      toggleMenu();
    });
    
    overlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
      }
    });
    
    console.log('Event listeners attached successfully!');
  } else {
    console.error('MISSING ELEMENTS:');
    if (!hamburger) console.error('- Hamburger button not found');
    if (!nav) console.error('- Nav element not found');
    if (!overlay) console.error('- Overlay not found');
  }
});