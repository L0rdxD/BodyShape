// Lazy Loading для фоновых изображений
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lazy loading инициализирован');
    
    // Функция для загрузки фонового изображения
    function loadBackgroundImage(element, bgUrl) {
        const img = new Image();
        img.onload = function() {
            element.style.backgroundImage = `url('${bgUrl}')`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundPosition = 'center';
            element.style.backgroundRepeat = 'no-repeat';
            element.classList.add('loaded');
            console.log('Загружено изображение:', bgUrl);
        };
        img.onerror = function() {
            console.warn('Не удалось загрузить изображение:', bgUrl);
            element.classList.add('loaded');
        };
        img.src = bgUrl;
        element.removeAttribute('data-bg');
    }
    
    // Проверяем поддержку Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyBackground = entry.target;
                    const bgUrl = lazyBackground.getAttribute('data-bg');
                    
                    if (bgUrl) {
                        loadBackgroundImage(lazyBackground, bgUrl);
                        observer.unobserve(lazyBackground);
                    }
                }
            });
        }, {
            rootMargin: '50px' // Загружаем изображения за 50px до появления в viewport
        });

        // Начинаем наблюдение за всеми элементами с классом lazy-bg
        lazyBackgrounds.forEach(lazyBackground => {
            imageObserver.observe(lazyBackground);
        });
        
        // Загружаем изображения, которые уже видны на экране
        setTimeout(() => {
            lazyBackgrounds.forEach(lazyBackground => {
                const rect = lazyBackground.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const bgUrl = lazyBackground.getAttribute('data-bg');
                    if (bgUrl) {
                        loadBackgroundImage(lazyBackground, bgUrl);
                        imageObserver.unobserve(lazyBackground);
                    }
                }
            });
        }, 100);
    } else {
        // Fallback для браузеров без поддержки Intersection Observer
        const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
        
        function loadBackgroundImages() {
            lazyBackgrounds.forEach(lazyBackground => {
                const bgUrl = lazyBackground.getAttribute('data-bg');
                if (bgUrl) {
                    loadBackgroundImage(lazyBackground, bgUrl);
                }
            });
        }
        
        // Загружаем изображения при прокрутке
        let ticking = false;
        function updateOnScroll() {
            if (!ticking) {
                requestAnimationFrame(loadBackgroundImages);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', updateOnScroll);
        window.addEventListener('resize', updateOnScroll);
        
        // Загружаем изображения сразу для видимых элементов
        loadBackgroundImages();
    }
});

// Оптимизация загрузки изображений с атрибутом loading="lazy"
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Предзагрузка критических изображений
function preloadCriticalImages() {
    const criticalImages = [
        './img/logo.png',
        './img/hero-bg.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Вызываем предзагрузку при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalImages);
} else {
    preloadCriticalImages();
}
