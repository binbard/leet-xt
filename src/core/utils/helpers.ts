import { BuildMode } from "../defines/buildModes";
import { RequestMethod } from "../defines/requestMethod";
import { Result } from "../defines/result";
import Config from "@/values/config";
import Manager from "../manager";
import { ResponseType } from "../defines/responseType";

function getBuildMode(): BuildMode {
    switch (import.meta.env.MODE) {
        case 'development': return BuildMode.DEV;
        case 'production': return BuildMode.PROD;
        case 'test': return BuildMode.TEST;
        case 'staging': return BuildMode.STAGE;
        default: return BuildMode.DEV;
    }
}

function mutObserve(element: Element | string | null, callback: MutationCallback): MutationObserver | null {
    const node = typeof element === 'string' ? document.querySelector(element) : element;
    if (!node) {
        // Manager.Logger.warn('Selector not found', element);
        return null;
    }
    const observer = new MutationObserver((mutations, observer) => {
        callback(mutations, observer);
        // observer.disconnect();
    });
    observer.observe(node, { childList: true, subtree: true });
    return observer;
}

function getStringValue(val: number | string, defaultValue = Config.Strings.NA): string {
    return val === -1 ? defaultValue : val.toString();
}

function docFind(selector: string | object, parentElement?: Element | Document | null, supressError = false): HTMLElement {
    if (parentElement === undefined) parentElement = document;
    if (parentElement === null) {
        throw new Error('Parent element is null');
    }
    if (typeof selector === 'object') {
        //@ts-ignore
        if (selector.self) selector = selector.self;
        else {
            throw new Error('Selector must be a string');
        }
    }
    const element = parentElement.querySelector(selector as string);
    if (!element && !supressError) {
        throw new Error(`Element not found: ${selector}`);
    }
    return element as HTMLElement;
}

function docFindById(selectorId: string | object, parentElement?: Element | Document): HTMLElement {
    const selector = '#' + selectorId;
    return docFind(selector, parentElement);
}

function clearAllChildren(element: Element) {
    element.innerHTML = '';
}

function slugify(str: string): string {
    return str
        .toLowerCase()                   
        .trim()                         
        .replace(/[\s\W-]+/g, '-')       // Replace spaces and non-word chars with hyphen
        .replace(/^-+|-+$/g, '');        // Remove leading/trailing hyphens
}

function parseHTML(htmlText: string, full: boolean = false): HTMLElement {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    return doc.body.firstChild as HTMLElement;
}

function parseDocument(htmlText: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(htmlText, 'text/html');
}

function checkDone(element: Element): boolean {
    const done = element.classList.contains('done');
    if (!done) {
        element.classList.add('done');
    }
    return done;
}

function getUrl(url: string) {
    return Config.App.PROXY_URL + url;
}

async function doFetch(url: string, config: RequestInit, timeout = Config.App.DEFAULT_NETWORK_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...config, signal: controller.signal });
        return response;
    } catch (error: any) {
        if (error.name === "AbortError") {
            throw Result.TIMEOUT;
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function makeRequest(url: string, data?: Object, responseType?: ResponseType): Promise<any> {
    const method = data ? RequestMethod.POST : RequestMethod.GET;
    data = data || {};
    try {
        let config: RequestInit = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        if (method === RequestMethod.POST) config.body = typeof data === 'string' ? data : JSON.stringify(data);
        const response = await doFetch(url, config);
        if (!response.ok) {
            Manager.Logger.warn('makeRequest', response);
            throw Result.INVALID;
        }
        switch (responseType) {
            case ResponseType.BLOB:
                return await response.blob();
            case ResponseType.TEXT:
                return await response.text();
            case ResponseType.JSON:
                return await response.json();
            default:
                return await response.json();
        }
    } catch (error: any) {
        Manager.Logger.error('makeRequest', error.stack);
        throw Result.ERROR;
    }
}

export {
    getBuildMode,
    mutObserve,
    getStringValue,
    docFind,
    docFindById,
    clearAllChildren,
    slugify,
    parseHTML,
    parseDocument,
    checkDone,
    getUrl,
    makeRequest
};