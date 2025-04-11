import CONTEST_FRIEND_TABLE_HTML from "@/values/html/contest_friend_table.html?raw"
import CONSTEST_FRIEND_TABLE_COLUMN_HTML from "@/values/html/contest_friend_table_column.html?raw"

import PEOPLE_DARK_SVG from "@/values/svg/people_dark.svg?raw"
import PEOPLE_LIGHT_SVG from "@/values/svg/people_light.svg?raw"

import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import { checkDone, docFind, getStringValue, mutObserve } from "@/core/utils/helpers";
import { Result } from "../defines/result";
import { IUserContestDetails } from "../utils/leetcodeManager";

import Manager from "@/core/manager";
import Selectors from "@/values/selectors";

export class ContestRank implements IModule {

    static async toggleFriendMode() {
        try {
            let table_container = docFind(Selectors.lc.contest.ranking.container.table_container);

            let original_table = docFind(Selectors.lc.contest.ranking.container.table_container.original_table, table_container) as HTMLTableElement;
            let friend_table = table_container.querySelector(Selectors.lc.contest.ranking.container.table_container.friend_table.self) as HTMLTableElement;

            let pagination_nav = document.querySelector(Selectors.lc.contest.ranking.container.pagination_nav) as HTMLElement;

            if (friend_table == null) {                                     // Initially friend_table will be null
                original_table.style.display = "none";

                table_container.innerHTML += CONTEST_FRIEND_TABLE_HTML;
                friend_table = docFind(Selectors.lc.contest.ranking.container.table_container.friend_table) as HTMLTableElement;
                friend_table.style.display = "none";
            }

            let div = docFind(Selectors.lc.contest.ranking.container.people_icon.mode);
            if (div.querySelector(Selectors.lc.contest.ranking.container.people_icon.dark) == null) {
                div.innerHTML = PEOPLE_DARK_SVG;
                original_table.style.display = "none";
                friend_table.style.display = "none";
                friend_table.style.display = "table";
                pagination_nav.style.display = "none";

                if (checkDone(friend_table)) return;
                await ContestRank.setContestFriends();
            } else {
                div.innerHTML = PEOPLE_LIGHT_SVG;
                original_table.style.display = "table";
                friend_table.style.display = "none";
                pagination_nav.style.display = "flex";
            }
        } catch (e: any) {
            Manager.Logger.warn(ContestRank.name, e);
        }
    }

    static async setContestFriends() {
        try {
            let friend_table = docFind(Selectors.lc.contest.ranking.container.table_container.friend_table);
            let friend_table_body = docFind(Selectors.lc.contest.ranking.container.table_container.friend_table.body, friend_table);
            friend_table_body.innerHTML = friend_table_body.children[0].outerHTML;
            let friend_list = [];

            const contestName = window.location.pathname.split("/")[2];
            const friendList = await Manager.Friend.getFriends();

            const totalFriends = friendList.length;
            let friendsParticipated = 0;

            let contestNotFound = false;
            let errorLoadingData = false;

            let promises = friendList.map(async (friend) => {
                if (contestNotFound) return;

                try {
                    let userContestDetails = await Manager.Leetcode.getUserContestDetails(friend);
                    if (userContestDetails === null) return;

                    userContestDetails.username = friend;
                    friend_list.push(userContestDetails);

                    friendsParticipated++;

                    friend_list.sort((a, b) => {
                        return a.rank - b.rank;
                    });

                    friend_table_body.innerHTML = friend_table_body.children[0].outerHTML;

                    for (const friend of friend_list) {
                        const row = this.getRankingTableRow(friend, contestName);
                        if (!row) return;
                        friend_table_body.appendChild(row);
                    }
                } catch (e: any) {
                    if (e === Result.NO_DATA) {
                        contestNotFound = true;
                    }
                    else if (e == Result.ERROR) {
                        errorLoadingData = true;
                    }
                }
            });

            try {
                await Promise.all(promises);

                if (totalFriends == 0) {
                    const row = this.getRankingTableMessage('No Friends Added');
                    if (!row) return;
                    friend_table_body.innerHTML = "";
                    friend_table_body.appendChild(row);
                }
                else if(friendsParticipated == 0) {
                    const row = this.getRankingTableMessage(`${friendsParticipated}/${totalFriends} Friends participated`);
                    if (!row) return;
                    friend_table_body.innerHTML = friend_table_body.children[0].outerHTML;
                    friend_table_body.appendChild(row);
                }
                else if (contestNotFound) {
                    const row = this.getRankingTableMessage('Contest Not Found');
                    if (!row) return;
                    friend_table_body.innerHTML = "";
                    friend_table_body.appendChild(row);
                }
                else if (errorLoadingData) {
                    const row = this.getRankingTableMessage('Error Loading Data');
                    if (!row) return;
                    friend_table_body.innerHTML = "";
                    friend_table_body.appendChild(row);
                }

            } catch (e: any) {
                Manager.Logger.warn(ContestRank.name, e);
                throw e;
            }
        }

        catch (e: any) {
            Manager.Logger.error(ContestRank.name, e);
        }
    }

    static getRankingTableMessage(message: string): Element | null {
        try {
            const row = docFind(Selectors.lc.contest.ranking.container.table_container.friend_table.body.row);
            const rowClone = row.cloneNode(true) as Element;
            if (!rowClone) return null;

            rowClone.innerHTML = CONSTEST_FRIEND_TABLE_COLUMN_HTML;
            const column = rowClone.firstChild as HTMLDivElement;
            if (!column) return null;
            column.innerText = message;

            return rowClone;
        } catch (e: any) {
            Manager.Logger.warn(ContestRank.name, e);
            return null;
        }
    }

    static getRankingTableRow(userContestData: IUserContestDetails, contestName: string): Element | null {
        try {
            const rowSelector = Selectors.lc.contest.ranking.container.table_container.friend_table.body.row;
            const row = docFind(rowSelector);
            const rowClone = row.cloneNode(true) as Element;
            if (!rowClone) return null;

            docFind(rowSelector.rank, rowClone).innerHTML = userContestData.rank !== -1 ?
                `<a href=/contest/${contestName}/ranking/${Math.floor(userContestData.rank / 25) + 1}/>${userContestData.rank}</a>` : userContestData.rank.toString();
            docFind(rowSelector.name, rowClone).innerHTML =
                `<a href=/u/${userContestData.username}/>${userContestData.username}</a>`;
            docFind(rowSelector.score, rowClone).innerText = getStringValue(userContestData.score);
            docFind(rowSelector.old_rating, rowClone).innerText = getStringValue(userContestData.old_rating);
            docFind(rowSelector.delta_rating, rowClone).innerText = getStringValue(userContestData.delta_rating);
            docFind(rowSelector.new_rating, rowClone).innerText = getStringValue(userContestData.new_rating);
            return rowClone;
        } catch (e: any) {
            Manager.Logger.warn(ContestRank.name, e);
            return null;
        }
    }

    async action(_?: MutationRecord[], observer?: MutationObserver): Promise<void> {
        try {
            let contestHeader = document.querySelectorAll('[href^="/contest"]')[2];      // on ranking page
            if (!contestHeader) return;
            if (checkDone(contestHeader)) return;

            let div = document.createElement('div');
            div.id = "lx-people-mode";

            div.style = "cursor: pointer; margin-left: 10px; padding-top: 2px;display:inline;";
            div.innerHTML = PEOPLE_LIGHT_SVG;
            contestHeader?.parentElement?.appendChild(div);
            div.addEventListener('click', ContestRank.toggleFriendMode);

            observer?.disconnect();

            Manager.Logger.log("Completed", ContestRank.name);
        } catch (e: any) {
            Manager.Logger.error(ContestRank.name, e);
        }
    }

    apply(): void {
        try {
            this.action();
            const rankingContainer = docFind(Selectors.lc.contest.ranking.container);
            mutObserve(rankingContainer, this.action);
            mutObserve(Selectors.lc.static_dom.next, this.action);
        } catch (e: any) {
            Manager.Logger.error(ContestRank.name, e);
        }
    }

    pages = [PageType.CONTEST];

}