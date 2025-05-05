import { BrowserType } from "../defines/browserType";

class StorageManager {

    static async get<T>(key: string, fallback: T): Promise<T> {
        const value = await storage.getItem(`local:${key}`);
        return (value ?? fallback) as T;
    }    

    static async set(key: string, value: any): Promise<void> {
        await storage.setItem(`local:${key}`, value);
    }

    static async remove(key: string): Promise<void> {
        await storage.removeItem(`local:${key}`);
    }

}

export { StorageManager };