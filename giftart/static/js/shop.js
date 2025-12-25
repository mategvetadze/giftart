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

  

function orderFromGallery(button) {
  const card = button.closest('.product-card');
  const img = card.querySelector('img');
  
  if (img && img.src) {
    console.log("📸 Compressing and saving photo...");
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    
    tempImg.onload = function() {
      const maxWidth = 800;
      let width = tempImg.width;
      let height = tempImg.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(tempImg, 0, 0, width, height);
      
      const compressedData = canvas.toDataURL('image/jpeg', 0.7);
      
      console.log("Original size:", tempImg.src.length, "bytes");
      console.log("Compressed size:", compressedData.length, "bytes");
      console.log("Reduction:", ((1 - compressedData.length / tempImg.src.length) * 100).toFixed(1) + "%");
      
      localStorage.setItem('selectedShopPhoto', compressedData);
      console.log("✅ Photo saved! Redirecting...");
      window.location.href = 'order-photo.html';
    };
    
    tempImg.onerror = function() {
      console.error("Failed to load image");
      localStorage.setItem('selectedShopPhoto', img.src);
      window.location.href = 'order-photo.html';
    };
    
    tempImg.src = img.src;
    
  } else {
    console.error("Image not found!");
    window.location.href = 'order-photo.html';
  }
}