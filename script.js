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

    // Расширенная база шаблонных ответов
    const templateResponses = [
        // === ОПЫТ РАБОТЫ ===
        {
            keywords: ['опыт', 'работа', 'карьера', 'компания', 'контур', 'работал', 'должность'],
            response: "У меня 5+ лет опыта в IT-сфере. Основное место работы - АО 'ПФ 'СКБ Контур' (с 2019 года), где прошёл путь от специалиста по ремонту до Ведущего менеджера по учёту. Параллельно с 2020 года занимаюсь веб-разработкой на фрилансе. Также работал монтажником РЭАиП по ГПХ (2021-2025)."
        },
        {
            keywords: ['контур', 'скб', 'компания', 'организация', 'где работал'],
            response: "Основное место работы - АО 'ПФ 'СКБ Контур' (с сентября 2019 года). Начинал с практики в 2017 году, затем работал в Контур НТТ. В основной компании прошёл путь от технических должностей до менеджмента и автоматизации. Сейчас работаю в отделе УОФ (Управление Общими Функциями) на должности Ведущий менеджер по учёту."
        },

        // === ОБРАЗОВАНИЕ ===
        {
            keywords: ['образование', 'учился', 'закончил', 'университет', 'колледж', 'ргппу', 'педагог', 'диплом'],
            response: "У меня два образования: среднее специальное в Уральском политехническом колледже (2014-2018) по специальности 'Компьютерные системы и комплексы', и высшее в РГППУ (2018-2021) - 'Педагог профессионального образования'. В колледже изучал C++, C#, Python, работал с электроникой. В университете получил практический опыт преподавания. Для дипломной работы создал онлайн-сервис для обучения тестировщиков в формате игры."
        },

        // === AI И НЕЙРОСЕТИ ===
        {
            keywords: ['ai', 'нейросети', 'машинное обучение', 'ml', 'искусственный интеллект', 'данные', 'deepseek', 'gpt', 'llama', 'claude', 'gemini'],
            response: "Отлично! У меня есть реальный практический опыт с AI: внедрил Deepseek R1 в корпоративные процессы для автоматической обработки заявок. Работаю с API различных моделей: GPT-4, Claude, Gemini, Llama. Создал персональный аналог ChatGPT, запускал собственный сервер на Llama 3.1. Интегрировал AI в веб-проекты (например, сайт таро-гаданий) и создал телеграм-ботов с AI-функционалом."
        },

        // === АВТОМАТИЗАЦИЯ ===
        {
            keywords: ['автоматизация', 'процессы', 'оптимизация', 'системы', 'рутинные', 'workflow', 'бизнес-процессы', 'rfid', 'скрипты'],
            response: "Автоматизация - моя сильная сторона! Разработал и внедрил программу-аналог 1С для внутреннего использования. Внедрил RFID-систему для автоматизации инвентаризации ТМЦ, что ускорило рабочие процессы в несколько раз. Написал много скриптов для автоматизации рутинных задач. Создал внутренние сайты для публикации б/у мебели, планировщик маршрутов для грузоперевозок. Оптимизировал многие бизнес-процессы в отделе УОФ."
        },

        // === ВЕБ-РАЗРАБОТКА ===
        {
            keywords: ['веб', 'сайт', 'разработка', 'frontend', 'backend', 'wordpress', 'html', 'css', 'javascript', 'php', 'магазин', 'сайтов'],
            response: "Отлично! С 2020 года работаю веб-разработчиком. Реализовал большое количество проектов для клиентов: от простых лендингов до полноценных интернет-магазинов на WordPress. Владею HTML, CSS, JavaScript (базовый уровень). Особенно хорошо получается интеграция AI в веб-проекты - создал сайт с таро-гаданием, персональный ChatGPT. Внутри Контура создал планировщик грузоперевозок, сайт по ремонту часов с системой отслеживания заказов."
        },

        // === ЗАКУПКИ И ЛОГИСТИКА ===
        {
            keywords: ['закупки', 'поставщики', 'переговоры', 'тендер', 'снабжение', 'логистика', 'управление', 'менеджер', 'тмц'],
            response: "Отлично! Это одна из моих ключевых компетенций. Более 5 лет опыта управления закупками в СКБ Контур: техническое оборудование, мебель, офисная техника. Обширный опыт ведения переговоров с поставщиками, анализа коммерческих предложений и оптимизации затрат. Работаю с электронным документооборотом (Контур Фокус, Диадок). Умею составлять спецификации на оборудование и контролировать исполнение договоров."
        },

        // === ТЕХНИЧЕСКИЕ НАВЫКИ ===
        {
            keywords: ['техник', 'ремонт', 'компьютер', 'электроника', 'радиомонтаж', 'пайка', 'диагностика', 'оборудование', 'кассы', 'рэаип'],
            response: "Да, техническая сторона - моя база! Имею 4 разряд монтажника РЭАиП. Опыт ремонта компьютерного оборудования, кассовых аппаратов. Работал с паяльной станцией, измерительными приборами. Опыт диагностики и ремонта блоков питания, материнских плат. Одно время работал на заводе 'Вектор' мастером вычислительного центра. Умею собирать ПК с нуля, настраивать рабочие места. Работаю с Linux и Ubuntu."
        },

        // === ТЕЛЕГРАМ-БОТЫ ===
        {
            keywords: ['телеграм', 'telegram', 'бот', 'bot', 'чат-бот', 'мессенджер', 'api', 'магазин', 'экскурсии'],
            response: "Отлично! У меня хороший опыт разработки телеграм-ботов. Создал бота для СКБ Контур - он помогает людям записываться на экскурсии, отвечает на вопросы о компании через нейросеть, может переключать на ливого консультанта. Также сделал полноценный интернет-магазин в Telegram для продажи строительных материалов - с каталогом, корзиной, оформлением заказов и платежной системой. Работаю с Telegram Bot API, умею интегрировать AI и платёжи."
        },

        // === ПРОЕКТЫ ===
        {
            keywords: ['проект', 'портфолио', 'работ', 'chatgpt', 'таро', 'планировщик', 'часы', 'показать'],
            response: "Отлично! У меня есть несколько интересных проектов: персональный аналог ChatGPT с поддержкой многих LLM-моделей, сайт для гадания на картах Таро с AI-интеграцией (DeepSeek), планировщик грузоперевозок для Контура с отслеживанием в реальном времени, сайт по ремонту часов с системой поиска заказов по номеру. Плюс много коммерческих сайтов для клиентов. Можно посмотреть в портфолио на сайте."
        },

        // === НАВЫКИ ===
        {
            keywords: ['навыки', 'умеет', 'знает', 'может', 'способности', 'компетенции', 'технологии'],
            response: "Мои ключевые навыки: AI-интеграции (GPT-4, Claude, Gemini, Llama, DeepSeek), автоматизация бизнес-процессов, веб-разработка (HTML/CSS/JS, WordPress), управление закупками, технический ремонт (радиомонтаж, ПК), RFID-системы, Linux/Ubuntu, Telegram Bot API, работа с электронным документооборотом. Особенно сильны в создании комплексных решений, которые объединяют техническую экспертизу, автоматизацию и AI."
        },

        // === ВОЗРАСТ И ЛИЧНОЕ ===
        {
            keywords: ['возраст', 'сколько лет', 'родился', 'год рождения', 'молодой', 'семья', 'хобби'],
            response: "Мне 28 лет (родился в 1996 году). По личностным качествам - ответственный, люблю изучать новые технологии, спокойно работаю как в команде, так и самостоятельно. Настроен на долгосрочную работу и профессиональное развитие. Особенно интересны проекты, где можно применять современные технологии для решения реальных бизнес-задач."
        },

        // === КОНТАКТЫ ===
        {
            keywords: ['контакт', 'телефон', 'почта', 'email', 'связаться', 'написать', 'позвонить'],
            response: "Мои контакты: телефон 8 (912) 629-44-16, email romap41@yandex.ru. Можно написать в Telegram @Romashka_mordashka или VKontakte. Готов обсудить любые проекты и возможности сотрудничества. Обычно отвечаю быстро."
        }
    ];

    // Краткая сводка о резюме для fallback-ответа
    const defaultResponse = "Извините, в данном резюме нет специфической информации по этому вопросу. \n\n📝 **Краткая сводка:**\n• 28 лет, образование: Колледж (IT) + Университет (Педагог)\n• 5+ лет опыта в АО 'ПФ 'СКБ Контур'\n• Основные направления: AI-интеграции, автоматизация, веб-разработка\n• Контакты: 8 (912) 629-44-16, romap41@yandex.ru\n\nЗадайте более конкретный вопрос о моём опыте, навыках или проектах!";

    function showError(message) {
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
        errorModal.classList.add('flex');
    }

    closeModalBtn.addEventListener('click', () => {
        errorModal.classList.add('hidden');
        errorModal.classList.remove('flex');
    });

    function findBestResponse(query) {
        const normalizedQuery = query.toLowerCase().trim();
        
        // Поиск наилучшего совпадения
        let bestMatch = null;
        let maxScore = 0;
        
        templateResponses.forEach(template => {
            let score = 0;
            let matches = 0;
            
            template.keywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                
                // Полное совпадение слова (больший вес)
                if (normalizedQuery === keywordLower) {
                    score += 10;
                    matches++;
                } 
                // Полное слово в запросе
                else if (normalizedQuery.includes(' ' + keywordLower + ' ') || 
                         normalizedQuery.startsWith(keywordLower + ' ') || 
                         normalizedQuery.endsWith(' ' + keywordLower) ||
                         normalizedQuery === keywordLower) {
                    score += 5;
                    matches++;
                }
                // Подстрока (меньший вес)
                else if (normalizedQuery.includes(keywordLower)) {
                    score += 2;
                    matches++;
                }
            });
            
            // Премия за много совпадений
            if (matches > 2) {
                score += matches;
            }
            
            if (score > maxScore) {
                maxScore = score;
                bestMatch = template;
            }
        });
        
        // Если совпадение слишком слабое, возвращаем сводку
        return (bestMatch && maxScore >= 2) ? bestMatch.response : defaultResponse;
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
