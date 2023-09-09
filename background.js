let browser = chrome || browser;

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "clearFriends") {
        browser.storage.local.get('myfriends', function (data) {
            let friends_count = data.myfriends.length;
            if (friends_count > 0) {
                let friends_count = data.myfriends.length;
                browser.storage.local.set({ 'myfriends': [] }, function () {
                    sendResponse({ success: true, message: friends_count + ' Friend(s) cleared successfully.' });
                });
            } else {
                sendResponse({ success: false, message: "No friends to clear." });
            }
        });
        return true;
    }
});
