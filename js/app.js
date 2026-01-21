document.addEventListener('DOMContentLoaded', function () {
    // --- ЛОГИКА АККОРДЕОНА ---
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const collapseTargetId = button.getAttribute('data-bs-target');
            const collapseElement = document.querySelector(collapseTargetId);
            const parentAccordion = button.closest('.accordion');
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            // Закрываем другие открытые элементы в том же аккордеоне
            if (parentAccordion) {
                const openItems = parentAccordion.querySelectorAll('.accordion-collapse.show');
                openItems.forEach((item) => {
                    if (item !== collapseElement) {
                        item.classList.remove('show');
                        const otherButton = parentAccordion.querySelector(`[data-bs-target="#${item.id}"]`);
                        if (otherButton) {
                            otherButton.classList.add('collapsed');
                            otherButton.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
            }

            // Переключаем текущий элемент
            button.classList.toggle('collapsed');
            button.setAttribute('aria-expanded', !isExpanded);
            collapseElement.classList.toggle('show');
        });
    });

    // --- ЛОГИКА МОБИЛЬНОГО МЕНЮ (OFFCANVAS) ---
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const offcanvas = document.querySelector('.offcanvas');
    const offcanvasCloseButton = document.querySelector('.offcanvas .btn-close');

    if (mobileMenuButton && offcanvas) {
        mobileMenuButton.addEventListener('click', () => offcanvas.classList.add('show'));
    }
    if (offcanvasCloseButton && offcanvas) {
        offcanvasCloseButton.addEventListener('click', () => offcanvas.classList.remove('show'));
    }

    // --- ЛОГИКА ВЫПАДАЮЩИХ МЕНЮ ДЛЯ ДЕСКТОПА ---
    const desktopDropdownToggles = document.querySelectorAll('.desktop_ver .dropdown-toggle');
    desktopDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (event) {
            event.preventDefault();
            const menu = this.nextElementSibling;
            const wasOpen = menu.classList.contains('show');

            // Закрываем все другие открытые выпадающие списки
            document.querySelectorAll('.desktop_ver .dropdown-menu.show').forEach(openMenu => {
                openMenu.classList.remove('show');
            });

            // Если меню не было открыто, открываем его
            if (!wasOpen) {
                menu.classList.toggle('show');
            }
        });
    });

    // Закрываем выпадающее меню десктопа при клике вне его
    window.addEventListener('click', function (event) {
        if (!event.target.matches('.desktop_ver .dropdown-toggle')) {
            document.querySelectorAll('.desktop_ver .dropdown-menu.show').forEach(openMenu => {
                openMenu.classList.remove('show');
            });
        }
    });

    // --- ЛОГИКА ВЫПАДАЮЩИХ МЕНЮ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ (ИСПРАВЛЕНИЕ) ---
    const mobileDropdowns = document.querySelectorAll('.mobile_ver .menu-item-has-children');
    mobileDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('a.dropdown-toggle');
        const submenu = dropdown.querySelector('.dropdown-menu');



        if (toggle && submenu) {
            // Создаем и добавляем элемент стрелки, так как на него ссылается CSS
            const arrow = document.createElement('span');
            arrow.classList.add('arrow');
            toggle.parentNode.appendChild(arrow);

            // Добавляем обработчик клика на стрелку
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Переключаем класс 'show' для стилизации стрелки (поворот)
                arrow.classList.toggle('show');

                // Переключаем видимость подменю с помощью класса Bootstrap 'show'
                submenu.classList.toggle('show');
            });
        }
    });


    const navHeader = document.querySelector('.lwptoc_header');
    const navItems = document.querySelector('.lwptoc_items');

    if (!navHeader || !navItems) {
        console.error('Не вдалося знайти необхідні елементи для меню навігації.');
        return;
    }

    navItems.style.display = 'none';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show';
    toggleButton.setAttribute('type', 'button');
    toggleButton.classList.add('toc-toggle-button');

    navHeader.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        const isHidden = navItems.style.display === 'none';

        if (isHidden) {
            navItems.style.display = 'block';
            toggleButton.textContent = 'Hide';
        } else {
            navItems.style.display = 'none';
            toggleButton.textContent = 'Show';
        }
    });


    function generateTableOfContents() {
        const tocListContainer = document.querySelector('.lwptoc_itemWrap');

        const headings = document.querySelectorAll('main .wp-block-hc-container h2, main .wp-block-hc-alternate-group-section h2');

        if (!tocListContainer || headings.length === 0) {
            console.warn('Контейнер оглавления (.lwptoc_itemWrap) или заголовки H2 для него не найдены.');
            return;
        }

        tocListContainer.innerHTML = '';

        const slugify = (text) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')   
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-')   
                .replace(/^-+/, '')     
                .replace(/-+$/, '');    
        };

        headings.forEach((heading, index) => {
            const titleText = heading.textContent.trim();


            let anchorId = heading.id;


            if (!anchorId) {

                anchorId = slugify(titleText) || `toc-item-${index}`;
                heading.id = anchorId;
            }


            const listItem = document.createElement('li');
            listItem.classList.add('lwptoc_item');


            const link = document.createElement('a');
            link.href = '#' + anchorId;


            const numberSpan = document.createElement('span');
            numberSpan.classList.add('lwptoc_item_number');
            numberSpan.textContent = index + 1;

            const labelSpan = document.createElement('span');
            labelSpan.classList.add('lwptoc_item_label');
            labelSpan.textContent = titleText;

            link.appendChild(numberSpan);
            link.appendChild(labelSpan);
            listItem.appendChild(link);
            tocListContainer.appendChild(listItem);
        });
    }

    generateTableOfContents();
});