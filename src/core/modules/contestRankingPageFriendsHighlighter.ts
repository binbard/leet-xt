import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import Manager from "../manager";
import { FriendManager } from "../utils/friendManager";
import { IFriendData } from "@/core/utils/leetcodeManager";
import { weekly, biweekly } from "@/core/defines/colorsForContestRankHighlighter";


export class contestRankingPageFriendsHighlighter implements IModule {
    pages = [PageType.CONTEST];
    private friends: IFriendData[] = [];

    apply(): void {
        const observer = new MutationObserver(() => this.action());
        observer.observe(document.body, { childList: true, subtree: true });
        this.action();
    }

    async action() {
        try {
            // Fetch friend list
            this.friends = await FriendManager.getFullFriendList();
            if (!this.friends.length) return;

            // Create a Set for O(1) lookup
            const friendSet = new Set(this.friends.map(f => f.displayName.toLowerCase()));

            const rows = document.querySelectorAll<HTMLDivElement>(
                "div.even\\:bg-fill-quaternary.flex.h-\\[50px\\]"
            );

            const rankDivs = document.querySelectorAll<HTMLDivElement>(
                "div.flex.w-\\[94px\\].flex-none.flex-col > div"
            );

            let offset = 25;
            const you = rows[27].querySelector<HTMLDivElement>("a div.truncate")?.textContent?.trim();
            if (you === "You") offset = offset + 1;

            rows.forEach((row, i) => {
                const displayNameDiv = row.querySelector<HTMLDivElement>("a div.truncate");
                const displayName = displayNameDiv?.textContent?.trim();
                if (!displayName) return;

                const isFriend = friendSet.has(displayName.toLowerCase());
                if (!isFriend) return;

                const isBiweekly = window.location.href.includes("biweekly");
                
                const colors = isBiweekly ? biweekly : weekly;
                const boxBorderColor = colors.boxBorderColor;
                const boxLowerColor = colors.boxLowerColor;
                const boxUpperColor = colors.boxUpperColor;
                const boxBorderEndingColor = colors.boxBorderEndingColor;


                const rankDiv = rankDivs[i - offset]; // adjust index as needed
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
