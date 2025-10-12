import Manager from "../manager";
import { IFriendData, IUserDetails } from "@/core/utils/leetcodeManager";
import { LeetcodeManager } from "@/core/utils/leetcodeManager";

class FriendManager {

    static FRIENDS_LIMIT = 50;
    static FRIENDS_LOC: 'friends';
    static FRIENDS_MESSAGE = `FRIEND_LIMIT_EXCEEDED: You can only add upto ${this.FRIENDS_LIMIT} friends, ensuring an inclusive and sustainable experience for everyone!`;

    static async getFriendList(): Promise<string[]> {
        let friendList: string[] = await Manager.Storage.get(FriendManager.FRIENDS_LOC, []);
        return friendList;
    }

    static async isFriend(username: string): Promise<boolean> {
        const friendList: string[] = await this.getFriendList();
        return friendList.includes(username);
    }

    static async getFriends(): Promise<string[]> {
        const friendList = await this.getFriendList();
        return friendList;
    }

    static async getNumFriends(): Promise<number> {
        const friendList = await this.getFriendList();
        return friendList.length;
    }

    static async addFriend(username: string): Promise<void> {
        let friendList: string[] = await this.getFriendList();

        if (friendList.includes(username)) {
            return;
        }

        if (friendList.length >= this.FRIENDS_LIMIT) {
            throw new Error(this.FRIENDS_MESSAGE);
        }

        friendList.push(username);

        await Manager.Storage.set(FriendManager.FRIENDS_LOC, friendList);
    }

    static async removeFriend(username: string): Promise<void> {
        const friendList: string[] = await this.getFriendList();

        if (!friendList.includes(username)) {
            return;
        }

        const index = friendList.indexOf(username);
        friendList.splice(index, 1);

        await Manager.Storage.set(FriendManager.FRIENDS_LOC, friendList);
    }

    static async clearAllFriends() {
        await Manager.Storage.remove(FriendManager.FRIENDS_LOC);
    }

 static async getFullFriendList(): Promise<IFriendData[]> {
        const usernames: string[] = await Manager.Storage.get(FriendManager.FRIENDS_LOC, []);

        // Fetch details for all friends
        const friendData: IFriendData[] = await Promise.all(
            usernames.map(async username => {
                const details = await LeetcodeManager.getUserDetails(username);
                if (details) {
                    return {
                        ...details,
                        displayName: details.name || username
                    } as IFriendData;
                }
                // fallback if API fails
                return {
                    username,
                    avatar: "",
                    name: username,
                    rating: 0,
                    contests: "",
                    problems_solved: 0,
                    easy: 0,
                    medium: 0,
                    hard: 0,
                    top: "",
                    displayName: username
                } as IFriendData;
            })
        );

        return friendData;
    }
}


export { FriendManager };