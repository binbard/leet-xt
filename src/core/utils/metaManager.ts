import { BrowserType } from "../defines/browserType";
import Manager from "../manager";

class MetaManager {

    static getAppName(): string {
        const manifest = browser.runtime.getManifest();
        return manifest.name;
    }

    static getAppVersionString(){
        const manifest = browser.runtime.getManifest();
        return manifest.version;
    }
    
    static getAppVersionNumber(): number[] {
        const manifest = browser.runtime.getManifest();
        return manifest.version.split('.').map(Number);
    }

    static getAppDescription(): string {
        const manifest = browser.runtime.getManifest();
        return manifest.description || '';
    }

    static async getActivated(): Promise<boolean> {
        const isActivated: boolean = await Manager.Storage.get('activated', true);
        return isActivated;
    }

    static async setActivated(activated: boolean): Promise<void> {
        await Manager.Storage.set('activated', activated);
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