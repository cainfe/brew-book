export function upsertBrew(brew) {
    const brews = getBrews();
    if (!brew.id) {
        brew.id = Date.now().toString();
    }

    if (brews.some(existingBrew => existingBrew.id === brew.id)) {
        brews.forEach((existingBrew, index) => {
            if (existingBrew.id === brew.id) {
                brews[index] = brew;
            }
        });
    } else {
        brews.push(brew);
    }
    
    localStorage.setItem('brews', JSON.stringify(brews));
}

export function getBrews() {
    const brews = localStorage.getItem('brews');
    return brews ? JSON.parse(brews) : [];
}

export function getBrewById(id) {
    const brews = getBrews();
    return brews.find(brew => brew.id === id);
}

export function deleteBrew(id) {
    let brews = getBrews();
    brews = brews.filter(brew => brew.id !== id);
    localStorage.setItem('brews', JSON.stringify(brews));
}

export function upsertBean(bean) {
    const beans = getBeans();
    if (!bean.id) {
        bean.id = Date.now().toString();
    }

    if (beans.some(existingBean => existingBean.id === bean.id)) {
        beans.forEach((existingBean, index) => {
            if (existingBean.id === bean.id) {
                beans[index] = bean;
            }
        });
    } else {
        beans.push(bean);
    }
    
    localStorage.setItem('beans', JSON.stringify(beans));
};

export function getBeans() {
    const beans = localStorage.getItem('beans');
    return beans ? JSON.parse(beans) : [];
}

export function getBeanById(id) {
    const beans = getBeans();
    return beans.find(bean => bean.id === id);
}

export function deleteBean(id) {
    let beans = getBeans();
    beans = beans.filter(bean => bean.id !== id);
    localStorage.setItem('beans', JSON.stringify(beans));
}