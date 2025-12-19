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

  finishBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) return;

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  });

  modalOk.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    window.location.href = "home.html";
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
