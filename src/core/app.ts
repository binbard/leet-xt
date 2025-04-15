import Manager from "./manager";
import * as modules from "./modules";

class App {
    constructor() {
        Manager.Logger.log(App.name, 'LeetXt initialized');
    }

    async applyModules() {
        if (await Manager.Meta.getActivated() === false) {
            return;
        }

        const path = window.location.pathname;
        // Manager.Logger.log(path);

        for (const module of Object.values(modules)) {
            const mod = new module();

            if ('blacklist_pages' in mod  && mod.blacklist_pages) {
                for (const blacklistString of mod.blacklist_pages!!) {
                    const blacklist = new RegExp(blacklistString);

                    if (blacklist.test(path)) {
                        Manager.Logger.log(App.name, `Blacklisted module: ${module.name}`);
                        break;
                    }
                }
            }

            for (const regexString of mod.pages) {
                const regex = new RegExp(regexString);

                // Manager.Logger.log(regex);

                if (regex.test(path)) {
                    Manager.Logger.log(App.name, `Applying module: ${module.name}`);

                    mod.apply();
                    break;
                }
            }
        }
    }
}

export default App;