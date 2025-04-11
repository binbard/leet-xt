import PREMIUM_COMPANY_TAGS_BODY_HTML from "@/values/html/premium_company_tags_body.html?raw";

import { docFind, parseHTML } from "@/core/utils/helpers";

function getCompanyTagsModalContentDiv(message: string): HTMLDivElement {
    const div = parseHTML(PREMIUM_COMPANY_TAGS_BODY_HTML);
    const span = docFind("span", div);

    span.textContent = message;

    return div as HTMLDivElement;
}

function getCompanyTagsModalATag(link: string, message: string): HTMLAnchorElement {
    const a = document.createElement("a");
    a.classList.add("text-blue");
    a.classList.add("dark:text-dark-blue");

    a.setAttribute("href", link);

    a.setAttribute("target", "_blank");

    a.textContent = message;

    return a as HTMLAnchorElement;
}

export { getCompanyTagsModalContentDiv, getCompanyTagsModalATag }