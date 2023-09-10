ext_link_svg = '<svg width="12px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Interface / External_Link"><path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';


let browser = chrome || browser;

let activated = false;

function openModal(message) {
    var modal = document.getElementById("myModal");
    var modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";

    modal.addEventListener("click", function (e) {
        closeModal();
    });
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function addClickHandlers() {
    let links = document.getElementsByTagName("button");

    for (let i = 0; i < links.length; i++) {
        let ele = links[i];
        if (!ele.hasAttribute("href")) continue;

        ele.innerHTML = ele.innerHTML + '&nbsp;' + ext_link_svg;
        ele.addEventListener("click", function (e) {
            let url = this.getAttribute("href");
            browser.tabs.create({ active: true, url: url });
        });
    }

    let clearFriendsBtn = document.getElementById("clearFriends");
    clearFriendsBtn.addEventListener("click", function (e) {
        browser.runtime.sendMessage({ action: "clearFriends" }, function (response) {
            // alert(response.message);
            openModal(response.message);
        });
    });

    let activateExtBtn = document.getElementById("activateExt");
    activateExtBtn.addEventListener("click", function (e) {
        if (activated) browser.runtime.sendMessage({ action: "deactivateExtension" }, function (response) {
            console.log(response);
            activateExtBtn.querySelector('path').setAttribute('stroke', '#a4a4a4');
            activated = false;
        });
        else browser.runtime.sendMessage({ action: "activateExtension" }, function (response) {
            console.log(response);
            activateExtBtn.querySelector('path').setAttribute('stroke', '#007bff');
            activated = true;
        });
    });

    let exportFriendsBtn = document.getElementById("exportFriends");
    exportFriendsBtn.addEventListener("click", function (e) {
        browser.runtime.sendMessage({ action: "exportFriends" }, function (response) {
            if (!response.success) {
                openModal(response.message);
                return;
            }

            my_friends = btoa(response.message);
            let blob = new Blob([my_friends], { type: "text/plain;charset=utf-8" });
            let date = new Date();
            let filename = "lc-friends-" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ".txt";

            browser.downloads.download({
                url: URL.createObjectURL(blob),
                filename: filename
            }, function (downloadId) {
                if (!downloadId) {
                    openModal("Download failed.");
                }
            });

        });
    });


    let importFriendsBtn = document.getElementById("importFriends");
    let usersFileInput = document.getElementById("usersFileInput");

    importFriendsBtn.addEventListener("click", function (e) { usersFileInput.click() });

    usersFileInput.addEventListener("change", function (e) {
        if (usersFileInput.files.length == 0) return;
        let file = usersFileInput.files[0];
        let reader = new FileReader(file);
        reader.onload = function (e) {
            let friends = e.target.result;
            browser.runtime.sendMessage({ action: "importFriends", friends: friends }, function (response) {
                openModal(response.message);
            });
        };
        reader.readAsText(file);
    });


    let exploreFeaturesBtn = document.getElementById("exploreFeatures");
    exploreFeaturesBtn.addEventListener("click", function (e) {
        browser.runtime.openOptionsPage();
    });

}

function initHandlers() {
    browser.runtime.sendMessage({ action: "isActivated" }, function (response) {
        if (!response.activated) {
            let activateExtBtn = document.getElementById("activateExt");
            activateExtBtn.querySelector('path').setAttribute('stroke', '#a4a4a4');
            activated = false;
        } else {
            let activateExtBtn = document.getElementById("activateExt");
            activateExtBtn.querySelector('path').setAttribute('stroke', '#007bff');
            activated = true;
        }
    });
}

initHandlers();

addClickHandlers();