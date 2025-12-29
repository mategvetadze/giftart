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

async function getPhotoFromDB(photoId) {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(photoId);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); 
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}




const params = new URLSearchParams(window.location.search);
const from = params.get("from");
let initialized = false;

const state = {
    selectedOption: null,
    selectedStyleText: "",
  };



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



document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.header nav');
  const overlay = document.querySelector('.nav-overlay');

  if (hamburger && nav && overlay) {
    function toggleMenu() {
      hamburger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      overlay.classList.toggle('is-active');
      
      const isOpen = nav.classList.contains('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      hamburger.classList.remove('is-active');
      nav.classList.remove('is-open');
      overlay.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
    
    overlay.addEventListener('click', closeMenu);
    
    document.querySelectorAll('.header nav a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }
 const steps = {
  style: document.getElementById("step-style"),
  opt1: document.getElementById("step-opt1"),
  opt2: document.getElementById("step-opt2"),
  opt3: document.getElementById("step-opt3"),
  opt4: document.getElementById("step-opt4"),
  address: document.getElementById("step-address"), 
  payment: document.getElementById("step-payment"),
};
function validatePaymentStep() {
  const firstName = document.getElementById('firstName');
  const lastName  = document.getElementById('lastName');
  const phone     = document.getElementById('phone');


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
      if (uploadBtn) uploadBtn.style.borderColor = '';
    }, 5000);

    return false;
  }

  return true;
}


  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  const nextFromStyle = document.getElementById("nextFromStyle");
  const optionCards = Array.from(document.querySelectorAll(".option-card"));

  
  const opt2Photo = document.getElementById("opt2Photo");
  const opt2Hint = document.getElementById("opt2Hint");


  const videoPhotos = document.getElementById("videoPhotos");
  const videoPhotosHint = document.getElementById("videoPhotosHint");
  const musicUrl = document.getElementById("musicUrl");


  const peopleCount = document.getElementById("peopleCount");
  const peopleFields = document.getElementById("peopleFields");
  const greetingPhotos = document.getElementById("greetingPhotos");
  const greetingPhotosHint = document.getElementById("greetingPhotosHint");

 
const cityRegion = document.getElementById("cityRegion");


  const address = document.getElementById("address");
  const addressNote = document.getElementById("addressNote");
const paymentNote = document.getElementById("paymentNote");



  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const phone = document.getElementById("phone");
  const copyBtn = document.getElementById("copyBtn");
  const accountNumber = document.getElementById("accountNumber");
  const copyHint = document.getElementById("copyHint");
  const finishBtn = document.getElementById("finishBtn");

 
const modal = document.getElementById("modal");
const modalOk = document.getElementById("modalOk");

modalOk.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  window.location.href = "home.html";
});

 
  function optionUsesDelivery() {
  return state.selectedOption === "3" || state.selectedOption === "4";
}

 function setActiveStep(stepEl) {

  document.querySelectorAll(".order-step").forEach(s => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });

  stepEl.classList.remove("hidden");
  stepEl.classList.add("active");

  toggleDelivery(stepEl.id);
  updateProgress();

  window.scrollTo({ top: 0, behavior: "smooth" });
}



function getTotalSteps() {
  if (from === "video" || from === "greeting") {
    return 2; 
  }
  
  if (state.selectedOption === "3" || state.selectedOption === "4") {
    return 3; 
  }
  return 4;
}

  function getCurrentStepNumber() {
    const active = document.querySelector(".order-step.active");
    const stepNum = Number(active?.dataset?.step || 1);
    
    if (from === "video" || from === "greeting") {
      return stepNum - 1;
    }
    
    return stepNum;
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

  if (opt === "1") {
    const size = document.querySelector('input[name="frameSize"]:checked');
    const type = document.querySelector('input[name="frameType"]:checked');

    if (!size || !type) {
      showError("გთხოვ აირჩიო ჩარჩოს ზომა და ტიპი");
      return false;
    }
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

 if (opt === "2") {
  if (!opt2Photo.files || opt2Photo.files.length !== 1) {
    showError("Please upload a photo.");
    return false;
  }

  const size = document.querySelector('input[name="frameSize"]:checked');
  const type = document.querySelector('input[name="frameType"]:checked');

  if (!size || !type) {
    showError("Please choose frame size and frame type.");
    return false;
  }

  if (size.value === "custom") {
    const textarea = size.closest(".custom-pill").querySelector(".custom-size");
    if (!textarea.value.trim()) {
      showError("Please specify custom frame size.");
      textarea.focus();
      return false;
    }
  }

  if (type.value === "custom") {
    const textarea = type.closest(".custom-pill").querySelector(".custom-size");
    if (!textarea.value.trim()) {
      showError("Please specify custom frame color.");
      textarea.focus();
      return false;
    }
  }

  return true;
}


  if (opt === "3") {
   const realVideoFiles =
  videoFiles && videoFiles.length ? videoFiles :
  Array.from(document.getElementById("videoPhotos").files || []);

if (realVideoFiles.length < 5 || realVideoFiles.length > 7) {
  showError("გთხოვ ატვირთო 5-7 ფოტო");
  return false;
}

    
    const delivery = document.querySelector('input[name="deliveryMethod"]:checked');
    if (!delivery) {
      showError("გთხოვ აირჩიო მიწოდების მეთოდი");
      return false;
    }
    
    if (delivery.value === "gmail") {
      const textarea = delivery.closest(".delivery-card").querySelector(".delivery-extra");
      if (!textarea.value.trim()) {
        showError("გთხოვ შეიყვანო Gmail მისამართი");
        textarea.focus();
        return false;
      }
    }
    
    if (delivery.value === "other") {
  const textarea = delivery.closest(".delivery-card").querySelector(".delivery-extra");
  if (textarea && !textarea.value.trim()) {
    showError("გთხოვ მიუთითო მიწოდების დეტალები");
    textarea.focus();
    return false;
  }
}

    
    return true;
  }

  if (opt === "4") {
    const count = Number(peopleCount.value || 0);
    if (!count) {
      showError("გთხოვ აირჩიო ადამიანების რაოდენობა", "peopleCount");
      return false;
    }

    for (let i = 1; i <= count; i++) {
      if (!document.getElementById(`p_name_${i}`)?.value.trim() ||
          !document.getElementById(`p_surname_${i}`)?.value.trim() ||
          !document.getElementById(`p_age_${i}`)?.value.trim() ||
          !document.getElementById(`p_about_${i}`)?.value.trim()) {
        showError(`გთხოვ შეავსო ყველა ველი ადამიანისთვის #${i}`);
        return false;
      }
    }

    if (greetingFiles.length < 3) {
      showError("გთხოვ ატვირთო მინიმუმ 3 ფოტო");
      return false;
    }
    
    const delivery = document.querySelector('input[name="deliveryMethod"]:checked');
    if (!delivery) {
      showError("გთხოვ აირჩიო მიწოდების მეთოდი");
      return false;
    }
    
    if (delivery.value === "gmail") {
      const textarea = delivery.closest(".delivery-card").querySelector(".delivery-extra");
      if (!textarea.value.trim()) {
        showError("გთხოვ შეიყვანო Gmail მისამართი");
        textarea.focus();
        return false;
      }
    }
    if (delivery.value === "other") {
  const textarea = delivery.closest(".delivery-card").querySelector(".delivery-extra");
  if (textarea && !textarea.value.trim()) {
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
 const card = document.querySelector("#step-address .card");

  card.querySelectorAll(".error-message").forEach(e => e.remove());

  let hasError = false;

  if (!cityRegion.value.trim()) {
    hasError = true;
    cityRegion.style.borderColor = "#c38a62";
  } else {
    cityRegion.style.borderColor = "";
  }

  if (!address.value.trim()) {
    hasError = true;
    address.style.borderColor = "#c38a62";
  } else {
    address.style.borderColor = "";
  }

  if (hasError) {
    const error = document.createElement("div");
    error.className = "error-message show";
    error.textContent = "შეავსე მისამართის ყველა ველი";

    card.insertBefore(error, card.firstChild);

    error.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  return true;
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
      }
    }, 5000);
    
    return false;
  }

  return true;
}

  optionCards.forEach(card => {
    card.addEventListener("click", () => {
      optionCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      state.selectedOption = card.dataset.option;
      state.selectedStyleText = card.dataset.style || "";
      nextFromStyle.disabled = false;
    });
  });
if (from === "photo" || from === "video" || from === "greeting") {
  optionCards.forEach(card => {
    card.style.pointerEvents = "none";
    card.style.opacity = "0.5";
  });
}

  nextFromStyle.addEventListener("click", () => {
    if (!state.selectedOption) return;
    showOptionStep();
  });

  opt2Photo?.addEventListener("change", () => {
    const f = opt2Photo.files?.[0];
    opt2Hint.textContent = f ? `არჩეულია: ${f.name}` : "არაფერი არჩეულია";
  });

  
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
        <label class="field" style="max-width: 200px;">
          <span>ასაკი</span>
          <input id="p_age_${i}" type="number" min="1" />
        </label>
        <label class="field">
          <span>მოკლე აღწერა</span>
          <textarea id="p_about_${i}" rows="3" placeholder="მაგ: რა უყვარს, რა სტილი გინდა..."></textarea>
        </label>
      `;
      peopleFields.appendChild(div);
    }
  });

 document.addEventListener("click", (e) => {
  const back = e.target.closest("[data-back]");
  const next = e.target.closest("[data-next]");

  if (next) {
    const active = document.querySelector(".order-step.active");
    if (!active) return;

    if (
  active === steps.opt1 ||
  active === steps.opt2 ||
  active === steps.opt3 ||
  active === steps.opt4
) {
  if (!validateOptionStep()) {
    showError("გთხოვ, შეავსე ყველა ველი");
    return;
  }

  if (optionUsesDelivery()) {
    setActiveStep(steps.payment);
  } else {
    setActiveStep(steps.address);
  }

  return;
}



   if (active === steps.address) {
  if (!validateAddressStep()) {
    return;
  }

  setActiveStep(steps.payment);
  return;
}

  }




  if (back) {
  const active = document.querySelector(".order-step.active");
  if (!active) return;

if (
  active === steps.opt1 ||
  active === steps.opt2 ||
  active === steps.opt3 ||
  active === steps.opt4
) {
  if (from === "photo" || from === "video" || from === "greeting") {
    window.location.href = "shop.html";
    return;
  }
  setActiveStep(steps.style);
  return;
}



  if (active === steps.address) {
  if (state.selectedOption) {
    showOptionStep();      
  } else {
    setActiveStep(steps.style); 
  }
  return;
}


if (active === steps.payment) {

  if (optionUsesDelivery()) {
    showOptionStep();
    return;
  }

  setActiveStep(steps.address);
  return;
}


}

  
});


  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(accountNumber.value);
      copyHint.textContent = "ანგარიშის ნომერი დაკოპირდა ✅";
      setTimeout(() => (copyHint.textContent = ""), 1800);
    } catch {
      copyHint.textContent = "ვერ დაკოპირდა. ხელით მონიშნე და დაკოპირე.";
    }
  });
 function toggleDelivery(stepId) {
  const delivery = document.getElementById("delivery-section");
  if (!delivery) return;

  if (stepId === "step-opt3") {
    delivery.classList.remove("hidden");
    return;
  }

  if (stepId === "step-opt4") {
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
  if (state.selectedOption === "4" && checkOpt4Ready()) {
    toggleDelivery("step-opt4");
  }
}

const greetingInput = document.getElementById("greetingPhotos");
const greetingPreview = document.getElementById("greetingPhotosPreview");
const greetingHint = document.getElementById("greetingPhotosHint");

let greetingFiles = [];

if (greetingInput) {
  greetingInput.addEventListener("change", () => {
    const files = Array.from(greetingInput.files);
    greetingFiles.push(...files);

    greetingInput.value = ""; 
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

finishBtn?.addEventListener("click", async () => {
  console.log("Finish button clicked");
  

  finishBtn.disabled = true;
  finishBtn.textContent = "იტვირთება..."; 
  
  if (!validatePaymentStep()) {
    console.log("Validation failed");
    finishBtn.disabled = false;
    finishBtn.textContent = "დასრულება";
    return;
  }

  console.log("Validation passed, saving order...");

  try {
    const orderId = Date.now();

    let order = {
      id: orderId,
      option: state.selectedOption,
      date: new Date().toLocaleString(),
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      paymentNote: paymentNote?.value || "",
      receiptPhoto: receiptFile ? receiptFile.name : "",
      receiptPhotoId: null
    };

    if (receiptFile) {
      await savePhotoToDB(orderId, receiptFile);
      order.receiptPhotoId = `order_${orderId}_${receiptFile.name}`;
    }


    if (!optionUsesDelivery()) {
      order.city = cityRegion?.value || "";
      order.address = address?.value || "";
      order.addressNote = addressNote?.value || "";
    }


    if (optionUsesDelivery()) {
      order.deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value || "";
      const deliveryCard = document.querySelector('input[name="deliveryMethod"]:checked')?.closest(".delivery-card");
      order.deliveryExtra = deliveryCard?.querySelector(".delivery-extra")?.value || "";
    }

   if (state.selectedOption === "2" || state.selectedOption === 2) {
  order.type = "Photo Order";
  order.frameSize = document.querySelector('input[name="frameSize"]:checked')?.value || "";
  order.frameType = document.querySelector('input[name="frameType"]:checked')?.value || "";
  
  const sizeCustom = document.querySelector('input[name="frameSize"]:checked')?.closest(".custom-pill")?.querySelector(".custom-size");
  const typeCustom = document.querySelector('input[name="frameType"]:checked')?.closest(".custom-pill")?.querySelector(".custom-size");
  
  order.customSize = sizeCustom?.value || "";
  order.customColor = typeCustom?.value || "";

  if (opt2Photo.files[0]) {
    await savePhotoToDB(orderId, opt2Photo.files[0]);
    order.photos = [opt2Photo.files[0].name]; 
    order.photoIds = [`order_${orderId}_${opt2Photo.files[0].name}`]; 
    order.photoCount = 1;
  }
}

    if (state.selectedOption === "3" || state.selectedOption === 3) {
  order.type = "Video Story";
  order.photoCount = videoFiles.length;
  order.musicUrl = musicUrl?.value || "";
  order.photos = videoFiles.map(f => f.name); 
  order.photoIds = [];

  for (const file of videoFiles) {
    await savePhotoToDB(orderId, file);
    order.photoIds.push(`order_${orderId}_${file.name}`);
  }
}

if (state.selectedOption === "4" || state.selectedOption === 4) {
  order.type = "Greeting Video";
  const count = Number(peopleCount.value);
  order.peopleCount = count;
  order.people = [];

  for (let i = 1; i <= count; i++) {
    order.people.push({
      name: document.getElementById(`p_name_${i}`)?.value || "",
      surname: document.getElementById(`p_surname_${i}`)?.value || "",
      age: document.getElementById(`p_age_${i}`)?.value || "",
      about: document.getElementById(`p_about_${i}`)?.value || ""
    });
  }

  order.photos = greetingFiles.map(f => f.name);
  order.photoIds = [];
  

  for (const file of greetingFiles) {
    await savePhotoToDB(orderId, file);
    order.photoIds.push(`order_${orderId}_${file.name}`);
  }
}

    
    try {
      if (state.selectedOption === "2" || state.selectedOption === 2) {
        let photoOrders = JSON.parse(localStorage.getItem("photoOrders") || "[]");
        photoOrders.push(order);
        localStorage.setItem("photoOrders", JSON.stringify(photoOrders));
        console.log("Photo order saved");
      }

      if (state.selectedOption === "3" || state.selectedOption === 3 ||
          state.selectedOption === "4" || state.selectedOption === 4) {
        let videoOrders = JSON.parse(localStorage.getItem("videoOrders") || "[]");
        videoOrders.push(order);
        localStorage.setItem("videoOrders", JSON.stringify(videoOrders));
        console.log("Video order saved");
      }
    } catch (storageError) {
      if (storageError.name === 'QuotaExceededError') {
        alert('მეხსიერება სავსეა. გთხოვთ წაშალოთ ძველი შეკვეთები.');
        console.error("Storage quota exceeded");
        return;
      }
      throw storageError;
    }

    console.log("Order saved successfully:", order);
    console.log("Showing modal...");
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "flex";
    console.log("Modal should be visible now");
    
  } catch (error) {
    console.error("Error details:", error);
    alert("Error: " + error.message);
    showError("მოხდა შეცდომა შეკვეთის შენახვისას. სცადეთ თავიდან.");
    
    
    finishBtn.disabled = false;
    finishBtn.textContent = "დასრულება";
  }
});
  
 
if (!initialized) {
  if (from === "photo") {
    state.selectedOption = "2";    
    setActiveStep(steps.opt2);
  }
  else if (from === "video") {
    state.selectedOption = "3";
    setActiveStep(steps.opt3);
  } 
  else if (from === "greeting") {
    state.selectedOption = "4";
    setActiveStep(steps.opt4);
  } 
  else {
    setActiveStep(steps.style);
  }

  initialized = true;
}

});

const photoInput = document.getElementById("opt2Photo");
const photoPreview = document.getElementById("photoPreview");
const opt2Hint = document.getElementById("opt2Hint");

if (photoInput) {
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
}
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

const videoInput = document.getElementById("videoPhotos");
const videoHint = document.getElementById("videoPhotosHint");
const videoPreview = document.getElementById("videoPhotosPreview");

let videoFiles = [];

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

  textarea.classList.remove("field-invalid");
  error.classList.add("hidden");

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

  if (selected.value === "other") {
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




