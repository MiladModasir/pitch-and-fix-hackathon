document.addEventListener("DOMContentLoaded", () => {
  const form       = document.getElementById("contact-form");
  const nameInput  = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const msgInput   = document.getElementById("message");
  const success    = document.getElementById("form-success");

  function showError(el, msgId) {
    document.getElementById(msgId).classList.remove("hidden");
    el.classList.add("input-error");
  }

  function clearError(el, msgId) {
    document.getElementById(msgId).classList.add("hidden");
    el.classList.remove("input-error");
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    // Name validation
    if (!nameInput.value.trim()) {
      showError(nameInput, "error-name");
      valid = false;
    } else {
      clearError(nameInput, "error-name");
    }

    // Email validation
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, "error-email");
      valid = false;
    } else {
      clearError(emailInput, "error-email");
    }

    // Message validation
    if (!msgInput.value.trim()) {
      showError(msgInput, "error-message");
      valid = false;
    } else {
      clearError(msgInput, "error-message");
    }

    if (!valid) return;

    // All good → show success, reset, then hide after 4s
    success.classList.remove("hidden");
    form.reset();
    setTimeout(() => success.classList.add("hidden"), 4000);
  });
});
