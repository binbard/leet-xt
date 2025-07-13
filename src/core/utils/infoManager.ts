import Manager from "../manager";
import { docFindById } from "./helpers";

class InfoManager {
    static nextDataQuery: Record<string, any> | null = null;

    static ensureNextData() {
        if (this.nextDataQuery === null) {
            this.nextDataQuery = {};

            try {
                const ndScriptTag = docFindById('__NEXT_DATA__');
                this.nextDataQuery = JSON.parse(ndScriptTag.textContent || '{}');
                this.nextDataQuery = this.nextDataQuery?.props?.pageProps?.dehydratedState?.queries || {};
            } catch (e: any) {
                Manager.Logger.warn('Error parsing __NEXT_DATA__ JSON:', e);
            }
        }
    }

    static getQuestionData() {
        this.ensureNextData();
        const questionDetail = this.nextDataQuery?.find((q: any) => q.queryKey[0] === "questionDetail");
        const questionData = questionDetail?.state?.data?.question || {};
        return questionData;
    }

}

export { InfoManager };