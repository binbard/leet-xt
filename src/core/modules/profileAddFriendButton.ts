import STAR_ICON_SVG from "@/values/svg/star_icon.svg?raw";

import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import { mutObserve, docFind, checkDone, docFindById } from "@/core/utils/helpers";

import Manager from "@/core/manager";
import Selectors from "@/values/selectors";
import Config from "@/values/config";

export class ProfileAddFriendButton implements IModule {

    async action(_?: MutationRecord[], observer?: MutationObserver): Promise<void> {
        try {
            const name_box = docFind(Selectors.lc.profile.name_section.name_parent, undefined, true);
            if (checkDone(name_box)) return;

            const star = document.createElement('div');
            star.style.cursor = "pointer";

            let parser = new DOMParser();
            let doc = parser.parseFromString(STAR_ICON_SVG, 'image/svg+xml');
            let svg = doc.querySelector('svg');
            svg?.setAttribute('fill', 'currentColor');
            if (svg) star.appendChild(svg);

            name_box.appendChild(star);
            name_box.classList.add("flex", "items-center", "space-x-2");

            observer?.disconnect();

            star.addEventListener("click", () => ProfileAddFriendButton.toggleFriend());
            await ProfileAddFriendButton.toggleFriend(true);

            Manager.Logger.log("Completed", ProfileAddFriendButton.name);

        } catch (e: any) {
            // Manager.Logger.warn(ProfileAddFriendButton.name, e);
        }
    }

    static async toggleFriend(setup = false): Promise<void> {
        try {
            const star_path = docFind(Selectors.lc.profile.name_section.star_icon_path);

            const uname_box = docFind(Selectors.lc.profile.name_section.username);
            const username = uname_box.innerText;

            const isFriend = await Manager.Friend.isFriend(username);

            if (setup === true) {
                if (isFriend) {                                 // User is Friend
                    if (star_path) {
                        star_path.style.fill = Config.Colors.FRIEND_STAR;
                    }
                } else {                                        // User is not Friend
                    if (star_path) star_path.style.fill = Config.Colors.NOT_FRIEND_STAR;
                }
                return;
            }

            if (isFriend) {                                     // User is Friend, Remove it
                if (star_path) star_path.style.fill = Config.Colors.NOT_FRIEND_STAR;
                Manager.Friend.removeFriend(username);
            } else {                                            // User is not Friend, Add it
                try {
                    Manager.Friend.addFriend(username);
                    if (star_path) star_path.style.fill = Config.Colors.FRIEND_STAR;
                } catch (e: any) {
                    Manager.Logger.warn(ProfileAddFriendButton.name, e);
                }
            }

        } catch (e: any) {
            Manager.Logger.warn(ProfileAddFriendButton.name, e);
        }
    }

    apply(): void {
        mutObserve(Selectors.lc.static_dom.next, this.action);
    }

    pages = [PageType.PROFILE];

    blacklist_pages?: [PageType.FRIENDS];
}