
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("phone");
  const phoneError = document.getElementById("phoneError");
  const form = document.getElementById("contactForm");

  // Применяем маску
  if (phoneInput) {
    Inputmask({
      mask: "+7 (999) 999-99-99",
      showMaskOnHover: false,
      showMaskOnFocus: true
    }).mask(phoneInput);
  }

  // Проверка при отправке формы
  if (form) {
    form.addEventListener("submit", function (event) {
      const phoneValue = phoneInput.value;

      // Проверяем, заполнена ли маска полностью
      // Полный номер должен быть в формате: +7 (XXX) XXX-XX-XX (все X — цифры)
      const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

      if (!phoneRegex.test(phoneValue)) {
        event.preventDefault(); // останавливаем отправку
        phoneError.style.display = "block";
        phoneInput.style.borderColor = "red";
      } else {
        phoneError.style.display = "none";
        phoneInput.style.borderColor = ""; // сброс цвета рамки
        alert("Форма отправлена!"); // для теста
      }
    });
  }

  // Скрыть ошибку при вводе
  phoneInput?.addEventListener("input", function () {
    if (phoneError.style.display === "block") {
      phoneError.style.display = "none";
      phoneInput.style.borderColor = "";
    }
  });
});