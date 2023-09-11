function showFeature(tabname) {
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.classList.add('hidden');
    });

    const selectedFeature = document.getElementById(tabname);
    if (selectedFeature) {
        selectedFeature.classList.remove('hidden');
        document.querySelector('.sidebar').classList.toggle('open');
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
        document.querySelector('.title').innerHTML = document.title;
        document.querySelectorAll('.web').forEach((el) => {
            el.classList.remove('hidden');
        });
    }

    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}


initHandler();

addClickHandlers();