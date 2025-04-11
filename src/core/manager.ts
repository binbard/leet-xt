import { FriendManager } from "./utils/friendManager";
import { LeetcodeManager } from "./utils/leetcodeManager";
import { MetaManager } from "./utils/metaManager";

class Manager {
    constructor() {
        console.log('This Manager will never be hired');
    }

    static Meta = MetaManager
    static Friend = FriendManager
    static Leetcode = LeetcodeManager
}

export default Manager;