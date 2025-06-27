import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import { mutObserve, docFind, checkDone, makeRequest, getUrl } from "@/core/utils/helpers";
import { getNavbarFriendsIcon } from "@/components/navbarFriendsIcon";
import Selectors from "@/values/selectors";
import Manager from "../manager";
import { ResponseType } from "../defines/responseType";

export class NavbarFriendsButton implements IModule {

    async action(_?: MutationRecord[], observer?: MutationObserver): Promise<void> {
        try {
            const iconContainer = docFind(Selectors.lc.navbar.root.icon_container, undefined, true);
            if (!iconContainer) return;
            if (checkDone(iconContainer)) return;

            const navbarFriendIcon = getNavbarFriendsIcon(PageType.Friends);

            const profileIconContainer = docFind(Selectors.lc.navbar.root.icon_container.profile_icon_container, undefined, true);
            if (!profileIconContainer) {
                Manager.Logger.log(NavbarFriendsButton.name, "Not logged in");
                return;
            }

            iconContainer?.insertBefore(navbarFriendIcon, profileIconContainer);

            // observer?.disconnect();

            Manager.Logger.log("Completed", NavbarFriendsButton.name);
        } catch (e: any) {
            Manager.Logger.warn(NavbarFriendsButton.name, e);
        }
    }

    apply(): void {
        if (docFind(Selectors.lc.static_dom.navbar, undefined, true)) {
            mutObserve(Selectors.lc.static_dom.navbar.self, this.action);
        } else {
            mutObserve(Selectors.lc.static_dom.next, this.action);
        }
    }

    pages = [PageType.ALL];

}