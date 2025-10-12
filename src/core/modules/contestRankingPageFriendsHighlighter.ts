import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import Manager from "../manager";
import { FriendManager } from "../utils/friendManager";
import { IFriendData } from "@/core/utils/leetcodeManager";

export class ContestHighlighter implements IModule {
    pages = [PageType.CONTEST];
    private friends: IFriendData[] = [];

    apply(): void {
        const observer = new MutationObserver(() => this.action());
        observer.observe(document.body, { childList: true, subtree: true });
        this.action();
    }

    async action() {
        try {
            this.friends = await FriendManager.getFullFriendList();
            if (!this.friends.length) return;

            const rows = document.querySelectorAll<HTMLDivElement>(
                "div.even\\:bg-fill-quaternary.flex.h-\\[50px\\]"
            );

            const rankDivs = document.querySelectorAll<HTMLDivElement>(
                "div.flex.w-\\[94px\\].flex-none.flex-col > div"
            );

            rows.forEach((row, i) => {
                const displayNameDiv = row.querySelector<HTMLDivElement>("a div.truncate");
                const displayName = displayNameDiv?.textContent?.trim();
                if (!displayName) return;

                const rankDiv = rankDivs[i - 26]; // adjust index as before
                if (!rankDiv) return;

                const isFriend = this.friends.some(
                    f => f.displayName.toLowerCase() === displayName.toLowerCase()
                );

                if (isFriend) {
                    const startColor = "#ccb95f"; // yellow
                    const endColor = "#4e311d";   // dark brown

                    // Row gradient background
                    const rowGradient = "linear-gradient(to bottom, #27211c 0%, #4e311d 100%)";
                    row.style.background = rowGradient;
                    row.style.borderRadius = "8px";
                    row.style.transition = "all 0.4s ease";
                    row.style.color = "#fff";
                    row.style.position = "relative"; // needed if we use pseudo-element

                    // Remove boxShadow
                    // row.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)"; // optional drop shadow

                    // Apply gradient border using border-image
                    row.style.border = "3px solid"; // border width
                    row.style.borderImage = `linear-gradient(to bottom right, ${startColor}, ${endColor}) 1`;

                    // Rank div styles
                    rankDiv.style.background = rowGradient;
                    rankDiv.style.borderTopLeftRadius = "6px";
                    rankDiv.style.borderBottomLeftRadius = "6px";
                    rankDiv.style.padding = "2px 6px";
                    rankDiv.style.color = "#fff";
                    rankDiv.style.fontWeight = "600";
                    rankDiv.style.textShadow = "0 0 6px rgba(0,0,0,0.4)";
                    rankDiv.style.transition = "all 0.3s ease";

                    // Optional: gradient border on rankDiv too
                    rankDiv.style.border = "2px solid";
                    rankDiv.style.borderImage = `linear-gradient(to bottom right, ${startColor}, ${endColor}) 1`;
                }


            });
        } catch (e: any) {
            Manager.Logger.warn(this.constructor.name, e);
        }
    }
}
