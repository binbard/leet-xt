import Manager from '@/core/manager';
import { getBackgroundService } from '@/entries/background/service';
import { docFind } from '@/core/utils/helpers';
import { BrowserType } from '@/core/defines/browserType';

const bg = getBackgroundService();

document.addEventListener("DOMContentLoaded", () => {
    const ACTIVATED_STROKE_COLOR = '#007bff';
    const DEACTIVATED_STROKE_COLOR = '#a4a4a4';

    const appTitle = docFind("#lx-title");
    const appDescription = docFind("#lx-desc");
    const appEmojis = ['😵', '😍', '😘', '❤️️', '🥰️'];
    const iEmoji = Math.floor(Math.random() * appEmojis.length);

    const activateExtButton = docFind("#activateExt") as HTMLButtonElement;
    const exportFriendsButton = docFind("#exportFriends") as HTMLButtonElement;
    const importFriendsButton = docFind("#importFriends") as HTMLButtonElement;
    const usersFileInput = docFind("#usersFileInput") as HTMLInputElement;
    const clearFriendsButton = docFind("#clearFriends") as HTMLButtonElement;

    const manifest = browser.runtime.getManifest();

    appTitle.textContent = "Leet Xt";
    appTitle.appendChild(document.createTextNode(` ${appEmojis[iEmoji]} v${manifest.version}`));
    appDescription.textContent = manifest.description || '';

    (async () => {
        if (await Manager.Meta.getActivated()) {
            activateExtButton.querySelector('path')?.setAttribute('stroke', ACTIVATED_STROKE_COLOR);
        } else {
            activateExtButton.querySelector('path')?.setAttribute('stroke', DEACTIVATED_STROKE_COLOR);
        }
    })();

    activateExtButton.addEventListener("click", async function (e) {
        const isActivated = await Manager.Meta.getActivated();

        if (isActivated) {
            activateExtButton.querySelector('path')?.setAttribute('stroke', DEACTIVATED_STROKE_COLOR);
            await Manager.Meta.setActivated(false);
        } else {
            activateExtButton.querySelector('path')?.setAttribute('stroke', ACTIVATED_STROKE_COLOR);
            await Manager.Meta.setActivated(true);
        }
    });

    exportFriendsButton.addEventListener("click", async () => {
        const friendList = await Manager.Friend.getFriends();

        if (friendList.length === 0) {
            openModal('No Friends to export');
            return;
        }

        let myFriends = btoa(friendList.join(";"));
        let blob = new Blob([myFriends], { type: "application/octet-stream" });
        let date = new Date();
        let filename = "lc-friends-" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ".lx";

        await browser.downloads.download({ url: URL.createObjectURL(blob), filename: filename });
    });

    importFriendsButton.addEventListener("click", async () => {
        if (await Manager.Meta.getBrowser() === BrowserType.Firefox) {
            browser.tabs.create({
                url: browser.runtime.getURL("/import_friends.html")
            }).catch((error: Error) => {
                Manager.Logger.error("Error opening import page:", error);
            });

            // openModal("This feature is not yet supported in Firefox.");
            return;
        }

        usersFileInput.click();
    });

    usersFileInput.addEventListener("change", async () => {
        if (!usersFileInput.files) return;

        const file = usersFileInput.files[0];
        const reader = new FileReader();
        reader.onload = async () => {
            const content = reader.result as string;
            await addFriendsFromFileContent(content);
        };

        reader.readAsText(file);
    });

    clearFriendsButton.addEventListener("click", async () => {
        const numFriends = await Manager.Friend.getNumFriends();
        await Manager.Friend.clearAllFriends();

        openModal(`Cleared ${numFriends} Friend(s)`);
    });
});

function openModal(message: string) {
    var modal = docFind("#myModal") as HTMLElement;
    var modalMessage = docFind("#modalMessage") as HTMLElement;
    modalMessage.textContent = message;
    modal.style.display = "block";

    modal.addEventListener("click", function (e) {
        closeModal();
    });
}

function closeModal() {
    var modal = docFind('#myModal') as HTMLElement;
    modal.style.display = "none";
}

async function addFriendsFromFileContent(content: string) {
    try {
        let decoded_content = atob(content);
        let regex = /^[a-zA-Z0-9;_]+$/;
        if (!regex.test(decoded_content)) {
            openModal("Invalid users");
            return;
        }

        let friendList = decoded_content.split(";");

        friendList = [...new Set(decoded_content.split(";"))];
        if (friendList.length > Manager.Friend.FRIENDS_LIMIT) {
            openModal(Manager.Friend.FRIENDS_MESSAGE);
            return;
        }

        let invalid_users: Array<string> = [];
        let valid_users: Array<string> = [];

        let promises = friendList.map(async username => {
            const user_exists = await Manager.Leetcode.isUserExist(username);
            if (user_exists) {
                valid_users.push(username);
            } else {
                invalid_users.push(username);
            }
        });

        const result = await Promise.all(promises).then(async () => {
            const friends = valid_users;
            if (friends.length == 0 && invalid_users.length > 0) {
                openModal("No valid users to import.");
                return;
            }
            await storage.setItem('local:friends', friends);
            if (invalid_users.length > 0) {
                openModal(friends.length + ' Friend(s) imported successfully. Invalid users: ' + invalid_users.join(" "));
            } else {
                openModal(friends.length + ' Friend(s) imported successfully.');
            }
            return;
        });

        return -1;

    } catch (e: any) {
        openModal(`Something went wrong\n${e.message}`);
        return;
    }
}