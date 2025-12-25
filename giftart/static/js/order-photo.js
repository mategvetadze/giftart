const DB_NAME = 'GiftartDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function savePhotoToDB(orderId, file) {
  const db = await openDB();
  const base64 = await fileToBase64(file);
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({
      id: `order_${orderId}_${file.name}`,
      orderId: orderId,
      fileName: file.name,
      data: base64,
      timestamp: Date.now()
    });
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const shopPhoto = localStorage.getItem("selectedShopPhoto");

function fileToBase64(file) {
  return new Promise(resolve => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  
  steps = [...document.querySelectorAll(".order-step")];
  let index = 0;

  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  updateProgress();

  document.addEventListener("click", e => {
    if (e.target.matches("[data-next]")) {
      if (!validateCurrentStep()) return;

      if (index < steps.length - 1) {
        steps[index].classList.remove("active");
        steps[index].classList.add("hidden");

        index++;

        steps[index].classList.add("active");
        steps[index].classList.remove("hidden");

        updateProgress();
      }
    }

    if (e.target.matches("[data-back]")) {
      if (index === 0) {
        window.history.back();   
        return;
      }

      steps[index].classList.remove("active");
      steps[index].classList.add("hidden");

      index--;

      steps[index].classList.add("active");
      steps[index].classList.remove("hidden");

      updateProgress();
    }
  });

  function updateProgress() {
    const percent = ((index + 1) / steps.length) * 100;
    progressFill.style.width = percent + "%";
    progressText.innerText = `ნაბიჯი ${index + 1} / ${steps.length}`;
  }

  function fail(field, msg) {
    showError(msg);
    field.focus();
    return false;
  }

  function validateCurrentStep() {
    clearErrors();
    
    if (index === 0) {
      const size = document.querySelector('input[name="frameSize"]:checked');
      const type = document.querySelector('input[name="frameType"]:checked');

      if (!size || !type) {
        showError("გთხოვ აირჩიო ჩარჩოს ზომა და ტიპი");
        return false;
      }

      if (type.value === "custom") {
        const textarea = type.closest(".custom-pill").querySelector(".custom-size");
        if (!textarea || !textarea.value.trim()) {
          showError("გთხოვ მიუთითო სასურველი ფერი");
          if (textarea) textarea.focus();
          return false;
        }
      }

      if (size.value === "custom") {
        const textarea = size.closest(".custom-pill").querySelector(".custom-size");
        if (!textarea || !textarea.value.trim()) {
          showError("გთხოვ მიუთითო სასურველი ზომა");
          if (textarea) textarea.focus();
          return false;
        }
      }

      return true;
    }

    if (index === 1) {
      const city = document.getElementById("cityRegion");
      const address = document.getElementById("address");

      if (!city.value.trim()) {
        showError("გთხოვ მიუთითო ქალაქი", "cityRegion");
        return false;
      }

      if (!address.value.trim()) {
        showError("გთხოვ მიუთითო ზუსტი მისამართი", "address");
        return false;
      }

      return true;
    }

    if (index === 2) {
      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const phone = document.getElementById("phone");

      if (!firstName.value.trim()) {
        showError("მიუთითე სახელი", "firstName");
        return false;
      }

      if (!lastName.value.trim()) {
        showError("მიუთითე გვარი", "lastName");
        return false;
      }

      if (!phone.value.trim()) {
        showError("მიუთითე ტელეფონის ნომერი", "phone");
        return false;
      }

      if (!receiptFile) {
        showError("გთხოვ ატვირთო გადახდის ქვითარი 📄", "phone"); 
        return false;
      }

      return true;
    }

    return true;
  }

  function showError(message, fieldId = null) {
    document.querySelectorAll('.error-message').forEach(e => e.remove());
    document.querySelectorAll('.has-error').forEach(e => e.classList.remove('has-error'));

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;

    if (fieldId) {
      const field = document.getElementById(fieldId);
      if (field) {
        const twoCol = field.closest('.two-col');
        const fieldContainer = twoCol || field.closest('.field') || field.closest('.card');
        
        if (fieldContainer) {
          fieldContainer.parentNode.insertBefore(errorDiv, fieldContainer);
          fieldContainer.classList.add('has-error');
          
          errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
          field.focus();
        }
      }
    } else {
      const activeStep = document.querySelector('.order-step.active');
      activeStep.insertBefore(errorDiv, activeStep.firstChild);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(() => {
      errorDiv.remove();
      document.querySelectorAll('.has-error').forEach(e => e.classList.remove('has-error'));
    }, 5000);
  }

  function clearErrors() {
    document.querySelectorAll(".error-message").forEach(e => e.remove());
  }

  const modal = document.getElementById("modal");
const modalOk = document.getElementById("modalOk");
const finishBtn = document.getElementById("finishBtn");

finishBtn.addEventListener("click", async () => {
  console.log("Finish button clicked!");
  
  finishBtn.disabled = true;
  finishBtn.textContent = "იტვირთება...";
  
  if (!validateCurrentStep()) {
    console.log("Validation failed");
    finishBtn.disabled = false;
    finishBtn.textContent = "დასრულება";
    return;
  }
  
  console.log("Validation passed, saving...");
  
  try {
    await savePhotoOrder();
    console.log("Order saved successfully!");
    
    modal.classList.remove("hidden");
    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden");
    
  } catch (error) {
    console.error("Save error:", error);
    alert("შეცდომა შენახვისას: " + error.message);
    
    finishBtn.disabled = false;
    finishBtn.textContent = "დასრულება";
  }
});

modalOk.addEventListener("click", (e) => {
  console.log("Modal OK clicked!");
  e.preventDefault();
  e.stopPropagation();
  
  modal.classList.add("hidden");
  modal.style.display = "none";
  
  setTimeout(() => {
    window.location.href = "home.html";
  }, 50);
});
});

const receiptInput = document.getElementById("receiptPhoto");
const receiptPreview = document.getElementById("receiptPreview");
const receiptHint = document.getElementById("receiptHint");
let receiptFile = null;

if (receiptInput) {
  receiptInput.addEventListener("change", () => {
    receiptPreview.innerHTML = "";

    const file = receiptInput.files[0];

    if (!file) {
      receiptFile = null;
      receiptHint.textContent = "არაფერი არჩეულია";
      return;
    }

    receiptFile = file; 
    receiptHint.textContent = file.name;

    const wrapper = document.createElement("div");
    wrapper.className = "preview-item";

    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      wrapper.appendChild(img);
    }

    if (file.type === "application/pdf") {
      const pdfLabel = document.createElement("div");
      pdfLabel.textContent = "📄 PDF ქვითარი";
      pdfLabel.style.fontSize = "14px";
      pdfLabel.style.color = "#6a4a3a";
      wrapper.appendChild(pdfLabel);
    }

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "×";

    removeBtn.onclick = () => {
      receiptInput.value = "";
      receiptFile = null; 
      receiptPreview.innerHTML = "";
      receiptHint.textContent = "არაფერი არჩეულია";
    };

    wrapper.appendChild(removeBtn);
    receiptPreview.appendChild(wrapper);
  });
}
async function savePhotoOrder() {
  try {
    let orders = JSON.parse(localStorage.getItem("photoOrders") || "[]");
    const orderId = Date.now();

    const shopPhoto = localStorage.getItem("selectedShopPhoto");
    
    console.log("=== SAVING PHOTO ORDER ===");
    console.log("Order ID:", orderId);
    console.log("Shop photo exists:", !!shopPhoto);
    console.log("Shop photo size:", shopPhoto ? (shopPhoto.length / 1024).toFixed(2) + " KB" : "N/A");

    let receiptPhotoId = null;
    if (receiptFile) {
      console.log("Saving receipt photo...");
      await savePhotoToDB(orderId, receiptFile);
      receiptPhotoId = `order_${orderId}_${receiptFile.name}`;
      console.log("✅ Receipt saved:", receiptPhotoId);
    }

let shopPhotoId = null;
if (shopPhoto) {
  console.log("Saving shop photo to IndexedDB...");
  console.log("Shop photo length:", shopPhoto.length);
  
  try {
    const uniquePhotoId = `order_${orderId}_shop_${Date.now()}`;
    
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        id: uniquePhotoId,
        orderId: orderId,
        fileName: `shop_photo_${orderId}.jpg`,
        data: shopPhoto,
        timestamp: Date.now()
      });
      request.onsuccess = () => {
        console.log("✅ Shop photo saved with ID:", uniquePhotoId);
        resolve();
      };
      request.onerror = () => {
        console.error("❌ Failed to save shop photo:", request.error);
        reject(request.error);
      };
    });
    shopPhotoId = uniquePhotoId;
  } catch (err) {
    console.error("❌ Error saving shop photo:", err);
  }
} else {
  console.warn("⚠️ No shop photo found in localStorage");
}

    const order = {
      id: orderId,
      type: "Photo Order",
      
      frameSize: document.querySelector('input[name="frameSize"]:checked')?.value || "",
      frameType: document.querySelector('input[name="frameType"]:checked')?.value || "",
      customColor: document.querySelector(".custom-size")?.value || "",

      city: document.getElementById("cityRegion")?.value || "",
      address: document.getElementById("address")?.value || "",
      addressNote: document.getElementById("addressNote")?.value || "",

      firstName: document.getElementById("firstName")?.value || "",
      lastName: document.getElementById("lastName")?.value || "",
      phone: document.getElementById("phone")?.value || "",

      paymentNote: document.getElementById("paymentNote")?.value || "",

      photos: shopPhoto ? [`shop_photo_${orderId}.jpg`] : [],
      photoIds: shopPhotoId ? [shopPhotoId] : [],
      photoCount: shopPhoto ? 1 : 0,

      receiptPhoto: receiptFile ? receiptFile.name : "",
      receiptPhotoId: receiptPhotoId
    };

    orders.push(order);
    
    console.log("✅ Order object created:", {
      id: order.id,
      photoIds: order.photoIds,
      receiptPhotoId: order.receiptPhotoId
    });
    
    localStorage.setItem("photoOrders", JSON.stringify(orders));
    
    localStorage.removeItem("selectedShopPhoto");
    console.log("🗑️ Cleared selectedShopPhoto from localStorage");
    
    console.log("✅ Order saved to localStorage!");
    
  } catch (error) {
    console.error("❌ Save error:", error);
    throw error;
  }
}