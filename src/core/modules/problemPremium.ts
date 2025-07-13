import PROBLEM_DESCRIPTION_HTML from "@/values/html/problem_description.html?raw";

import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import { mutObserve, docFind, checkDone, parseHTML } from "@/core/utils/helpers";
import { getPremiumProblemDescriptionContent } from "@/components/problemDescriptionContentPremium";

import Manager from "@/core/manager";
import Selectors from "@/values/selectors";

export class ProblemPremium implements IModule {

    async action(_?: MutationRecord[], observer?: MutationObserver): Promise<void> {
        try {
            const qdContent = docFind(Selectors.lc.problem.problem.qd_content) as HTMLElement;
            if(checkDone(qdContent)) return;
            if(!ProblemPremium.isPremiumProblem()) return;

            const qdParent = qdContent.parentElement as HTMLElement;

            const subUnlockOverlayDiv = qdContent.nextElementSibling as HTMLElement;
            qdParent.removeChild(subUnlockOverlayDiv);

            const pdContentParent = qdContent.querySelector(Selectors.lc.problem.problem.pd_content_parent) as HTMLElement;
            const pdContent = await getPremiumProblemDescriptionContent();

            while (pdContentParent?.firstChild) {
                pdContentParent.removeChild(pdContentParent.firstChild);
            }

            pdContentParent?.appendChild(pdContent);

            observer?.disconnect();
            
        } catch (e: any) {
            Manager.Logger.warn(ProblemPremium.name, e);
        }
    }

    static isPremiumProblem(): boolean {
        const qd = docFind(Selectors.lc.problem.problem.qd_content) as HTMLElement
        if (!qd) return false;
        return qd.parentElement?.childElementCount === 2;
    }

    apply(): void {
        mutObserve(Selectors.lc.static_dom.next, this.action);
    }

    pages = [PageType.PROBLEM];
}