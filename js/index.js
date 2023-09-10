function showFeature(tabname) {
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.classList.add('hidden');
    });

    const selectedFeature = document.getElementById(tabname);
    if (selectedFeature) {
        selectedFeature.classList.remove('hidden');
    }
}

function addClickHandlers() {
    document.querySelectorAll('ul.feature-list li').forEach((li) => {
        li.addEventListener('click', () => {
            showFeature(li.getAttribute('name'));
        });
    });
}

function initHandler() {
    if (window.location.href.startsWith('http')) {
        document.querySelector('.title-main').innerHTML = document.title;
    }
}


initHandler();

addClickHandlers();