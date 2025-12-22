let videoFiles = [];
let receiptFile=null;
document.addEventListener("DOMContentLoaded", () => {
    

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
  showError("გთხოვ აირჩიო მიწოდების მეთოდი", "#step-delivery .delivery-methods");
  return false;
}


  const card = method.closest(".delivery-card");
  const extra = card.querySelector(".delivery-extra");

 if (method.value === "gmail") {
  if (!extra || !extra.value.trim()) {
    showError("გთხოვ მიუთითო Gmail მისამართი", ".delivery-card.gmail");
    return false;
  }

    if (!extra.value.trim().toLowerCase().endsWith("@gmail.com")) {
      showError("გთხოვ შეიყვანე სწორი Gmail მისამართი (@gmail.com)");
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

  const first = document.getElementById("firstName");
  const last = document.getElementById("lastName");
  const phone = document.getElementById("phone");

  if (!first.value.trim()) {
    showError("გთხოვ მიუთითო სახელი");
    first.focus();
    return false;
  }

  if (!last.value.trim()) {
    showError("გთხოვ მიუთითო გვარი");
    last.focus();
    return false;
  }

  if (!phone.value.trim()) {
    showError("გთხოვ მიუთითო ტელეფონი");
    phone.focus();
    return false;
  }

  if (!receiptFile) {
    showError("გთხოვ ატვირთო გადახდის ქვითარი");
    return false;
  }

  return true;
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



});

setTimeout(() => {
  const finishBtn = document.getElementById("finishBtn");
  const modal = document.getElementById("modal");
  const modalOk = document.getElementById("modalOk");

  console.log("Finish button found:", finishBtn);

  if (finishBtn) {
    finishBtn.onclick = async () => {
      console.log("Finish button clicked!");

      const first = document.getElementById("firstName");
      const last = document.getElementById("lastName");
      const phone = document.getElementById("phone");

      if (!first?.value.trim() || !last?.value.trim() || !phone?.value.trim()) {
        alert("გთხოვ შეავსო ყველა ველი");
        return;
      }

      if (!receiptFile) {
        alert("გთხოვ ატვირთო ქვითარი");
        return;
      }

      try {
        console.log("Saving order...");
        await saveVideoOrder();
        console.log("Order saved!");
        
        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
      } catch (error) {
        console.error("Error:", error);
        alert("შეცდომა!");
      }
    };
  }

  if (modalOk) {
    modalOk.onclick = () => {
      modal.classList.add("hidden");
      window.location.href = "home.html";
    };
  }
}, 500);
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


  function validatePaymentStep() {
  if (!firstName.value.trim() || !lastName.value.trim() || !phone.value.trim()) {
    showError("გთხოვ შეავსო სახელი/გვარი და ტელეფონის ნომერი.", "lastName");
    return false;
  }

  if (!receiptFile) {
    document.querySelectorAll('.error-message').forEach(e => e.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = 'გთხოვ ატვირთო გადახდის ქვითარი 📄';
    
    const phoneField = document.getElementById('phone');
    const phoneContainer = phoneField.closest('.field');
    
    if (phoneContainer) {
      phoneContainer.parentNode.insertBefore(errorDiv, phoneContainer.nextSibling);
      errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    const uploadBtn = document.querySelector('#step-payment .upload-btn');
    if (uploadBtn) {
      uploadBtn.style.borderColor = '#c38a62';
    }
    
    setTimeout(() => {
      errorDiv.remove();
      if (uploadBtn) {
        uploadBtn.style.borderColor = '';
        uploadBtn.style.background = '';
      }
    }, 5000);
    
    return false;
  }

  return true;
}

// Helper function to convert File to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// SAVE VIDEO ORDER TO LOCALSTORAGE
async function saveVideoOrder() {
  console.log("saveVideoOrder called!");
  
  const orders = JSON.parse(localStorage.getItem("videoOrders") || "[]");

  const method = document.querySelector('input[name="deliveryMethod"]:checked');
  const extra = method?.closest(".delivery-card")?.querySelector(".delivery-extra")?.value || "";

  const receiptBase64 = receiptFile ? await fileToBase64(receiptFile) : null;
  const photoPromises = videoFiles.map(file => fileToBase64(file));
  const photosBase64 = await Promise.all(photoPromises);

  const order = {
    id: Date.now(),
    type: "Video Story",
    deliveryMethod: method?.value || "",
    deliveryExtra: extra,
    photoCount: videoFiles.length,
    photos: photosBase64,
    videoText: document.getElementById("videoText")?.value.trim() || "",
    musicUrl: document.getElementById("musicUrl")?.value.trim() || "",
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    paymentNote: document.getElementById("paymentNote")?.value.trim() || "",
    receiptPhoto: receiptBase64
  };

  orders.push(order);
  localStorage.setItem("videoOrders", JSON.stringify(orders));
  console.log("Order saved successfully!");
}