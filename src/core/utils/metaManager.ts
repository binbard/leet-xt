import { BrowserType } from "../defines/browserType";
import Config from "@/values/config"

class MetaManager {

    static async getActivated(): Promise<boolean> {
        const isActivated: boolean = await storage.getItem('local:activated', { fallback: true });
        return isActivated;
    }

    static async setActivated(activated: boolean): Promise<void> {
        await storage.setItem('local:activated', activated);
    }

    static async getBrowser(): Promise<BrowserType> {
        const userAgent = navigator.userAgent;

        if (userAgent.includes(BrowserType.Firefox)) {
            return BrowserType.Firefox;
        } else if (userAgent.includes(BrowserType.Chrome)) {
            return BrowserType.Chrome;
        }
        return BrowserType.Other;
    }
    
}

export { MetaManager };