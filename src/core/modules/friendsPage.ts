import FRIEND_TABLE_HTML from "@/values/html/friend_table.html?raw"

import FRIEND_UPDOWN_ARROW from "@/values/svg/friend_updown_arrow.svg?raw"
import FRIEND_UP_ARROW from "@/values/svg/friend_up_arrow.svg?raw"
import FRIEND_DOWN_ARROW from "@/values/svg/friend_down_arrow.svg?raw"

import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import { clearAllChildren, docFind, parseHTML } from "@/core/utils/helpers";

import Manager from "@/core/manager";
import Config from "@/values/config"
import { IFriendData } from "../utils/leetcodeManager"
import { SortType } from "@/core/defines/sortType";
import { getFriendsTableRow } from "@/components/friendsTable";
import Selectors from "@/values/selectors"

type SortField = 'username' | 'rating' | 'problems_solved' | 'top';

export class FriendsPage implements IModule {
    private friendsData: IFriendData[] = [];
    private currentSortField: SortField = 'username';
    private currentSortDirection = SortType.ASC;
    private fx_headers = [
        Selectors.lc.friend.table.row_group.head_row.name,
        Selectors.lc.friend.table.row_group.head_row.rating,
        Selectors.lc.friend.table.row_group.head_row.problems_solved,
        Selectors.lc.friend.table.row_group.head_row.top
    ];

    async getFriendRow(username: string): Promise<IFriendData | null> {
        try {
            let details = await Manager.Leetcode.getUserDetails(username);

            if (details === null) {
                Manager.Friend.removeFriend(username);
                alert("User " + username + " does not exist. Removed from friends list.");
                return null;
            }

            const friendData: IFriendData = {
                ...details,
                displayName: details.name ? `${username} (${details.name})` : username
            };

            friendData.rowElement = getFriendsTableRow(friendData);

            return friendData;
        } catch (e: any) {
            console.warn(FriendsPage.name, '\n', e);
            return null;
        }
    }

    private resetSortingIcons(): void {
        try {
            const tableParent = docFind(Selectors.lc.friend.table_parent);

            for (let i = 0; i < this.fx_headers.length; i++) {
                let fx_header = docFind(this.fx_headers[i], tableParent);
                const fx_header_svg = docFind("svg", fx_header.parentElement);
                if (!fx_header_svg) return;

                fx_header_svg.innerHTML = FRIEND_UPDOWN_ARROW;
                fx_header_svg.setAttribute('viewBox', '0 0 24 24');
            }
        } catch (e: any) {
            console.warn(FriendsPage.name, '\n', e);
        }
    }

    private updateSortIndicator(headerElement: HTMLElement, direction: SortType): void {
        try {
            const fx_header_svg = docFind("svg", headerElement.parentElement);

            if (direction === SortType.ASC) {
                fx_header_svg.innerHTML = FRIEND_UP_ARROW;
            } else {
                fx_header_svg.innerHTML = FRIEND_DOWN_ARROW;
            }
            fx_header_svg.setAttribute('viewBox', '0 0 14 14');
        } catch (e: any) {
            console.warn(FriendsPage.name, '\n', e);
        }
    }

    private sortFriends(field: SortField, direction?: SortType): void {

        if (direction) {
            this.currentSortDirection = direction;
        }

        // Toggle direction if sorting by the same field again
        else if (this.currentSortField === field) {
            this.currentSortDirection = this.currentSortDirection === SortType.ASC ? SortType.DESC : SortType.ASC;
        } else {
            this.currentSortField = field;
            this.currentSortDirection = SortType.ASC;
        }

        this.resetSortingIcons();

        // Sort the data array
        this.friendsData.sort((a, b) => {
            let aValue: any = a[field];
            let bValue: any = b[field];

            // Convert to lowercase for string comparison
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = a.displayName.toLowerCase();
                bValue = b.displayName.toLowerCase();
            }

            // Handle special cases for values like "-" or percentages
            if (aValue === '-') aValue = 0;
            if (bValue === '-') bValue = 0;

            // Handle percentage values
            if (typeof aValue === 'string' && aValue.includes('%')) {
                aValue = parseFloat(aValue.replace('%', '')) / 100;
            }
            if (typeof bValue === 'string' && bValue.includes('%')) {
                bValue = parseFloat(bValue.replace('%', '')) / 100;
            }

            // Convert to numbers if applicable
            if (typeof aValue === 'string' && !isNaN(parseFloat(aValue))) {
                aValue = parseFloat(aValue);
            }
            if (typeof bValue === 'string' && !isNaN(parseFloat(bValue))) {
                bValue = parseFloat(bValue);
            }

            // Compare based on direction
            const modifier = this.currentSortDirection === 'asc' ? 1 : -1;
            if (aValue < bValue) return -1 * modifier;
            if (aValue > bValue) return 1 * modifier;
            return 0;
        });

        // Update the DOM after sorting
        this.renderFriends();
    }

    private renderFriends(): void {
        const rowGroup = docFind(Selectors.lc.friend.table.row_group);
        if (!rowGroup) return;

        rowGroup.innerHTML = '';

        for (const friend of this.friendsData) {
            if (friend.rowElement) {
                rowGroup.appendChild(friend.rowElement);
            }
        }
    }

    async makeFriendsPage() {
        try {
            const tableParent = docFind(Selectors.lc.friend.table_parent);
            clearAllChildren(tableParent);

            const friendsTable = parseHTML(FRIEND_TABLE_HTML);
            tableParent.appendChild(friendsTable);

            this.resetSortingIcons();

            const friendList = await Manager.Friend.getFriends();

            const rowGroupSelector = Selectors.lc.friend.table.row_group;
            const huser = docFind(rowGroupSelector.head_row.name);
            const hrating = docFind(rowGroupSelector.head_row.rating);
            const hprobsolved = docFind(rowGroupSelector.head_row.problems_solved);
            const htop = docFind(rowGroupSelector.head_row.top);

            huser.textContent = `${huser.textContent} (${friendList.length}/${Config.App.MAX_FRIENDS})`;

            let rowGroup = docFind(rowGroupSelector);

            if (friendList.length == 0) {
                rowGroup.innerHTML = '<div class="text-center text-gray-5 dark:text-dark-gray-5">No Friends Added</div>';
                return;
            }

            // Reset friends data array
            this.friendsData = [];

            // Get friend data and create rows
            let promises = friendList.map(async (username) => {
                const friendData = await this.getFriendRow(username);
                if (friendData) {
                    this.friendsData.push(friendData);
                    this.sortFriends('username', SortType.ASC);
                    this.renderFriends();
                }
            });
            await Promise.all(promises);

            // Set up sort event handlers
            huser.parentElement?.addEventListener("click", () => {
                this.sortFriends('username');
                this.updateSortIndicator(huser, this.currentSortDirection);
            });

            hrating.parentElement?.addEventListener("click", () => {
                this.sortFriends('rating');
                this.updateSortIndicator(hrating, this.currentSortDirection);
            });

            hprobsolved.parentElement?.addEventListener("click", () => {
                this.sortFriends('problems_solved');
                this.updateSortIndicator(hprobsolved, this.currentSortDirection);
            });

            htop.parentElement?.addEventListener("click", () => {
                this.sortFriends('top');
                this.updateSortIndicator(htop, this.currentSortDirection);
            });
        } catch (e: any) {
            console.warn(FriendsPage.name, '\n', e);
        }
    }

    async action(_?: MutationRecord[], observer?: MutationObserver): Promise<void> {
        try {
            this.makeFriendsPage();
            observer?.disconnect();

            console.info("Completed", FriendsPage.name);
        } catch (e: any) {
            console.warn(FriendsPage.name, '\n', e);
        }
    }

    apply(): void {
        let jsTimer = setInterval(function () { document.title = Config.Strings.FRIENDS_PAGE_TITLE }, 80);
        setTimeout(function () { clearInterval(jsTimer) }, Config.App.DEFAULT_INTERVAL_TIMEOUT);

        this.action();
    }

    pages = [PageType.FRIENDS];
}