import { FriendManager } from "./utils/friendManager";
import { LeetcodeManager } from "./utils/leetcodeManager";
import { LogManager } from "./utils/logManager";
import { MetaManager } from "./utils/metaManager";
import { StorageManager } from "./utils/storageManager";

class Manager {
    constructor() {
        Manager.Logger.log(Manager.name, 'This Manager will never be hired');
    }

    static Meta = MetaManager
    static Friend = FriendManager
    static Leetcode = LeetcodeManager
    static Logger = LogManager
    static Storage = StorageManager
}

export default Manager;