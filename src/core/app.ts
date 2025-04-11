import Manager from "./manager";
import * as modules from "./modules";

class App {
    constructor() {
        console.log('LeetXt initialized');
    }

    async applyModules() {
        if (await Manager.Meta.getActivated() === false) {
            return;
        }

        const path = window.location.pathname;
        // console.log(path);

        for (const module of Object.values(modules)) {
            const mod = new module();

            if ('blacklist_pages' in mod  && mod.blacklist_pages) {
                console.log('black check 0', mod.blacklist_pages);              // TODO: Never reaches here #debug
                for (const blacklistString of mod.blacklist_pages!!) {
                    const blacklist = new RegExp(blacklistString);

                    console.log('black check');

                    if (blacklist.test(path)) {
                        console.log(`Blacklisted module: ${module.name}`);
                        break;
                    }
                }
            }

            for (const regexString of mod.pages) {
                const regex = new RegExp(regexString);

                // console.log(regex);

                if (regex.test(path)) {
                    console.log(`Applying module: ${module.name}`);

                    mod.apply();
                    break;
                }
            }
        }
    }
}

export default App;