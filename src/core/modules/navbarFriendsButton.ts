import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import { mutObserve, docFind, checkDone, makeRequest, getUrl } from "@/core/utils/helpers";
import { getNavbarFriendsIcon } from "@/components/navbarFriendsIcon";
import Selectors from "@/values/selectors";
import Manager from "../manager";

export class NavbarFriendsButton implements IModule {
     async action(_?: MutationRecord[], observer?: MutationObserver): Promise<void> {
            try {
                // Manager.Logger.log("Darshan", NavbarFriendsButton.name);
    
                let navbar_user_avatar;
    
                try {
                    navbar_user_avatar = docFind(Selectors.lc.static_dom.navbar.user_avatar);
                } catch (e) {
                    // Manager.Logger.warn(NavbarFriendsButton.name, 'Navbar user avatar not found', e);
                    return;
                }
    
                if (checkDone(navbar_user_avatar)) return;
    
                
                const navbarFriendIcon = getNavbarFriendsIcon(PageType.Friends);
                const button = navbar_user_avatar.closest('button');
                const parent = button?.parentElement;
                const grandparent = parent?.parentElement;
    
    
                grandparent?.parentElement?.parentElement?.insertBefore(navbarFriendIcon, grandparent.parentElement);
    
                // observer?.disconnect();
    
                Manager.Logger.log("Completed", NavbarFriendsButton.name);
            } catch (e: any) {
                Manager.Logger.warn(NavbarFriendsButton.name, e);
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