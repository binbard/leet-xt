import { FriendManager } from "./utils/friendManager";
import { LeetcodeManager } from "./utils/leetcodeManager";
import { LogManager } from "./utils/logManager";
import { MetaManager } from "./utils/metaManager";

class Manager {
    constructor() {
        Manager.Logger.log(Manager.name, 'This Manager will never be hired');
    }

    static Meta = MetaManager
    static Friend = FriendManager
    static Leetcode = LeetcodeManager
    static Logger = LogManager
}

export default Manager;