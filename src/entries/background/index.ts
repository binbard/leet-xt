import { storage } from 'wxt/storage';
import { registerBackgroundService } from './service';
import Manager from '@/core/manager';

registerBackgroundService();

browser.runtime.onInstalled.addListener(function () {
    Manager.Logger.log('Extension Installed.');
    storage.setItem('local:activated', true);
});

browser.runtime.onMessage.addListener(async function (message: any, sender, sendResponse) {
    if (message.action === 'consoleLog') {
        Manager.Logger.log(message);
        sendResponse({ success: true, message: 'Logged successfully.' });
    } else if (message.action === "isActivated") {
        const activated = storage.getItem('local:activated');
        sendResponse({ activated });
    }

    return true;
});

async function addFriendsFromFileContent(content: string) {
    try {
        let decoded_content = atob(content);
        let regex = /^[a-zA-Z0-9;_]+$/;
        if (!regex.test(decoded_content)) {
            // openModal("Invalid users");
            Manager.Logger.log("Invalid users");
            return;
        }

        let friendList = decoded_content.split(";");

        friendList = [...new Set(decoded_content.split(";"))];
        if (friendList.length > Manager.Friend.FRIENDS_LIMIT) {
            // openModal(Manager.Friend.FRIENDS_MESSAGE);
            Manager.Logger.log(Manager.Friend.FRIENDS_MESSAGE);
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
                // openModal("No valid users to import.");
                Manager.Logger.log("No valid users to import.");
                return;
            }
            await storage.setItem('local:friends', friends);
            if (invalid_users.length > 0) {
                // openModal(friends.length + ' Friend(s) imported successfully. Invalid users: ' + invalid_users.join(" "));
                Manager.Logger.log(friends.length + ' Friend(s) imported successfully. Invalid users: ' + invalid_users.join(" "));
            } else {
                // openModal(friends.length + ' Friend(s) imported successfully.');
                Manager.Logger.log(friends.length + ' Friend(s) imported successfully.');
            }
            return;
        });

        return -1;

    } catch (e: any) {
        // openModal(`Something went wrong\n${e.message}`);
        Manager.Logger.log(`Something went wrong\n${e.message}`);
        return;
    }
}

export default defineBackground(() => {
    Manager.Logger.log('Background Listening', { id: browser.runtime.id });
});
