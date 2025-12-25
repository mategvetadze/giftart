let videoFiles = [];
let receiptFile=null;
document.addEventListener("DOMContentLoaded", () => {
 function validatePaymentStep() {
  const firstName = document.getElementById('firstName');
  const lastName  = document.getElementById('lastName');
  const phone     = document.getElementById('phone');

  if (!firstName.value.trim() || !lastName.value.trim() || !phone.value.trim()) {
    showError("გთხოვ შეავსო სახელი/გვარი და ტელეფონის ნომერი.");
    return false;
  }

  if (!receiptFile) {
    showError("გთხოვ ატვირთო გადახდის ქვითარი 📄");
    return false;
  }

  return true;
}

  const steps = [...document.querySelectorAll(".order-step")];
  let index = 0;

  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  updateProgress();

  document.addEventListener("click", e => {

    const nextBtn = e.target.closest("[data-next]");
if (nextBtn) {

      if (!validateCurrentStep()) return;

      if (index < steps.length - 1) {
        steps[index].classList.remove("active");
        steps[index].classList.add("hidden");

        index++;

        steps[index].classList.add("active");
        steps[
          
          index].classList.remove("hidden");

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

 function validateCurrentStep() {

if (index === 0) {

  if (!videoFiles.length) {
    showError("გთხოვ ატვირთო ფოტოები");
    return false;
  }

  if (videoFiles.length < 5) {
    showError("უნდა ატვირთო მინიმუმ 5 ფოტო");
    return false;
  }

  if (videoFiles.length > 7) {
    showError("შეგიძლიათ მაქსიმუმ 7 ფოტო ატვირთოთ");
    return false;
  }

  return true;
}


if (index === 1) {

  const method = document.querySelector('input[name="deliveryMethod"]:checked');

 if (!method) {
  showError("გთხოვ აირჩიო მიწოდების მეთოდი", "#step-opt4 .delivery-methods");
  return false;
}


  const card = method.closest(".delivery-card");
  const extra = card.querySelector(".delivery-extra");

 if (method.value === "gmail") {
  if (!extra || !extra.value.trim()) {
    showError("გთხოვ მიუთითო Gmail მისამართი", ".delivery-card.gmail");
    return false;
  }

 const email = extra.value.trim();
if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
  showError("მიუთითე ვალიდური Gmail მისამართი (@gmail.com)");
  return false;
}

  }

 if (method.value === "other") {
  if (!extra || !extra.value.trim()) {
    showError("გთხოვ მიუთითო სასურველი მიწოდების მეთოდი", ".delivery-card.other");
    return false;
  }
}


  return true;
}
if (index === steps.length-1) {

  return validatePaymentStep();
}

  return true;
}

  function fail(field, msg) {
    showError(msg);
    field.focus();
    return false;
  }
function showError(message, containerSelector = null) {
  document.querySelectorAll(".error-message").forEach(e => e.remove());
  document.querySelectorAll(".has-error").forEach(e => e.classList.remove("has-error"));

  const activeStep = document.querySelector(".order-step.active");

  const error = document.createElement("div");
  error.className = "error-message show";
  error.textContent = message;

  if (containerSelector) {
    const container = document.querySelector(containerSelector);
    if (container) {
      container.classList.add("has-error");

      container.insertBefore(error, container.firstChild);

      error.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }

  const mainCard = activeStep.querySelector(".card") || activeStep;
  mainCard.insertBefore(error, mainCard.firstChild);
}



  function clearErrors() {
    document.querySelectorAll(".error-message").forEach(e => e.remove());
  }
const finishBtn = document.getElementById("finishBtn");
const modal = document.getElementById("modal");
const modalOk = document.getElementById("modalOk");

console.log("Modal elements:", { finishBtn, modal, modalOk }); // Debug line
if (finishBtn) {
  finishBtn.onclick = async () => {
    console.log("Finish button clicked!");

    if (!validatePaymentStep()) {
      return;
    }
    if (videoFiles.length < 5) {
      alert("უნდა ატვირთო მინიმუმ 5 ფოტო");
      return;
    }

    try {
      await saveVideoOrder();
      console.log("Order saved, showing modal...");
      if (modal) {
        modal.classList.remove("hidden");
        modal.style.display = "flex";
        modal.removeAttribute("aria-hidden"); // Add this line
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("შეცდომა!");
    }
  };
}

if (modalOk) {
  // Remove any existing listeners
  modalOk.replaceWith(modalOk.cloneNode(true));
  const freshModalOk = document.getElementById("modalOk");
  
  freshModalOk.addEventListener("click", function(e) {
    console.log("OK clicked!");
    e.preventDefault();
    e.stopPropagation();
    
    const modal = document.getElementById("modal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.add("hidden");
    }
    
    setTimeout(() => {
      window.location.href = "home.html";
    }, 100);
  });
}
}); 

const receiptInput = document.getElementById("receiptPhoto");
const receiptPreview = document.getElementById("receiptPreview");
const receiptHint = document.getElementById("receiptHint");

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


const videoInput = document.getElementById("videoPhotos");
const videoHint = document.getElementById("videoPhotosHint");
const videoPreview = document.getElementById("videoPhotosPreview");

if (videoInput) {
  videoInput.addEventListener("change", () => {
    const selectedFiles = Array.from(videoInput.files);

    if (videoFiles.length + selectedFiles.length > 7) {
      alert("შეგიძლიათ მაქსიმუმ 7 ფოტო ატვირთოთ");
      videoInput.value = "";
      return;
    }

    selectedFiles.forEach(file => {
      videoFiles.push(file);
    });

    videoInput.value = "";
    updateVideoPreview();
  });
}

function updateVideoPreview() {
  videoPreview.innerHTML = "";

  videoFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "preview-item";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "×";

    removeBtn.onclick = () => {
      videoFiles.splice(index, 1);
      updateVideoPreview();
    };

    item.appendChild(img);
    item.appendChild(removeBtn);
    videoPreview.appendChild(item);
  });

  videoHint.textContent = `${videoFiles.length} ფოტო არჩეულია`;

  if (videoFiles.length < 5) {
    videoHint.textContent += " (მინ 5 საჭიროა)";
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
function compressImage(file, maxWidth = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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


async function saveVideoOrder() {
  console.log("saveVideoOrder called!");
  
  try {
    const orders = JSON.parse(localStorage.getItem("videoOrders") || "[]");
    const orderId = Date.now();

    const method = document.querySelector('input[name="deliveryMethod"]:checked');
    const extra = method?.closest(".delivery-card")?.querySelector(".delivery-extra")?.value || "";

    
    let receiptPhotoId = null;
    if (receiptFile) {
      await savePhotoToDB(orderId, receiptFile);
      receiptPhotoId = `order_${orderId}_${receiptFile.name}`;
    }
    
    
    console.log("Saving photos to IndexedDB...");
    const photoIds = [];
    for (const file of videoFiles) {
      await savePhotoToDB(orderId, file);
      photoIds.push(`order_${orderId}_${file.name}`);
    }

    const order = {
      id: orderId,
      type: "Video Story",
      deliveryMethod: method?.value || "",
      deliveryExtra: extra,
      photoCount: videoFiles.length,
      photos: videoFiles.map(f => f.name), 
      photoIds: photoIds, 
      videoText: document.getElementById("videoText")?.value.trim() || "",
      musicUrl: document.getElementById("musicUrl")?.value.trim() || "",
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      paymentNote: document.getElementById("paymentNote")?.value.trim() || "",
      receiptPhoto: receiptFile ? receiptFile.name : "",
      receiptPhotoId: receiptPhotoId
    };

    orders.push(order);
    
    const orderSize = JSON.stringify(order).length;
    console.log("Order size:", orderSize, "bytes =", (orderSize / 1024).toFixed(2), "KB");
    
    localStorage.setItem("videoOrders", JSON.stringify(orders));
    console.log("✅ Order saved successfully!");
    
  } catch (error) {
    console.error("❌ Save error:", error);
    throw error;
  }
}