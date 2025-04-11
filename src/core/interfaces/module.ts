import { PageType } from "../defines/pageType";

export interface IModule {

    // apply is a method that is called when the module is loaded
    apply(): void;

    // action is a method that is called when the module is executed
    action(): void;

    // enabled is a property that can be used to enable or disable the module
    enabled?: boolean;

    // pages is a property that can be used to specify the pages on which the module should be loaded
    pages: PageType[]

    // blacklist_pages is a property that can be used to specify the pages on which the module should not be loaded
    blacklist_pages?: PageType[]

}