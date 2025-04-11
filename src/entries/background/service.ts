import Manager from '@/core/manager';
import { defineProxyService } from '@webext-core/proxy-service';

class BackgroundService {

    console: Console = console;

    browser: typeof browser = browser;

    storage = storage;
    
}

export const [registerBackgroundService, getBackgroundService] = defineProxyService(
    'BackgroundService',
    () => new BackgroundService(),
);
