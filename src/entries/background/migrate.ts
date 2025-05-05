import Manager from "@/core/manager";
import { FriendManager } from "@/core/utils/friendManager";

function getVersionDiff(a: number[], b: number[]): number {
    const maxLength = Math.max(a.length, b.length);
    let totalDifference = 0;

    for (let i = 0; i < maxLength; i++) {
        const numA = a[i] ?? 0;
        const numB = b[i] ?? 0;
        const diff = numA - numB;

        if (diff !== 0) {
            totalDifference += diff * Math.pow(1000, maxLength - i - 1);
        }
    }

    return totalDifference;
}

async function isMigrationNeeded(previous_version: string): Promise<boolean> {
    const currentVersion = Manager.Meta.getAppVersionNumber();

    const previousVersion = getVersionNumber(previous_version);

    let shouldMigrate = getVersionDiff(currentVersion, previousVersion) > 0;
    if (!shouldMigrate) return false;

    shouldMigrate = getApplicableMigration(migrations, previousVersion) !== null;

    return shouldMigrate;
}

const migrations: Record<string, () => Promise<void>> = {
    "1.0.4": async () => {
        // Migration logic till version 1.0.4

        const OLD_FRIENDS_LOC = 'myfriends';

        const currentFriends = await Manager.Storage.get(FriendManager.FRIENDS_LOC, []);

        const data = await browser.storage.local.get([OLD_FRIENDS_LOC]);
        const oldFriends: string[] = Array.isArray(data.myfriends) ? data.myfriends : [];

        const mergedFriends = [...new Set([...currentFriends, ...oldFriends])];

        await Manager.Storage.set(FriendManager.FRIENDS_LOC, mergedFriends);
        await browser.storage.local.remove([OLD_FRIENDS_LOC]);

        await Manager.Storage.set('migration_done', true);
    }
};

function getVersionNumber(version: string): number[] {
    return version.split('.').map(Number);
}

// Get the earliest applicable migration version
function getApplicableMigration(
    migrations: Record<string, () => Promise<void>>,
    previousVersion: number[]
): string | null {
    const applicableVersions = Object.keys(migrations)
        .map(v => getVersionNumber(v))
        .filter(v => getVersionDiff(v, previousVersion) >= 0)
        .sort(getVersionDiff);

    if (applicableVersions.length === 0) return null;
    const earliest = applicableVersions[0];
    return earliest.join('.') as keyof typeof migrations;
}

async function runMigration(): Promise<{ migrationVersion: string | null }> {
    const previous_version = await Manager.Storage.get('previous_version', '0.0.0');
    const previousVersion = getVersionNumber(previous_version);
    const migrationVersion = getApplicableMigration(migrations, previousVersion);

    Manager.Logger.info('BG', `MXMX PREV => ${previousVersion}`);

    if (!migrationVersion) return {migrationVersion: null};
    const migration = migrations[migrationVersion];

    if (migration) {
        await migration();
    }

    return {migrationVersion};
}

export { isMigrationNeeded, runMigration };