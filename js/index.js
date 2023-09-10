function showFeature(tabname) {
    // Hide all features
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.classList.add('hidden');
    });

    // Show the selected feature
    const selectedFeature = document.getElementById(tabname);
    if (selectedFeature) {
        selectedFeature.classList.remove('hidden');
    }
}

function addClickHandlers(){
    document.querySelectorAll('ul.feature-list li').forEach((li) => {
        li.addEventListener('click', () => {
            showFeature(li.getAttribute('name'));
        });
    });
}

addClickHandlers();