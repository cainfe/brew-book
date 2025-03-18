import { getBrews, getBeans } from './storage.js';
import { toggleMenu } from './sideMenu.js';
import { buildBrewCard, listBrews } from './brewCard.js';
import { buildBeanCard, listBeans } from './beanCard.js';

document.addEventListener('DOMContentLoaded', function () {
    const newBrewCard = buildBrewCard();
    document.getElementById("brews-list").appendChild(newBrewCard);
    listBrews(getBrews());

    const newBeanCard = buildBeanCard();
    document.getElementById("beans-list").appendChild(newBeanCard);
    listBeans(getBeans());
});

window.toggleMenu = toggleMenu;
