class FriendManager {

    static FRIENDS_LIMIT = 50;
    static FRIENDS_LOCATION: `local:${string}` = 'local:friends';
    static FRIENDS_MESSAGE = `FRIEND_LIMIT_EXCEEDED: You can only add upto ${this.FRIENDS_LIMIT} friends, ensuring an inclusive and sustainable experience for everyone!`;
    
    static async isFriend(username: string): Promise<boolean> {
        const friendList: string[] = await storage.getItem(FriendManager.FRIENDS_LOCATION, { fallback: [] });
        return friendList.includes(username);
    }

    static async getFriends(): Promise<string[]> {
        const friendList = await storage.getItem(FriendManager.FRIENDS_LOCATION, { fallback: [] });
        return friendList;
    }

    static async getNumFriends(): Promise<number> {
        const friendList = await storage.getItem(FriendManager.FRIENDS_LOCATION, { fallback: [] });
        return friendList.length;
    }

    static async addFriend(username: string): Promise<void> {
        let friendList: string[] = await storage.getItem(FriendManager.FRIENDS_LOCATION, { fallback: [] });

        if (friendList.includes(username)) {
            return;
        }

        if (friendList.length >= this.FRIENDS_LIMIT) {
            throw new Error(this.FRIENDS_MESSAGE);
        }
        
        friendList.push(username);

        await storage.setItem(FriendManager.FRIENDS_LOCATION, friendList);
    }

    static async removeFriend(username: string): Promise<void> {
        const friendList: string[] = await storage.getItem(FriendManager.FRIENDS_LOCATION, { fallback: [] });

        if (!friendList.includes(username)) {
            return;
        }

        const index = friendList.indexOf(username);
        friendList.splice(index, 1);

        await storage.setItem(FriendManager.FRIENDS_LOCATION, friendList);
    }

    static async clearAllFriends() {
        await storage.removeItem(FriendManager.FRIENDS_LOCATION);
    }
}

export { FriendManager };