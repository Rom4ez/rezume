document.addEventListener('DOMContentLoaded', () => {
    // --- Логика для вкладок "Ключевые компетенции" ---
    const skills = {
        tech: [
            { icon: 'code', name: 'HTML, CSS, JS (базовый)' },
            { icon: 'layout-grid', name: 'CMS WordPress' },
            { icon: 'wrench', name: 'Радиомонтаж (4 разряд)' },
            { icon: 'cpu', name: 'Сборка и ремонт ПК' },
            { icon: 'receipt', name: 'Ремонт кассового оборудования' },
            { icon: 'server', name: 'ОС: Linux, Ubuntu' },
        ],
        automation: [
            { icon: 'database', name: 'Разработка ПО для учета (аналог 1С)' },
            { icon: 'scan-search', name: 'Внедрение RFID-инвентаризации' },
            { icon: 'shopping-cart', name: 'Управление закупками' },
            { icon: 'users', name: 'Переговоры с поставщиками' },
            { icon: 'file-text', name: 'Работа с ЭДО (Диадок)' },
            { icon: 'trending-up', name: 'Оптимизация бизнес-процессов' },
        ],
        ai: [
            { icon: 'share-2', name: 'Интеграция AI через API' },
            { icon: 'brain-circuit', name: 'Опыт с GPT-4, Gemini, Claude' },
            { icon: 'box', name: 'Опыт с Llama 3.1, DeepSeek' },
            { icon: 'server-cog', name: 'Настройка локальных LLM' },
            { icon: 'bot', name: 'Создание Telegram-ботов с AI' },
            { icon: 'zap', name: 'AI для автоматизации процессов' },
        ]
    };

    function populateSkills() {
        for (const category in skills) {
            const container = document.getElementById(category);
            if (container) {
                // Изменяем разметку для лучшего отображения списка
                container.classList.remove('sm:grid-cols-3');
                container.classList.add('grid-cols-1', 'sm:grid-cols-2', 'gap-y-6');

                const skillItems = skills[category].map(skill => `
                    <div class="flex items-center gap-4">
                        <i data-lucide="${skill.icon}" class="h-7 w-7 text-sky-400 flex-shrink-0"></i>
                        <span class="text-white text-lg">${skill.name}</span>
                    </div>
                `).join('');
                container.innerHTML = skillItems;
            }
        }
    }
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;

            tabButtons.forEach(btn => {
                btn.classList.remove('active-tab', 'border-sky-500', 'text-sky-500');
                btn.classList.add('border-transparent', 'text-gray-400', 'hover:text-white');
            });

            button.classList.add('active-tab', 'border-sky-500', 'text-sky-500');
            button.classList.remove('border-transparent', 'text-gray-400', 'hover:text-white');

            tabContents.forEach(content => {
                if (content.id === tab) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    populateSkills(); // Заполняем навыки при загрузке

    // --- Логика для развернуть/свернуть описание "Обо мне" ---
    const toggleAboutBtn = document.getElementById('toggleAbout');
    const aboutPreview = document.getElementById('aboutPreview');
    const aboutFull = document.getElementById('aboutFull');
    const toggleText = document.getElementById('toggleText');
    const toggleIcon = document.getElementById('toggleIcon');
    
    let isExpanded = false;
    
    if (toggleAboutBtn) {
        toggleAboutBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
                aboutPreview.classList.add('hidden');
                aboutFull.classList.remove('hidden');
                toggleText.textContent = 'Свернуть';
                toggleIcon.classList.add('rotate-180');
            } else {
                aboutPreview.classList.remove('hidden');
                aboutFull.classList.add('hidden');
                toggleText.textContent = 'Читать полностью';
                toggleIcon.classList.remove('rotate-180');
            }
            
            // Пересоздаем иконки после изменения DOM
            lucide.createIcons();
        });
    }

    // --- Логика для анимации timeline и развернуть/свернуть опыт работы ---
    const timeline = document.getElementById('timeline');
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineRunner = document.getElementById('timeline-runner');
    const experienceToggles = document.querySelectorAll('.experience-toggle');

    // Функция для развернуть/свернуть опыт работы
    experienceToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const card = toggle.closest('.card');
            const preview = card.querySelector('.experience-preview');
            const full = card.querySelector('.experience-full');
            const icon = toggle.querySelector('i');
            const text = toggle.childNodes[0];
            
            if (full.classList.contains('hidden')) {
                preview.classList.add('hidden');
                full.classList.remove('hidden');
                text.textContent = 'Свернуть ';
                icon.classList.add('rotate-180');
            } else {
                preview.classList.remove('hidden');
                full.classList.add('hidden');
                text.textContent = 'Подробнее ';
                icon.classList.remove('rotate-180');
            }
            
            // Пересоздаем иконки
            lucide.createIcons();
        });
    });

    // Анимация timeline при скролле (улучшенная версия)
    let ticking = false;
    
    function updateTimelineProgress() {
        if(!timeline || !timelineProgress || !timelineRunner) return;

        const timelineRect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;

        // Находим блок "Настоящее время" - он должен быть конечной точкой анимации
        const allTimelineItems = document.querySelectorAll('.timeline-item');
        let currentTimeBlock = null;
        
        // Поищем блок по тексту "Настоящее время"
        for (const item of allTimelineItems) {
            const heading = item.querySelector('h4');
            if (heading && heading.textContent.includes('Настоящее время')) {
                currentTimeBlock = item;
                break;
            }
        }
        let maxProgressHeight = timeline.offsetHeight;
        
        if (currentTimeBlock) {
            const currentTimeRect = currentTimeBlock.getBoundingClientRect();
            const timelineOffset = timelineRect.top;
            const currentTimeOffset = currentTimeRect.top;
            
            // Вычисляем позицию блока "Настоящее время" относительно начала timeline
            maxProgressHeight = Math.max(0, currentTimeOffset - timelineOffset + 30); // +30px для центрирования над блоком
        }

        if(timelineRect.bottom < -100 || timelineRect.top > windowHeight + 100) {
            timelineRunner.style.opacity = '0';
            timelineRunner.style.transform = 'translateX(-50%) translateY(-50%) scale(0.8)';
            return;
        }

        timelineRunner.style.opacity = '1';
        timelineRunner.style.transform = 'translateX(-50%) translateY(-50%) scale(1)';

        // Корректируем вычисление прогресса скролла:
        let scrollProgress;

        if (timelineRect.top > windowCenter) {
            scrollProgress = 0;
        } else if (timelineRect.bottom < windowCenter) {
            scrollProgress = 1;
        } else {
            // Используем скорректированную высоту до блока "Настоящее время"
            scrollProgress = Math.max(0, Math.min(1, (windowCenter - timelineRect.top) / maxProgressHeight));
        }

        // Расчёт высоты прогресса с ограничением до блока "Настоящее время"
        const progressHeight = Math.min(scrollProgress * maxProgressHeight, maxProgressHeight);

        timelineProgress.style.height = `${progressHeight}px`;
        timelineRunner.style.top = `${progressHeight}px`;

        // Свечение runner
        if(scrollProgress > 0.05 && scrollProgress < 0.95) {
            const glowIntensity = Math.sin(scrollProgress * Math.PI) * 0.8 + 0.2;
            timelineRunner.style.boxShadow = `
                0 0 ${15 * glowIntensity}px rgba(56, 189, 248, 0.8),
                0 0 ${30 * glowIntensity}px rgba(56, 189, 248, 0.4),
                0 0 ${45 * glowIntensity}px rgba(56, 189, 248, 0.2)
            `;
            timelineRunner.style.filter = `brightness(${1 + glowIntensity * 0.3})`;
        } else {
            timelineRunner.style.boxShadow = '0 0 8px rgba(56, 189, 248, 0.3)';
            timelineRunner.style.filter = 'brightness(1)';
        }
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateTimelineProgress);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // Ограничиваем до 60 FPS
        }
    }
    
    // Обновляем timeline при скролле и ресайзе
    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', requestTick);
    
    // Первоначальное обновление
    setTimeout(updateTimelineProgress, 100);

    // --- Логика для AI-ассистента (на основе шаблонов) ---
    const generateBtn = document.getElementById('generateLetterBtn');
    const jobTitleInput = document.getElementById('jobTitleInput');
    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('resultContainer');
    const generatedText = document.getElementById('generatedText');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Массив шаблонных ответов
    const templateResponses = [
        {
            keywords: ['ai', 'нейросети', 'машинное обучение', 'ml', 'искусственный интеллект', 'данные', 'аналитик', 'deepseek', 'gpt', 'llama'],
            response: "Добро пожаловать! Да, определенно могу справиться с этой задачей. У меня есть практический опыт интеграции нейросетей в корпоративные процессы - например, внедрил Deepseek R1 для автоматической обработки заявок в СКБ Контур. Также разработал персональный аналог ChatGPT с поддержкой различных LLM моделей, включая локальный сервер на базе Llama 3.1. Работал с API интеграциями GPT-4, Claude, Gemini и имею опыт создания телеграм-ботов с AI-функционалом."
        },
        {
            keywords: ['автоматизация', 'процессы', 'оптимизация', 'системы', 'рутинные задачи', 'workflow', 'бизнес-процессы'],
            response: "Конечно, справлюсь с такими задачами! Имею более 5 лет опыта в автоматизации бизнес-процессов. В СКБ Контур разработал и внедрил программу-аналог 1С для внутреннего использования, автоматизировал процессы учёта и инвентаризации с помощью собственных скриптов. Внедрил RFID-систему для автоматизации инвентаризации ТМЦ, что значительно ускорило рабочие процессы отдела. Также создал внутренние веб-сервисы для оптимизации различных workflow."
        },
        {
            keywords: ['веб', 'сайт', 'разработка', 'frontend', 'backend', 'wordpress', 'html', 'css', 'javascript', 'php'],
            response: "Да, у меня есть опыт в веб-разработке! С 2020 года работаю фрилансером, создаю интернет-магазины и корпоративные сайты на CMS WordPress. Владею HTML, CSS и базовым JavaScript для кастомизации проектов. Разработал несколько интересных проектов: персональный аналог ChatGPT, сайт для гадания на картах Таро с AI-интеграцией, планировщик грузоперевозок для внутреннего использования компании. Также создаю дизайн сайтов с нуля и пишу инструкции по администрированию для клиентов."
        },
        {
            keywords: ['закупки', 'поставщики', 'переговоры', 'тендер', 'снабжение', 'логистика', 'управление', 'менеджер'],
            response: "Абсолютно! Это одна из моих основных компетенций. Более 5 лет занимаюсь управлением закупками технического оборудования, мебели и офисной техники в СКБ Контур. Имею обширный опыт ведения переговоров с поставщиками, анализа коммерческих предложений и оптимизации затрат. Работаю с системами электронного документооборота (Контур Фокус, Диадок), составляю спецификации на оборудование и контролирую исполнение договоров. Хорошо знаком с принципами логистики и управления поставками."
        },
        {
            keywords: ['техник', 'ремонт', 'компьютер', 'электроника', 'радиомонтаж', 'пайка', 'диагностика', 'оборудование'],
            response: "Да, технические задачи - это моя сильная сторона! Имею 4 разряд монтажника РЭАиП, опыт ремонта компьютерного оборудования и работы с электроникой. Работал специалистом по ремонту кассового оборудования, используя паяльную станцию и измерительные приборы. Занимался диагностикой и ремонтом блоков питания, восстановлением материнских плат. Также имею опыт сборки компьютеров, настройки рабочих мест и работы с различным техническим оборудованием. Работаю с ОС Linux и Ubuntu."
        },
        {
            keywords: ['телеграм', 'telegram', 'бот', 'bot', 'чат-бот', 'мессенджер', 'api'],
            response: "Конечно, разрабатываю телеграм-ботов! У меня есть опыт создания разнообразных ботов с различным функционалом. Разработал телеграм-бота для СКБ Контур - он помогает людям записываться на экскурсии по компании, отвечает на вопросы о компании с помощью обученной нейросети и может переключить пользователя на живого консультанта при необходимости. Также создал полноценный интернет-магазин в виде телеграм-бота для продажи строительных материалов - с каталогом товаров, корзиной, оформлением заказов и интегрированной системой оплаты. Работаю с Telegram Bot API, умею интегрировать AI-функционал и платежные системы."
        }
    ];

    // Универсальный ответ, если не найдено совпадений
    const defaultResponse = "Спасибо за интересную вакансию! Я специалист с разносторонним опытом в IT-сфере, автоматизации бизнес-процессов и интеграции нейросетевых технологий. Имею практический опыт работы в СКБ Контур, где прошел путь от технического специалиста до разработчика цифровых решений. Создаю веб-проекты, автоматизирую процессы и интегрирую AI-технологии в корпоративную среду. Готов применить свои навыки для решения задач вашей компании и принести реальную пользу команде.";

    function showError(message) {
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
        errorModal.classList.add('flex');
    }

    closeModalBtn.addEventListener('click', () => {
        errorModal.classList.add('hidden');
        errorModal.classList.remove('flex');
    });

    function findBestResponse(jobTitle) {
        const normalizedJobTitle = jobTitle.toLowerCase();
        
        // Поиск наилучшего совпадения по ключевым словам
        let bestMatch = null;
        let maxMatches = 0;
        
        templateResponses.forEach(template => {
            let matches = 0;
            template.keywords.forEach(keyword => {
                if (normalizedJobTitle.includes(keyword)) {
                    matches++;
                }
            });
            
            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatch = template;
            }
        });
        
        return bestMatch ? bestMatch.response : defaultResponse;
    }

    async function generateCoverLetter() {
        const jobTitle = jobTitleInput.value.trim();
        if (!jobTitle) {
            showError('Пожалуйста, введите название должности.');
            return;
        }

        loader.style.display = 'flex';
        resultContainer.style.display = 'none';
        generateBtn.disabled = true;

        // Имитируем задержку для реалистичности
        setTimeout(() => {
            const response = findBestResponse(jobTitle);
            generatedText.textContent = response;
            resultContainer.style.display = 'block';
            loader.style.display = 'none';
            generateBtn.disabled = false;
        }, 1500); // 1.5 секунды задержки
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', generateCoverLetter);
    }
    
    // --- Логика для плавной прокрутки ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Инициализация всех иконок ---
    lucide.createIcons();
});
