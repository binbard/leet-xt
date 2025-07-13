import PROBLEM_DESCRIPTION_HTML from "@/values/html/problem_description.html?raw";
import HEADLESSUI_PORTAL_ROOT from "@/values/html/premium_headlessui_portal_root.html?raw";

import { docFind, docFindById, getUrl, makeRequest, parseDocument, parseHTML } from "@/core/utils/helpers";
import { InfoManager } from "@/core/utils/infoManager";
import { ResponseType } from "@/core/defines/responseType";
import { ProblemCompanyTagsPremium } from "@/core/modules";
import { LEETCA_BASE_URL } from "@/values/config/app";
import Config from "@/values/config";

import Manager from "@/core/manager";

async function getPremiumProblemDescriptionContent(): Promise<HTMLElement> {
    const pdContent = parseHTML(PROBLEM_DESCRIPTION_HTML);
    const descriptionContent = pdContent.querySelector(".description_content") as HTMLElement;

    try {
        const questionData = InfoManager.getQuestionData();
        const questionId = questionData?.questionId;
        const questionTitle = questionData?.questionTitle;
        const questionDifficulty = questionData?.difficulty;
        const stats = JSON.parse(questionData?.stats);
        const totalAccepted = stats?.totalAccepted;
        const totalSubmission = stats?.totalSubmission;
        const acRate = stats?.acRate;
        
        const url = getUrl(`${LEETCA_BASE_URL}/${questionId}.html`);
        const response = await makeRequest(url, undefined, ResponseType.TEXT);
        const doc = parseDocument(response);

        const newDescriptionContent = docFind("body div.markdown-body", doc) as HTMLElement;

        for(let i = 0; i < Config.App.NUM_LEETCA_EXTRA_ELEMENTS; i++) {
            const lastChild = newDescriptionContent.lastElementChild;
            if (!lastChild) break;
            newDescriptionContent.removeChild(lastChild);
        }

        descriptionContent.innerHTML = newDescriptionContent.innerHTML;

        const lxProblemTitle = docFindById("lx-problem-title", pdContent) as HTMLElement;
        lxProblemTitle.textContent = `${questionId}. ${questionTitle}`;

        const lxProblemDifficulty = docFindById("lx-problem-difficulty", pdContent) as HTMLElement;
        lxProblemDifficulty.textContent = questionDifficulty;
        lxProblemDifficulty.classList.remove("text-difficulty-medium", "dark:text-difficulty-medium");
        lxProblemDifficulty.classList.add(`text-difficulty-${questionDifficulty.toLowerCase()}`, `dark:text-difficulty-${questionDifficulty.toLowerCase()}`);

        const lxTotalAccepted = docFindById("lx-total-accepted", pdContent) as HTMLElement;
        lxTotalAccepted.textContent = totalAccepted;

        const lxTotalSubmission = docFindById("lx-total-submission", pdContent) as HTMLElement;
        lxTotalSubmission.textContent = `/${totalSubmission}`;

        const lxAcRate = docFindById("lx-ac-rate", pdContent) as HTMLElement;
        lxAcRate.textContent = acRate;

        const lxProblemCompanies = docFindById("lx-problem-companies", pdContent) as HTMLElement;
        const headlessuiPortalRoot = parseHTML(HEADLESSUI_PORTAL_ROOT);
        lxProblemCompanies.onclick = () => {
            document.body.appendChild(headlessuiPortalRoot);
            ProblemCompanyTagsPremium.showCompanyTags();
        };

        const lxCompaniesCloseButton = docFindById("lx-companies-close-button", headlessuiPortalRoot) as HTMLElement;
        lxCompaniesCloseButton.onclick = () => {
            headlessuiPortalRoot.remove();
        };

    } catch (e: any) {
        Manager.Logger.warn("getPremiumProblemDescriptionContent", e);
    }

    return pdContent;
}

export { getPremiumProblemDescriptionContent }