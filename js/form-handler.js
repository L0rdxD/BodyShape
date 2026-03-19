// Обработчик отправки формы контактов
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!contactForm) {
        return;
    }
    
    // Обработчик отправки формы
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Предотвращаем стандартную отправку формы
        
        // Получаем кнопку отправки
        const submitButton = contactForm.querySelector('.contact-form__submit');
        const originalButtonText = submitButton.textContent;
        
        // Отключаем кнопку и показываем процесс отправки
        submitButton.disabled = true;
        submitButton.textContent = 'ОТПРАВКА...';
        formMessage.style.display = 'none';
        formMessage.className = 'contact-form__message';
        
        // Собираем данные формы
        const formData = new FormData(contactForm);
        
        // Отправляем AJAX запрос
        fetch('process_form.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Восстанавливаем кнопку
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // Показываем сообщение
            formMessage.style.display = 'block';
            
            if (data.success) {
                // Успешная отправка
                formMessage.className = 'contact-form__message contact-form__message--success';
                formMessage.textContent = data.message;
                // Очищаем форму
                contactForm.reset();
            } else {
                // Ошибки валидации
                formMessage.className = 'contact-form__message contact-form__message--error';
                if (data.errors && Array.isArray(data.errors)) {
                    formMessage.textContent = data.errors.join('\n');
                } else {
                    formMessage.textContent = 'Произошла ошибка при отправке формы.';
                }
            }
            
            // Прокручиваем к сообщению
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        })
        .catch(error => {
            // Ошибка сети или сервера
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            formMessage.style.display = 'block';
            formMessage.className = 'contact-form__message contact-form__message--error';
            formMessage.textContent = 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.';
            console.error('Ошибка:', error);
        });
    });
});

