export function toggleMenu(menuId) {
    const panel = document.getElementById(menuId);
    if (isMenuOpen(panel)) {
        closeMenu(panel);
    } else {
        const menus = document.querySelectorAll('.menu-panel');
        menus.forEach(menu => {
            closeMenu(menu);
        });
        openMenu(panel);
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