var browser = chrome || browser;


function lx() {
    
    browser.storage.local.get('activated', function (data) {
        if (data.activated) {
            lx_contest();
            lx_friends();
            lx_premium();
        }
    });
}


lx();