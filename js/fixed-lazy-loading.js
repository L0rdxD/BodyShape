// Исправленный Lazy Loading для фоновых изображений
console.log('Загрузка lazy loading скрипта...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем lazy loading');
    
    // Функция для загрузки фонового изображения
    function loadBackgroundImage(element, bgUrl) {
        console.log('Загружаем изображение:', bgUrl);
        
        const img = new Image();
        img.onload = function() {
            console.log('✅ Изображение загружено:', bgUrl);
            element.style.backgroundImage = `url('${bgUrl}')`;
            element.classList.add('loaded');
        };
        img.onerror = function() {
            console.error('❌ Ошибка загрузки изображения:', bgUrl);
            element.classList.add('loaded');
        };
        img.src = bgUrl;
        element.removeAttribute('data-bg');
    }
    
    // Находим все элементы с data-bg
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    console.log('Найдено элементов с data-bg:', lazyBackgrounds.length);
    
    if (lazyBackgrounds.length === 0) {
        console.warn('Не найдено элементов с data-bg атрибутом');
        return;
    }
    
    // Проверяем поддержку Intersection Observer
    if ('IntersectionObserver' in window) {
        console.log('Используем Intersection Observer');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyBackground = entry.target;
                    const bgUrl = lazyBackground.getAttribute('data-bg');
                    
                    if (bgUrl) {
                        console.log('Элемент стал видимым, загружаем:', bgUrl);
                        loadBackgroundImage(lazyBackground, bgUrl);
                        observer.unobserve(lazyBackground);
                    }
                }
            });
        }, {
            rootMargin: '100px' // Загружаем изображения за 100px до появления
        });

        // Начинаем наблюдение
        lazyBackgrounds.forEach(lazyBackground => {
            imageObserver.observe(lazyBackground);
        });
        
        // Загружаем видимые изображения сразу
        setTimeout(() => {
            console.log('Проверяем видимые изображения...');
            lazyBackgrounds.forEach(lazyBackground => {
                const rect = lazyBackground.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    const bgUrl = lazyBackground.getAttribute('data-bg');
                    if (bgUrl) {
                        console.log('Загружаем видимое изображение:', bgUrl);
                        loadBackgroundImage(lazyBackground, bgUrl);
                        imageObserver.unobserve(lazyBackground);
                    }
                }
            });
        }, 500);
        
    } else {
        // Fallback - загружаем все изображения сразу
        console.log('Intersection Observer не поддерживается, загружаем все изображения');
        
        lazyBackgrounds.forEach(lazyBackground => {
            const bgUrl = lazyBackground.getAttribute('data-bg');
            if (bgUrl) {
                loadBackgroundImage(lazyBackground, bgUrl);
            }
        });
    }
});

// Дополнительная проверка через 2 секунды
setTimeout(() => {
    const stillLazyElements = document.querySelectorAll('[data-bg]');
    if (stillLazyElements.length > 0) {
        console.warn('Найдены незагруженные изображения, принудительно загружаем...');
        stillLazyElements.forEach(element => {
            const bgUrl = element.getAttribute('data-bg');
            if (bgUrl) {
                element.style.backgroundImage = `url('${bgUrl}')`;
                element.classList.add('loaded');
                element.removeAttribute('data-bg');
                console.log('Принудительно загружено:', bgUrl);
            }
        });
    }
}, 2000);

