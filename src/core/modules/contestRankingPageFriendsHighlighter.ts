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

            let offset = 25;

            const you = rows[27].querySelector<HTMLDivElement>("a div.truncate")?.textContent?.trim();
            if(you==="You") offset=offset+1;

            rows.forEach((row, i) => {
                const displayNameDiv = row.querySelector<HTMLDivElement>("a div.truncate");
                const displayName = displayNameDiv?.textContent?.trim();
                if (!displayName) return;

                const isBiweekly = window.location.href.includes("biweekly");
                const boxBorderColor = isBiweekly ? "#aff0ff" : "#f5d76e"; // blue for biweekly, gold for weekly
                const boxLowerColor = isBiweekly ? "#281a4b" : "#492c1b"; // dark blue vs deep brown
                const boxUpperColor = isBiweekly ? "#181c24" : "#211c1a"; // medium blue vs medium brown
                
                const rankDiv = rankDivs[i - offset]; // adjust index as needed
                if (!rankDiv) return;

                const isFriend = this.friends.some(
                    f => f.displayName.toLowerCase() === displayName.toLowerCase()
                );

                if (isFriend) {
                    // const startColor = "#f5d76e"; // gold
                    // const endColor = "#4e311d";   // deep brown



                    // === Row Styling ===
                    row.style.position = "relative";
                    row.style.overflow = "hidden";
                    row.style.color = "#fff";
                    row.style.transition = "all 0.4s ease";
                    row.style.background = `linear-gradient(180deg, ${boxUpperColor} 0%, ${boxLowerColor} 100%)`;
                    row.style.borderLeft = "none";


                    // Top gradient border
                    if (!row.querySelector(".top-border")) {
                        const topBorder = document.createElement("div");
                        topBorder.className = "top-border";
                        topBorder.style.position = "absolute";
                        topBorder.style.top = "0";
                        topBorder.style.left = "0";
                        topBorder.style.right = "0";
                        topBorder.style.height = "1px";
                        topBorder.style.background = `linear-gradient(to right, ${boxBorderColor} 0%, ${boxLowerColor} 70%)`;
                        row.appendChild(topBorder);
                    }

                    // Bottom gradient border
                    if (!row.querySelector(".bottom-border")) {
                        const bottomBorder = document.createElement("div");
                        bottomBorder.className = "bottom-border";
                        bottomBorder.style.position = "absolute";
                        bottomBorder.style.bottom = "0";
                        bottomBorder.style.left = "0";
                        bottomBorder.style.right = "0";
                        bottomBorder.style.height = "1px";
                        bottomBorder.style.background = `linear-gradient(to right, ${boxLowerColor}, ${boxBorderColor})`;
                        row.appendChild(bottomBorder);
                    }

                    // Right gradient border
                    if (!row.querySelector(".right-border")) {
                        const rightBorder = document.createElement("div");
                        rightBorder.className = "right-border";
                        rightBorder.style.position = "absolute";
                        rightBorder.style.top = "0";
                        rightBorder.style.bottom = "0";
                        rightBorder.style.right = "0";
                        rightBorder.style.width = "1px"; // thickness of the right border
                        rightBorder.style.background = `linear-gradient(to top, ${boxBorderColor}, ${boxLowerColor})`;
                        row.appendChild(rightBorder);
                    }

                    // === Rank Div Styling ===
                    rankDiv.style.position = "relative";
                    rankDiv.style.background = `linear-gradient(180deg, ${boxUpperColor} 0%, ${boxLowerColor} 100%)`;
                    rankDiv.style.padding = "2px 8px";
                    rankDiv.style.color = "#fff";
                    rankDiv.style.fontWeight = "600";
                    // rankDiv.style.textShadow = "0 0 6px rgba(0,0,0,0.4)"
                    rankDiv.style.borderRadius = "0";
                    rankDiv.style.borderRight = "none";
                    rankDiv.style.borderTop = `1px solid ${boxBorderColor}`;
                    
                    if(!rankDiv.querySelector(".rank-right-border")) {
                        const leftBorder = document.createElement("div");
                        leftBorder.className = "left-border";
                        leftBorder.style.position = "absolute";
                        leftBorder.style.top = "0";
                        leftBorder.style.bottom = "0";
                        leftBorder.style.left = "0";
                        leftBorder.style.width = "1px"; // thickness of the left border
                        leftBorder.style.background = `linear-gradient(to bottom, ${boxBorderColor}, ${boxLowerColor})`;
                        rankDiv.appendChild(leftBorder);

                    }
                    
                }
            });
        } catch (e: any) {
            Manager.Logger.warn(this.constructor.name, e);
        }
    }
}
