// Check if coming from gallery
const urlParams = new URLSearchParams(window.location.search);
const fromGallery = urlParams.get('from') === 'gallery';

// Initialize current step
let currentStep = fromGallery ? 3 : 1;

// At the very top, add this:
if (fromGallery) {
  window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('step-style').classList.remove('active');
    document.getElementById('step-style').classList.add('hidden');
    
    document.getElementById('step-address').classList.add('active');
    document.getElementById('step-address').classList.remove('hidden');
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    progressFill.style.width = '50%';
    progressText.textContent = 'ნაბიჯი 1 / 2';
  });
}

// Find where you handle [data-next] clicks and add this:
document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', function() {
    const currentSection = document.querySelector('.order-step.active');
    
    if (currentSection.id === 'step-address' && fromGallery) {
      // Hide address
      currentSection.classList.remove('active');
      currentSection.classList.add('hidden');
      
      // Show payment
      document.getElementById('step-payment').classList.remove('hidden');
      document.getElementById('step-payment').classList.add('active');
      
      // Update progress
      document.getElementById('progressFill').style.width = '100%';
      document.getElementById('progressText').textContent = 'ნაბიჯი 2 / 2';
    }
  });
});

// Check if coming from video in shop
if (urlParams.get('from') === 'video') {
  window.addEventListener('DOMContentLoaded', function() {
    // Hide step 1 (style selection)
    document.getElementById('step-style').classList.remove('active');
    document.getElementById('step-style').classList.add('hidden');
    
    // Show step-opt3 (video ordering)
    document.getElementById('step-opt3').classList.remove('hidden');
    document.getElementById('step-opt3').classList.add('active');
    
    // Show delivery section for videos
    document.getElementById('delivery-section').classList.remove('hidden');
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    progressFill.style.width = '33%';
    progressText.textContent = 'ნაბიჯი 1 / 3';
  });
}


function showError(message, fieldId = null) {
  // Remove old errors
  document.querySelectorAll('.error-message').forEach(e => e.remove());
  document.querySelectorAll('.has-error').forEach(e => e.classList.remove('has-error'));

  // Create error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message show';
  errorDiv.textContent = message;

  if (fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      // Check if field is inside a two-col (name/surname together)
      const twoCol = field.closest('.two-col');
      const fieldContainer = twoCol || field.closest('.field') || field.closest('.card');
      
      if (fieldContainer) {
        // Insert error BEFORE the container
        fieldContainer.parentNode.insertBefore(errorDiv, fieldContainer);
        fieldContainer.classList.add('has-error');
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        field.focus();
      }
    }
  } else {
    // If no field specified, show at top
    const activeStep = document.querySelector('.order-step.active');
    activeStep.insertBefore(errorDiv, activeStep.firstChild);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
    document.querySelectorAll('.has-error').forEach(e => e.classList.remove('has-error'));
  }, 5000);
}



document.addEventListener("DOMContentLoaded", () => {
 const steps = {
  style: document.getElementById("step-style"),
  opt1: document.getElementById("step-opt1"),
  opt2: document.getElementById("step-opt2"),
  opt3: document.getElementById("step-opt3"),
  opt4: document.getElementById("step-opt4"),
  payment: document.getElementById("step-payment"),
};

  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  const nextFromStyle = document.getElementById("nextFromStyle");
  const optionCards = Array.from(document.querySelectorAll(".option-card"));

  // Option 2
  const opt2Photo = document.getElementById("opt2Photo");
  const opt2Hint = document.getElementById("opt2Hint");

  // Option 3
  const videoPhotos = document.getElementById("videoPhotos");
  const videoPhotosHint = document.getElementById("videoPhotosHint");
  const musicUrl = document.getElementById("musicUrl");

  // Option 4
  const peopleCount = document.getElementById("peopleCount");
  const peopleFields = document.getElementById("peopleFields");
  const greetingPhotos = document.getElementById("greetingPhotos");
  const greetingPhotosHint = document.getElementById("greetingPhotosHint");

  // Address
const cityRegion = document.getElementById("cityRegion");


  const address = document.getElementById("address");

  // Payment
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const phone = document.getElementById("phone");
  const copyBtn = document.getElementById("copyBtn");
  const accountNumber = document.getElementById("accountNumber");
  const copyHint = document.getElementById("copyHint");
  const finishBtn = document.getElementById("finishBtn");

  // Modal
  const modal = document.getElementById("modal");
  const modalOk = document.getElementById("modalOk");

  const state = {
    selectedOption: null, // "1" | "2" | "3" | "4"
    selectedStyleText: "",
  };

 function setActiveStep(stepEl) {
  Object.values(steps).forEach(s => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });

  stepEl.classList.remove("hidden");
  stepEl.classList.add("active");

  toggleDelivery(stepEl.id); // ✅ ADD THIS LINE

  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}


  function getTotalSteps() {
    // Step count is always 4:
    // 1 style, 2 option-specific, 3 address, 4 payment
    return 3;
  }

  function getCurrentStepNumber() {
    const active = document.querySelector(".order-step.active");
    return Number(active?.dataset?.step || 1);
  }

  function updateProgress() {
    const cur = getCurrentStepNumber();
    const total = getTotalSteps();
    const pct = Math.round((cur / total) * 100);
    progressFill.style.width = `${pct}%`;
    progressText.textContent = `ნაბიჯი ${cur} / ${total}`;
  }

  function showOptionStep() {
    if (state.selectedOption === "1") setActiveStep(steps.opt1);
    if (state.selectedOption === "2") setActiveStep(steps.opt2);
    if (state.selectedOption === "3") setActiveStep(steps.opt3);
    if (state.selectedOption === "4") setActiveStep(steps.opt4);
  }

  function validateOptionStep() {
  const opt = state.selectedOption;

  // OPTION 1
  if (opt === "1") {
    const size = document.querySelector('input[name="frameSize"]:checked');
    const type = document.querySelector('input[name="frameType"]:checked');

    if (!size || !type) {
      showError("გთხოვ აირჩიო ჩარჩოს ზომა და ტიპი");
      return false;
    }

    // Check custom fields
    if (type.value === "custom") {
      const textarea = type.closest(".custom-pill").querySelector(".custom-size");
      if (!textarea || !textarea.value.trim()) {
        showError("გთხოვ მიუთითო სასურველი ფერი", "frameType");
        textarea.focus();
        return false;
      }
    }

    if (size.value === "custom") {
      const textarea = size.closest(".custom-pill").querySelector(".custom-size");
      if (!textarea || !textarea.value.trim()) {
        showError("გთხოვ მიუთითო სასურველი ზომა", "frameSize");
        textarea.focus();
        return false;
      }
    }

    return true;
  }

  // OPTION 2
  if (opt === "2") {
    if (!opt2Photo.files || opt2Photo.files.length !== 1) {
      showError("გთხოვ ატვირთო ფოტო");
      return false;
    }
    return true;
  }

  // OPTION 3 (VIDEO)
  if (opt === "3") {
    if (videoFiles.length < 5 || videoFiles.length > 7) {
      showError("გთხოვ ატვირთო 5-7 ფოტო");
      return false;
    }
    
    // ✅ Check delivery selection
    const delivery = document.querySelector('input[name="deliveryMethod"]:checked');
    if (!delivery) {
      showError("გთხოვ აირჩიო მიწოდების მეთოდი");
      return false;
    }
    
    // ✅ Check Gmail field if Gmail selected
    if (delivery.value === "gmail") {
      const textarea = delivery.closest(".delivery-card").querySelector(".delivery-extra");
      if (!textarea.value.trim()) {
        showError("გთხოვ შეიყვანო Gmail მისამართი");
        textarea.focus();
        return false;
      }
    }
    
    // ✅ Check "other" field if other selected
    if (delivery.value === "other") {
      const textarea = delivery.closest(".delivery-card").querySelector(".delivery-extra");
      if (!textarea.value.trim()) {
        showError("გთხოვ მიუთითო მიწოდების დეტალები");
        textarea.focus();
        return false;
      }
    }
    
    return true;
  }

  // OPTION 4 (GREETING)
  if (opt === "4") {
    const count = Number(peopleCount.value || 0);
    if (!count) {
      showError("გთხოვ აირჩიო ადამიანების რაოდენობა", "peopleCount");
      return false;
    }

    // Check all people fields
    for (let i = 1; i <= count; i++) {
      if (!document.getElementById(`p_name_${i}`)?.value.trim() ||
          !document.getElementById(`p_surname_${i}`)?.value.trim() ||
          !document.getElementById(`p_age_${i}`)?.value.trim() ||
          !document.getElementById(`p_about_${i}`)?.value.trim()) {
        showError(`გთხოვ შეავსო ყველა ველი ადამიანისთვის #${i}`);
        return false;
      }
    }

    // Check photos
    if (greetingFiles.length < 3) {
      showError("გთხოვ ატვირთო მინიმუმ 3 ფოტო");
      return false;
    }
    
    // ✅ Check delivery selection
    const delivery = document.querySelector('input[name="deliveryMethod"]:checked');
    if (!delivery) {
      showError("გთხოვ აირჩიო მიწოდების მეთოდი");
      return false;
    }
    
    // ✅ Check Gmail field if Gmail selected
    if (delivery.value === "gmail") {
      const textarea = delivery.closest(".delivery-card").querySelector(".delivery-extra");
      if (!textarea.value.trim()) {
        showError("გთხოვ შეიყვანო Gmail მისამართი");
        textarea.focus();
        return false;
      }
    }
    
    // ✅ Check "other" field if other selected
    if (delivery.value === "other") {
      const textarea = delivery.closest(".delivery-card").querySelector(".delivery-extra");
      if (!textarea.value.trim()) {
        showError("გთხოვ მიუთითო მიწოდების დეტალები");
        textarea.focus();
        return false;
      }
    }
    
    return true;
  }

  return true;
}
if (!receiptFile) {
  document.querySelector(".upload-btn").classList.add("required");
} else {
  document.querySelector(".upload-btn").classList.remove("required");
}


  function validateAddressStep() {
     return cityRegion.value.trim() && address.value.trim();
  }

 

  function validatePaymentStep() {
  // Check name, surname, phone first
  if (!firstName.value.trim() || !lastName.value.trim() || !phone.value.trim()) {
    showError("გთხოვ შეავსო სახელი/გვარი და ტელეფონის ნომერი.", "lastName");
    return false;
  }

  // Then check receipt separately
  if (!receiptFile) {
    // Remove old errors
    document.querySelectorAll('.error-message').forEach(e => e.remove());
    
    // Create error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = 'გთხოვ ატვირთო გადახდის ქვითარი 📄';
    
    // Find the phone input's parent card and insert after phone field
    const phoneField = document.getElementById('phone');
    const phoneContainer = phoneField.closest('.field');
    
    if (phoneContainer) {
      // Insert error after the phone field
      phoneContainer.parentNode.insertBefore(errorDiv, phoneContainer.nextSibling);
      errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Highlight upload button
    const uploadBtn = document.querySelector('#step-payment .upload-btn');
    if (uploadBtn) {
      uploadBtn.style.borderColor = '#c38a62';
    }
    
    // Auto-hide after 5 seconds
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


  // ===== Step 1 (choose) =====
  optionCards.forEach(card => {
    card.addEventListener("click", () => {
      optionCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      state.selectedOption = card.dataset.option;
      state.selectedStyleText = card.dataset.style || "";
      nextFromStyle.disabled = false;
    });
  });

  nextFromStyle.addEventListener("click", () => {
    if (!state.selectedOption) return;
    showOptionStep();
  });

  // ===== Option 2 photo hint =====
  opt2Photo?.addEventListener("change", () => {
    const f = opt2Photo.files?.[0];
    opt2Hint.textContent = f ? `არჩეულია: ${f.name}` : "არაფერი არჩეულია";
  });

  

  // ===== Option 4 people fields =====
  peopleCount?.addEventListener("change", () => {
    const count = Number(peopleCount.value || 0);
    peopleFields.innerHTML = "";

    if (!count) return;

    for (let i = 1; i <= count; i++) {
      const div = document.createElement("div");
      div.className = "person-card";
      div.innerHTML = `
        <h4> #${i}</h4>
        <div class="two-col">
          <label class="field">
            <span>სახელი</span>
            <input id="p_name_${i}" type="text" />
          </label>
          <label class="field">
            <span>გვარი</span>
            <input id="p_surname_${i}" type="text" />
          </label>
        </div>
        <div class="two-col">
          <label class="field">
            <span>ასაკი</span>
            <input id="p_age_${i}" type="number" min="1" />
          </label>
          <div></div>
        </div>
        <label class="field">
          <span>მოკლე აღწერა</span>
          <textarea id="p_about_${i}" rows="3" placeholder="მაგ: რა უყვარს, რა სტილი გინდა..."></textarea>
        </label>
      `;
      peopleFields.appendChild(div);
    }
  });



  // ===== Back / Next buttons (generic) =====
  document.addEventListener("click", (e) => {
    const back = e.target.closest("[data-back]");
    const next = e.target.closest("[data-next]");
if (back) {
  const active = document.querySelector(".order-step.active");
  if (!active) return;

  if (active === steps.opt1 || active === steps.opt2 || active === steps.opt3 || active === steps.opt4) {
    setActiveStep(steps.style);
    return;
  }
  if (active === steps.payment) {
    showOptionStep();  // ✅ Go back to option step
    return;
  }
}

if (next) {
  const active = document.querySelector(".order-step.active");
  if (!active) return;

  if (active === steps.opt1 || active === steps.opt2 || active === steps.opt3 || active === steps.opt4) {
    if (!validateOptionStep()) {
      showError("გთხოვ, შეავსო/აირჩიო ყველა საჭირო ველი ამ ნაბიჯზე.");
      return;
    }
    setActiveStep(steps.payment);  // ✅ Go directly to payment
    return;
  }
}
  });

  // ===== Copy account number =====
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(accountNumber.value);
      copyHint.textContent = "ანგარიშის ნომერი დაკოპირდა ✅";
      setTimeout(() => (copyHint.textContent = ""), 1800);
    } catch {
      copyHint.textContent = "ვერ დაკოპირდა. ხელით მონიშნე და დაკოპირე.";
    }
  });

  // ===== Finish =====
  finishBtn?.addEventListener("click", () => {
    if (!validatePaymentStep()) {
      return; // Error already shown in validatePaymentStep
    }

    // Here you can send data to backend later (fetch/POST).
    // For now: show confirmation modal.
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  });

  modalOk?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    window.location.href = "home.html";
  });

  // Start
  setActiveStep(steps.style);
});



const photoInput = document.getElementById("opt2Photo");
const photoPreview = document.getElementById("photoPreview");
const opt2Hint = document.getElementById("opt2Hint");

photoInput.addEventListener("change", () => {
  photoPreview.innerHTML = "";

  const file = photoInput.files[0];
  if (!file) {
    opt2Hint.textContent = "არაფერი არჩეულია";
    return;
  }

  opt2Hint.textContent = file.name;

  const reader = new FileReader();
  reader.onload = e => {
    const div = document.createElement("div");
    div.className = "preview-item";

    div.innerHTML = `
      <img src="${e.target.result}">
      <button type="button">×</button>
    `;

    div.querySelector("button").onclick = () => {
      photoInput.value = "";
      photoPreview.innerHTML = "";
      opt2Hint.textContent = "არაფერი არჩეულია";
    };

    photoPreview.appendChild(div);
  };

  reader.readAsDataURL(file);
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

    receiptFile = file; // ✅ STORE RECEIPT
    receiptHint.textContent = file.name;

    const wrapper = document.createElement("div");
    wrapper.className = "preview-item";

    // ✅ IMAGE PREVIEW
    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      wrapper.appendChild(img);
    }

    // ✅ PDF PREVIEW (ICON)
    if (file.type === "application/pdf") {
      const pdfLabel = document.createElement("div");
      pdfLabel.textContent = "📄 PDF ქვითარი";
      pdfLabel.style.fontSize = "14px";
      pdfLabel.style.color = "#6a4a3a";
      wrapper.appendChild(pdfLabel);
    }

    // ❌ REMOVE BUTTON
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "×";

    removeBtn.onclick = () => {
      receiptInput.value = "";
      receiptFile = null; // ❌ RESET
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

let videoFiles = [];

if (videoInput) {
  videoInput.addEventListener("change", () => {
    const selectedFiles = Array.from(videoInput.files);

    // max 7 validation
    if (videoFiles.length + selectedFiles.length > 7) {
      alert("შეგიძლიათ მაქსიმუმ 7 ფოტო ატვირთოთ");
      videoInput.value = "";
      return;
    }

    selectedFiles.forEach(file => {
      videoFiles.push(file);
    });

    videoInput.value = ""; // reset input
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

  // ✅ COUNTER (THIS WAS MISSING / WRONG BEFORE)
  videoHint.textContent = `${videoFiles.length} ფოტო არჩეულია`;

  // min validation message
  if (videoFiles.length < 5) {
    videoHint.textContent += " (მინ 5 საჭიროა)";
  }
}

const deliveryRadios = document.querySelectorAll(
  'input[name="deliveryMethod"]'
);

const deliveryExtra = document.getElementById("deliveryExtra");
const deliveryExtraLabel = document.getElementById("deliveryExtraLabel");
const deliveryExtraInput = document.getElementById("deliveryExtraInput");

deliveryRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    deliveryExtra.classList.remove("hidden");

    if (radio.value === "gmail") {
      deliveryExtraLabel.textContent = "მიუთითეთ Gmail მისამართი";
      deliveryExtraInput.placeholder = "example@gmail.com";
    } else {
      deliveryExtraLabel.textContent =
        "მიუთითეთ მიწოდების დეტალები";
      deliveryExtraInput.placeholder =
        "მაგ: Dropbox ბმული, ონლაინ პლატფორმა, სხვა მოთხოვნა…";
    }
  });
});



const greetingInput = document.getElementById("greetingPhotos");
const greetingPreview = document.getElementById("greetingPhotosPreview");
const greetingHint = document.getElementById("greetingPhotosHint");

let greetingFiles = [];

if (greetingInput) {
  greetingInput.addEventListener("change", () => {
    const files = Array.from(greetingInput.files);
    greetingFiles.push(...files);

    greetingInput.value = ""; // reset input
    updateGreetingPreview();
  });
}

function updateGreetingPreview() {
  greetingPreview.innerHTML = "";

  greetingFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "preview-item";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "×";

    removeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      greetingFiles.splice(index, 1);
      updateGreetingPreview();
    };

    item.appendChild(img);
    item.appendChild(removeBtn);
    greetingPreview.appendChild(item);
  });

  greetingHint.textContent = `${greetingFiles.length} ფოტო არჩეულია`;
  if (greetingFiles.length < 3) {
    greetingHint.textContent += " (მინ 3 საჭიროა)";
  }
  maybeShowOpt4Delivery();

}






function validateDelivery() {
  const selected = document.querySelector(
    'input[name="deliveryMethod"]:checked'
  );

  if (!selected) return true;

  if (selected.value === "gmail") {
    const textarea = selected
      .closest(".delivery-card")
      .querySelector(".delivery-extra");

    if (!textarea.value.trim()) {
      textarea.focus();
      textarea.style.borderColor = "#e24c4c";
      return false;
    } else {
      textarea.style.borderColor = "#e6ddd5";
    }
  }

  return true;
}



function showDeliveryIfNeeded(option) {
  const deliverySection = document.getElementById("delivery-section");
  if (!deliverySection) return;

  if (option === "3" || option === "4") {
    deliverySection.classList.remove("hidden");
  } else {
    deliverySection.classList.add("hidden");

    // reset delivery selection
    document
      .querySelectorAll('input[name="deliveryMethod"]')
      .forEach(r => (r.checked = false));

    document
      .querySelectorAll(".delivery-extra")
      .forEach(t => (t.value = ""));
  }
}

function validateDeliveryForOption(option) {
  if (option !== "3" && option !== "4") return true;

  const selected = document.querySelector(
    'input[name="deliveryMethod"]:checked'
  );

  if (!selected) return false;

  const textarea = selected
    .closest(".delivery-card")
    .querySelector(".delivery-extra");

  const error = document.getElementById("deliveryExtraError");

  // reset
  textarea.classList.remove("field-invalid");
  error.classList.add("hidden");

  // GMAIL
  if (selected.value === "gmail") {
    const email = textarea.value.trim();

    if (!email) {
      textarea.classList.add("field-invalid");
      error.textContent = "Gmail მისამართი სავალდებულოა";
      error.classList.remove("hidden");
      textarea.focus();
      return false;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      textarea.classList.add("field-invalid");
      error.textContent = "მიუთითეთ ვალიდური Gmail მისამართი";
      error.classList.remove("hidden");
      textarea.focus();
      return false;
    }
  }

  // OTHER
  if (selected.value === "disk") {
    if (!textarea.value.trim()) {
      textarea.classList.add("field-invalid");
      error.textContent = "ეს ველი სავალდებულოა";
      error.classList.remove("hidden");
      textarea.focus();
      return false;
    }
  }

  return true;
}



function toggleDelivery(stepId) {
  const delivery = document.getElementById("delivery-section");
  if (!delivery) return;

  if (stepId === "step-opt3") {
    delivery.classList.remove("hidden");
    return;
  }

  if (stepId === "step-opt4") {
    // only show delivery when opt4 content is ready
    if (checkOpt4Ready()) {
      delivery.classList.remove("hidden");
    } else {
      delivery.classList.add("hidden");
    }
    return;
  }

  delivery.classList.add("hidden");
}


function checkOpt4Ready() {
  const count = Number(peopleCount.value || 0);
  if (!count) return false;

  for (let i = 1; i <= count; i++) {
    if (
      !document.getElementById(`p_name_${i}`)?.value.trim() ||
      !document.getElementById(`p_surname_${i}`)?.value.trim() ||
      !document.getElementById(`p_age_${i}`)?.value.trim() ||
      !document.getElementById(`p_about_${i}`)?.value.trim()
    ) return false;
  }

  return greetingFiles.length >= 3;
}

function maybeShowOpt4Delivery() {
  // Remove this function - not needed anymore
}

// Remove this line:
// peopleCount.addEventListener("change", maybeShowOpt4Delivery);

function maybeShowOpt4Delivery() {
  if (state.selectedOption === "4" && checkOpt4Ready()) {
    toggleDelivery("step-opt4");
  }
}

peopleCount.addEventListener("change", maybeShowOpt4Delivery);


