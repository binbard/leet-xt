import COMPANY_TAG_HTML from "@/values/html/company_tag.html?raw"

import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import { mutObserve, docFind, checkDone, makeRequest, getUrl, clearAllChildren } from "@/core/utils/helpers";
import { getCompanyTagsModalContentDiv, getCompanyTagsModalATag } from "@/components/companyTagsPremium";

import Selectors from "@/values/selectors";
import Config from "@/values/config";
import Manager from "../manager";

interface IProblemInfo {
    "Rating": number,
    "ID": number,
    "Title": string,
    "TitleZH": string,
    "TitleSlug": string,
    "ContestSlug": string,
    "ProblemIndex": string,
    "ContestID_en": string,
    "ContestID_zh": string
}

interface IProblemCompanyRowInfo {
    "StartRow": number,
    "EndRow": number
}

interface ICompanyCount {
    companyName: string,
    count: number
}

interface ICompanyTags {
    "0 - 6 months": ICompanyCount[],
    "6 months - 1 year": ICompanyCount[],
    "1 year - 2 years": ICompanyCount[]
}

export class ProblemCompanyTagsPremium implements IModule {
    private static problemContestInfo?: IProblemInfo;
    private static problemCompanyRowInfo?: IProblemCompanyRowInfo;
    private static problemCompanyTags?: ICompanyTags;

    async getProblemContestInfo(): Promise<IProblemInfo | null> {
        if (ProblemCompanyTagsPremium.problemContestInfo) return ProblemCompanyTagsPremium.problemContestInfo;

        try {
            const url = Config.App.ZEROTRAC_RATING_URL;

            let data = await makeRequest(getUrl(url)) as IProblemInfo[];

            /*************** SAMPLE DATA ***************
            [
                {
                    "Rating": 3018.4940165727,
                    "ID": 1719,
                    "Title": "Number Of Ways To Reconstruct A Tree",
                    "TitleZH": "重构一棵树的方案数",
                    "TitleSlug": "number-of-ways-to-reconstruct-a-tree",
                    "ContestSlug": "biweekly-contest-43",
                    "ProblemIndex": "Q4",
                    "ContestID_en": "Biweekly Contest 43",
                    "ContestID_zh": "第 43 场双周赛"
                }
            ]
            *********************************************/

            const qslug = window.location.pathname.split("/")[2];

            const problemContestInfo = data.find((problem: IProblemInfo) => {
                return problem.TitleSlug == qslug;
            });

            if (!problemContestInfo) return null;

            ProblemCompanyTagsPremium.problemContestInfo = problemContestInfo;

            return problemContestInfo;

        } catch (e: any) {
            Manager.Logger.warn(ProblemCompanyTagsPremium.name, e);
            return null;
        }
    }

    async getCompanyTagsRowInfo(problemSlug: string): Promise<IProblemCompanyRowInfo | null> {
        if (ProblemCompanyTagsPremium.problemCompanyRowInfo) return ProblemCompanyTagsPremium.problemCompanyRowInfo;

        try {
            const url = Config.App.GSHEETS_COMPANY_TAGS_URL;
            let data = await makeRequest(getUrl(url));
            if (!data.values || !data.values[0]) return null;

            /*************** SAMPLE DATA ***************
            {
                "range": "ProblemCompaniesTags_Map!A1:C2425",
                "majorDimension": "ROWS",
                "values": [
                  [
                    "Urls",
                    "StartRow",
                    "EndRow"
                  ],
                  [
                    "01-matrix",
                    "2",
                    "10"
                  ],
                  [
                    "132-pattern",
                    "11",
                    "16"
                  ]
            }
            *********************************************/

            data.values.shift();

            const problemCompanyRowData = data.values.find((row: string[]) => {
                return row[0] == problemSlug;
            }) as string[];

            if (!problemCompanyRowData) return null;

            ProblemCompanyTagsPremium.problemCompanyRowInfo = {
                StartRow: parseInt(problemCompanyRowData[1]),
                EndRow: parseInt(problemCompanyRowData[2])
            };

            return ProblemCompanyTagsPremium.problemCompanyRowInfo;
        } catch (e: any) {
            Manager.Logger.warn(ProblemCompanyTagsPremium.name, e);
            return null;
        }
    }

    async getCompanyTags(): Promise<ICompanyTags | null> {
        if (ProblemCompanyTagsPremium.problemCompanyTags) return ProblemCompanyTagsPremium.problemCompanyTags;

        try {
            let problemSlug = window.location.pathname.split("/")[2];
            let companyTagsRowInfo = await this.getCompanyTagsRowInfo(problemSlug);
            if (!companyTagsRowInfo) return null;

            const rowStart = companyTagsRowInfo.StartRow;
            const rowEnd = companyTagsRowInfo.EndRow;

            const url = `${Config.App.GSHEETS_COMPANY_DATA_URL}!${rowStart}:${rowEnd}?key=${Config.App.GSHEETS_COMPANY_DATA_KEY}`;
            const data = await makeRequest(url);
            if (!data.values || !data.values[0]) return null;

            /*************** SAMPLE DATA ***************
            {
                "range": "ProblemCompaniesTags!A6901:D6901",
                "majorDimension": "ROWS",
                "values": [
                    [
                        "number-of-flowers-in-full-bloom",
                        "1 year - 2 years",
                        "Google\n 4",
                        "6901"
                    ]
                ]
            }
            *********************************************/

            let companyTags: ICompanyTags = {
                "0 - 6 months": [],
                "6 months - 1 year": [],
                "1 year - 2 years": []
            };

            data.values.forEach((row: string[]) => {
                const key = row[1] as keyof ICompanyTags;

                const count = parseInt(row[2].split('\n ')[1] || '0');
                if (count === 0) return;

                companyTags[key].push({
                    companyName: row[2].split('\n ')[0],
                    count
                });
            });

            ProblemCompanyTagsPremium.problemCompanyTags = companyTags;

            return companyTags;
        } catch (e: any) {
            Manager.Logger.warn(ProblemCompanyTagsPremium.name, e);
            return null;
        }
    }

    async showCompanyTags() {
        try {
            const companyTagsModalBody = docFind(Selectors.lc.problem.companies_button.modal_body);
            
            if (checkDone(companyTagsModalBody)) return;

            clearAllChildren(companyTagsModalBody);
            companyTagsModalBody.setAttribute('style', 'min-height: 30vh');

            const companyTags = await this.getCompanyTags();

            const problemContestInfo = await this.getProblemContestInfo();
            if (problemContestInfo && problemContestInfo.Rating) {
                const problemRating = Math.round(problemContestInfo.Rating);
                const problemContest = problemContestInfo.ContestID_en;
                const problemContestSlug = problemContestInfo.ContestSlug;
                const contentDiv = getCompanyTagsModalContentDiv(`Difficulty Rating: ${problemRating}`);
                contentDiv.appendChild(getCompanyTagsModalATag(`/contest/${problemContestSlug}`, problemContest));
                companyTagsModalBody.appendChild(contentDiv);
                companyTagsModalBody.appendChild(document.createElement('br'));
            } else {
                companyTagsModalBody.appendChild(getCompanyTagsModalContentDiv("Unrated"));
            }

            if (!companyTags) {
                companyTagsModalBody.appendChild(getCompanyTagsModalContentDiv("No Company Tags"));
                return;
            }

            Object.keys(companyTags).forEach((key: string) => {
                const mkey = key as keyof ICompanyTags;

                const timeRange = key.split(" ").map((word) => {
                    return word[0].toUpperCase() + word.slice(1);
                }).join(" ");

                companyTagsModalBody.innerHTML += `<span class="px-2">${timeRange}</span><br>`;

                if (companyTags[mkey].length == 0) {
                    companyTagsModalBody.appendChild(getCompanyTagsModalContentDiv(Config.Strings.NA));
                    return;
                }

                companyTags[mkey].forEach((tag: ICompanyCount) => {

                    let companyTagDiv = document.createElement('div');
                    companyTagDiv.innerHTML = COMPANY_TAG_HTML;
                    companyTagDiv = companyTagDiv.firstChild as HTMLDivElement;

                    docFind(Selectors.lc.problem.companies_button.modal_body.tag_num, companyTagDiv).style.background = "#ffa116";
                    docFind(Selectors.lc.problem.companies_button.modal_body.tag_name, companyTagDiv).innerHTML = tag.companyName;
                    docFind(Selectors.lc.problem.companies_button.modal_body.tag_num, companyTagDiv).innerHTML = String(tag.count);

                    companyTagsModalBody.appendChild(companyTagDiv);
                });
                companyTagsModalBody.innerHTML += '<br><br>';
            });
        } catch (e: any) {
            Manager.Logger.warn(ProblemCompanyTagsPremium.name, e);
        }
    }

    async action(_?: MutationRecord[], observer?: MutationObserver): Promise<void> {
        try {
            const btnCompanies = docFind(Selectors.lc.problem.companies_button);
            if (checkDone(btnCompanies)) return;

            const showCompanyTags = this.showCompanyTags.bind(this);

            btnCompanies.addEventListener('click', async function () {
                const interval = setInterval(showCompanyTags, 20);                  // Fix for dynamic layout
                setTimeout(() => clearInterval(interval), 100);
            });

            await this.getProblemContestInfo();
            await this.getCompanyTags();

            // observer?.disconnect();

            Manager.Logger.log("Completed", ProblemCompanyTagsPremium.name);

        } catch (e: any) {
            Manager.Logger.warn(ProblemCompanyTagsPremium.name, e);
        }
    }

    apply(): void {
        // this.action();
        const action = this.action.bind(this);
        mutObserve(Selectors.lc.static_dom.next, action);
    }

    pages = [PageType.PROBLEM];

}