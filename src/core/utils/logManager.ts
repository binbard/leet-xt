import { BuildMode } from "../defines/buildModes";
import { getBuildMode } from "./helpers";

type Message = string | object | any[];

class LogManager {

    /**
     * Following will be for development mode only
     * @param tag - The tag to be used for logging
     * @param message - The message to be logged
     */

    static log(tag: string, message: Message) {
        if (getBuildMode() !== BuildMode.DEV) return;
        
        console.log(`[LX #${tag}] ${message}`);
    }

    static warn(tag: string, message: Message) {
        if (getBuildMode() !== BuildMode.DEV) return;

        console.warn(`[LX #${tag}] ${message}`);
    }

    /**
     * Following will be for development and production mode
     * @param tag - The tag to be used for logging
     * @param message - The message to be logged
     */

    static info(tag: string, message: Message) {
        console.info(`[LX #${tag}] ${message}`);
    }

    static error(tag: string, message: Message) {
        console.error(`[LX #${tag}] ${message}`);
    }
}

export { LogManager };