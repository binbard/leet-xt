import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import { mutObserve, docFind, checkDone, makeRequest, getUrl } from "@/core/utils/helpers";
import { getNavbarFriendsIcon } from "@/components/navbarFriendsIcon";
import Selectors from "@/values/selectors";

export class NavbarFriendsButton implements IModule {

    async action(_?: MutationRecord[], observer?: MutationObserver): Promise<void> {
        try {

            let navbar_user_avatar;

            try {
                navbar_user_avatar = docFind(Selectors.lc.static_dom.navbar.user_avatar);
            } catch (e) {
                // console.warn(NavbarFriendsButton.name, 'Navbar user avatar not found', e);
                return;
            }

            if (checkDone(navbar_user_avatar)) return;

            const navbarFriendIcon = getNavbarFriendsIcon(PageType.Friends);

            navbar_user_avatar?.parentElement?.insertBefore(navbarFriendIcon, navbar_user_avatar);

            // observer?.disconnect();

            console.info("Completed", NavbarFriendsButton.name);
        } catch (e: any) {
            console.warn(NavbarFriendsButton.name, '\n', e);
        }
    }

    apply(): void {
        this.action();
        mutObserve(Selectors.lc.static_dom.navbar.self, this.action);
        mutObserve(Selectors.lc.static_dom.app, this.action);
        mutObserve(Selectors.lc.static_dom.next, this.action);
    }

    pages = [PageType.ALL];

}