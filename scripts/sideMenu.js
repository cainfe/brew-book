export function toggleMenu(menuId) {
    const panel = document.getElementById(menuId);
    const button = document.querySelector(`a[onclick="toggleMenu('${menuId}')"] img`);

    if (isMenuOpen(panel)) {
        closeMenu(panel);
        button.classList.remove('active');
        removeCloseIcon(button);
    } else {
        const menus = document.querySelectorAll('.menu-panel');
        menus.forEach(menu => {
            closeMenu(menu);
            const otherButton = document.querySelector(`a[onclick="toggleMenu('${menu.id}')"] img`);
            if (otherButton) {
                otherButton.classList.remove('active');
                removeCloseIcon(otherButton);
            }
        });
        openMenu(panel);
        button.classList.add('active');
        addCloseIcon(button);
    }
}

function addCloseIcon(button) {
    const closeIcon = document.createElement('img');
    closeIcon.src = './images/cancel.png';
    closeIcon.alt = 'Close';
    closeIcon.classList.add('close-icon');
    button.parentElement.appendChild(closeIcon);
}

function removeCloseIcon(button) {
    const closeIcon = button.parentElement.querySelector('.close-icon');
    if (closeIcon) {
        closeIcon.remove();
    }
}

export function isMenuOpen(panel) {
    return panel.style.right === '0px';
}

export function openMenu(panel) {
    panel.style.right = '0px';
}

export function closeMenu(panel) {
    panel.style.right = panel.style.width;
}