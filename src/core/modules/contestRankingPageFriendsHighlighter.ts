import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import Manager from "../manager";
import { FriendManager } from "../utils/friendManager";
import Selectors from "@/values/selectors";
import Config from "@/values/config";

export class contestRankingPageFriendsHighlighter implements IModule {
    pages = [PageType.CONTEST];
    private friendUsernames: Set<string> = new Set();

    apply(): void {
        const observer = new MutationObserver(() => this.action());
        observer.observe(document.body, { childList: true, subtree: true });
        this.action();
    }

    async action() {
        try {
            const friends = await FriendManager.getFriendList();
            if (!friends.length) return;

            this.friendUsernames = new Set(friends.map(username => username.toLowerCase()));

            const rows = document.querySelectorAll<HTMLDivElement>(
                Selectors.lc.contest.ranking.container.table_container.original_table.row
            );

            const rankDivs = document.querySelectorAll<HTMLDivElement>(
                Selectors.lc.contest.ranking.container.table_container.original_table.rank_div
            );

            let offset = 25;
            const you = rows[27]?.querySelector<HTMLDivElement>(Selectors.lc.contest.ranking.container.table_container.original_table.username_div)?.textContent?.trim();
            if (you === "You") offset += 1;

            rows.forEach((row, i) => {
                const anchor = row.querySelector<HTMLAnchorElement>(Selectors.lc.contest.ranking.container.table_container.original_table.anchor_with_username);
                if (!anchor) return;

                const match = anchor.href.match(Selectors.lc.contest.ranking.container.table_container.original_table.username_href_regex);
                if (!match) return;

                const username = match[1].toLowerCase();
                if (!this.friendUsernames.has(username)) return;

                const isBiweekly = window.location.href.includes("biweekly");
                const colors = isBiweekly
                    ? Config.Colors.ContestBiweekly
                    : Config.Colors.ContestWeekly;

                const { boxBorderColor, boxLowerColor, boxUpperColor, boxBorderEndingColor } = colors;

                const rankDiv = rankDivs[i - offset]; // Adjust index based on 'You'
                if (!rankDiv) return;

                // Gradient definitions
                const gradientBackground = `linear-gradient(180deg, ${boxUpperColor} 0%, ${boxLowerColor} 100%)`;
                const gradientBorderForRankDiv = `linear-gradient(185deg, ${boxBorderColor} 0%, ${boxLowerColor} 80%)`;
                const gradientBorderForRowDiv = `linear-gradient(177deg, ${boxBorderColor} 0%, ${boxBorderEndingColor} 30%, ${boxUpperColor} 45%, ${boxLowerColor} 65%, ${boxBorderEndingColor} 70%, ${boxBorderColor} 100%)`;

                // === RANK DIV (left part) ===
                rankDiv.style.position = "relative";
                rankDiv.style.zIndex = "1";
                rankDiv.style.background = `${gradientBackground} padding-box, ${gradientBorderForRankDiv} border-box`;
                rankDiv.style.border = "1px solid transparent";
                rankDiv.style.borderRight = "none";
                rankDiv.style.borderTopLeftRadius = "6px";
                rankDiv.style.borderBottomLeftRadius = "6px";
                rankDiv.style.transition = "all 0.4s ease";

                // === ROW DIV (right part) ===
                row.style.position = "relative";
                row.style.zIndex = "1";
                row.style.background = `${gradientBackground} padding-box, ${gradientBorderForRowDiv} border-box`;
                row.style.border = "1px solid transparent";
                row.style.borderLeft = "none";
                row.style.borderTopRightRadius = "6px";
                row.style.borderBottomRightRadius = "6px";
                row.style.transition = "all 0.4s ease";
            });
        } catch (e: any) {
            Manager.Logger.warn(this.constructor.name, e);
        }
    }
}
