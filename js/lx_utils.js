const browser = chrome || browser;

const update_message = 'Please update Leet Xt to the latest version';

async function isActivated() {
    if(!browser.storage) return true;
    let data = await browser.storage.local.get('activated');
    return data.activated;
}

function nextPageType() {
    const url = window.location.href;

    if (document.title.startsWith('friends')) return 'friends';
    if (document.title.endsWith('LeetCode Profile')) return 'profile';
    if(url.includes('/problems/')) return 'problem';
    if(url.includes('/problemset/')) return 'problemset';
    const contest_ranking_page_regex = /^https:\/\/leetcode\.com\/contest\/(weekly|biweekly)-contest-\d+\/ranking\/?$/;
    if (contest_ranking_page_regex.test(url)) return 'contest';
    return 'other';
}

function mutObserve(node, callback) {
    const observer = new MutationObserver(callback);
    observer.observe(node, { childList: true, subtree: true })
}

async function makeRequest(url, data, tag) {
    const method = data ? 'POST' : 'GET';
    data = data || {};
    try {
        let config = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        if (method === 'POST') config.body = JSON.stringify(data);
        const response = await fetch(url, config);
        if (!response.ok){
            tag = tag || response.statusText;
            console.log("FAIL: " + tag);
            return null;
        }
        return await response.json();
    } catch (error) {
        tag = tag || error;
        console.log("ERROR: " + tag);
        return null;
    }
}


/***** FRIENDS */

function addFriend(username, myfriends) {
    myfriends.push(username);
    browser.storage.local.set({ 'myfriends': myfriends }, function () {
        // console.log('ADDED FRIEND ' + myfriends);
    });
}

function removeFriend(username) {
    browser.storage.local.get('myfriends', function (result) {
        myfriends = result.myfriends;
        myfriends = myfriends.filter(e => e !== username);
        browser.storage.local.set({ 'myfriends': myfriends }, function () {
            // console.log('REMOVED FRIEND ' + myfriends);
        });
    });
}

function clearFriends() {
    browser.storage.local.set({ 'myfriends': [] }, function () {
        // console.log('CLEARED FRIENDS');
    });
}