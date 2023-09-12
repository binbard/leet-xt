const browser = chrome || browser;

async function isActivated(){
    let data = await browser.storage.local.get('activated');
    return data.activated;
}

function nextPageType(){
    if(document.title.startsWith('friends')) return 'friends';
    if(document.title.endsWith('LeetCode Profile')) return 'profile';
    if(document.title.endsWith('Learning Platform')) return 'problem';
    if(document.title.startsWith('Problems')) return 'problemset';
    return 'other';
}

function mutObserve(node, callback) {
    if(!node) alert('Please update Leet Xt');
    const observer = new MutationObserver(callback);
    observer.observe(node, { childList: true, subtree: true })
}