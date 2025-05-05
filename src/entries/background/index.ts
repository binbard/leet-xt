import { storage } from 'wxt/storage';
import { registerBackgroundService } from './service';
import Manager from '@/core/manager';
import { isMigrationNeeded, runMigration } from './migrate';

registerBackgroundService();

browser.runtime.onInstalled.addListener(async function (details) {    
    if (details.reason === 'install') {
        Manager.Logger.info('BG', 'Extension Installed.');
        Manager.Storage.set('activated', true);
    }

    else if (details.reason === 'update') {
        Manager.Logger.info('BG', `Extension Updated. v${details.previousVersion} -> v${Manager.Meta.getAppVersionString()}`);

        const previous_version = details.previousVersion || '0.0.0';
        await Manager.Storage.set('previous_version', previous_version);

        if (await isMigrationNeeded(previous_version)) {
            const { migrationVersion } = await runMigration();
            if (migrationVersion) {
                const currentVersion = Manager.Meta.getAppVersionString();
                Manager.Logger.info('BG', `Migration Completed. (MIG_v${migrationVersion}) v${previous_version} -> v${currentVersion}`);
            } else {
                Manager.Logger.info('BG', 'No migration needed.');
            }
        }
    }

    else {
        Manager.Logger.info('BG', 'Chrome Updated.');
    }
});

browser.runtime.onMessage.addListener(async function (message: any, sender, sendResponse) {
    if (message.action === 'consoleLog') {
        Manager.Logger.log('BG', message);
        sendResponse({ success: true, message: 'Logged successfully.' });
    } else if (message.action === "isActivated") {
        const activated = Manager.Storage.get('activated', true);
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
            Manager.Logger.log('BG', "Invalid users");
            return;
        }

        let friendList = decoded_content.split(";");

        friendList = [...new Set(decoded_content.split(";"))];
        if (friendList.length > Manager.Friend.FRIENDS_LIMIT) {
            // openModal(Manager.Friend.FRIENDS_MESSAGE);
            Manager.Logger.log('BG', Manager.Friend.FRIENDS_MESSAGE);
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
                Manager.Logger.log('BG', "No valid users to import.");
                return;
            }
            await Manager.Storage.set('friends', friends);
            if (invalid_users.length > 0) {
                // openModal(friends.length + ' Friend(s) imported successfully. Invalid users: ' + invalid_users.join(" "));
                Manager.Logger.log('BG', friends.length + ' Friend(s) imported successfully. Invalid users: ' + invalid_users.join(" "));
            } else {
                // openModal(friends.length + ' Friend(s) imported successfully.');
                Manager.Logger.log('BG', friends.length + ' Friend(s) imported successfully.');
            }
            return;
        });

        return -1;

    } catch (e: any) {
        // openModal(`Something went wrong\n${e.message}`);
        Manager.Logger.log('BG', `Something went wrong\n${e.message}`);
        return;
    }
}

export default defineBackground(() => {
    Manager.Logger.log('Background Listening', { id: browser.runtime.id });
});
