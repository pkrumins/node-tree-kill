/**
 * Kills `pid` and all its children
 *
 * @param pid
 * @param signal 'SIGTERM' by default
 * @param callback Called when killing of the entire tree is done, and it's the result
 *   of the platform-specific killing command (see docs).
 */
declare function treeKill(
    pid: number,
    signal: string,
    callback?: (error: Error, stdout: string, stderr: string) => void,
): void;
declare namespace treeKill {}

export = treeKill;
