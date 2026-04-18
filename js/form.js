const form = document.querySelector("[data-booking-form]");

if (form) {
  const fields = [...form.querySelectorAll("[data-validate]")];
  const messageField = form.querySelector("#message");
  const counter = form.querySelector("[data-char-counter]");
  const serviceSelect = form.querySelector("#service");
  const modal = document.querySelector("[data-success-modal]");
  const closeModal = document.querySelector("[data-modal-close]");
  const submitButton = form.querySelector('button[type="submit"]');
  const today = new Date().toISOString().split("T")[0];
  const dateField = form.querySelector("#date");
  if (dateField) dateField.min = today;

  const urlParams = new URLSearchParams(window.location.search);
  const selectedService = urlParams.get("service");
  if (selectedService && serviceSelect) serviceSelect.value = decodeURIComponent(selectedService);

  const validators = {
    firstName: (value) => value.trim().length >= 2 || "Minimum 2 caractères.",
    lastName: (value) => value.trim().length >= 2 || "Minimum 2 caractères.",
    phone: (value) => /^0[67]\d{8}$/.test(value.replace(/\s+/g, "")) || "Numéro français mobile attendu.",
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Adresse email invalide.",
    service: (value) => value !== "" || "Sélectionnez une prestation.",
    date: (value) => value >= today || "Choisissez une date future.",
    consent: (_, input) => input.checked || "Le consentement RGPD est requis."
  };

  const setFieldState = (field, result) => {
    const wrapper = field.closest(".form-field") || field.closest(".checkbox-group");
    if (!wrapper) return Boolean(result === true);
    const errorElement = wrapper.querySelector(".error-text");
    wrapper.classList.remove("is-valid", "is-error");
    if (result === true) {
      wrapper.classList.add("is-valid");
      if (errorElement) errorElement.textContent = "";
      return true;
    }
    wrapper.classList.add("is-error");
    if (errorElement) errorElement.textContent = result;
    return false;
  };

  const validateField = (field) => {
    const rule = validators[field.name];
    if (!rule) return true;
    const result = rule(field.value, field);
    return setFieldState(field, result);
  };

  fields.forEach((field) => {
    const wrapper = field.closest(".form-field");
    const syncFloating = () => wrapper?.classList.toggle("is-floating", Boolean(field.value));
    syncFloating();
    field.addEventListener("input", () => {
      syncFloating();
      validateField(field);
    });
    field.addEventListener("change", () => {
      syncFloating();
      validateField(field);
    });
  });

  if (messageField && counter) {
    const syncCount = () => {
      counter.textContent = `${messageField.value.length}/500`;
    };
    syncCount();
    messageField.addEventListener("input", syncCount);
  }

  const hideModal = () => modal?.classList.add("hidden");
  closeModal?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = fields.every((field) => validateField(field));
    if (!isValid) return;

    submitButton.disabled = true;
    const original = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner" aria-hidden="true"></span> Envoi en cours...';

    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = original;
      modal?.classList.remove("hidden");
      form.reset();
      fields.forEach((field) => {
        field.closest(".form-field")?.classList.remove("is-valid", "is-error", "is-floating");
      });
      counter.textContent = "0/500";
    }, 1500);
  });
}
