var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
var once = require('once');
var isWindows = process.platform === 'win32';
var isDarwin = process.platform === 'darwin';
var isSunOS = process.platform === 'sunos';

module.exports = function (pid, signal, callback) {
    if (isWindows) {
        exec('taskkill /pid ' + pid + ' /T /F', callback);
    } else {
        var tree = {};
        tree[pid] = [];
        var pidsToProcess = {};
        pidsToProcess[pid] = 1;
        buildProcessTree(pid, tree, pidsToProcess, function () {
            try {
                killAll(tree, signal);
            }
            catch (err) {
                if (callback) {
                    return callback(err);
                } else {
                    throw err;
                }
            }
            if (callback) {
                return callback();
            }
        });
    }
}

function killAll (tree, signal) {
    var killed = {};
    Object.keys(tree).forEach(function (pid) {
        tree[pid].forEach(function (pidpid) {
            if (!killed[pidpid]) {
                killPid(pidpid, signal);
                killed[pidpid] = 1;
            }
        });
        if (!killed[pid]) {
            killPid(pid, signal);
            killed[pid] = 1;
        }
    });
}

function killPid(pid, signal) {
    try {
        process.kill(parseInt(pid, 10), signal);
    }
    catch (err) {
        if (err.code !== 'ESRCH') throw err;
    }
}

function buildProcessTree (parentPid, tree, pidsToProcess, cb) {
    var ps;

    if (isDarwin || isSunOS) {
        // In Darwin and SunOS, we're missing the parent pid and no-headers options
        if (isDarwin) {
            ps = spawn('ps', ['ax', '-o', 'ppid,pid']);
        } else {
            ps = spawn('ps', ['-A', '-o', 'ppid,pid']);
        }
    } else {
        ps = spawn('ps', ['-o', 'pid', '--no-headers', '--ppid', parentPid]);
    }

    var allData = '';
    ps.stdout.on('data', function (data) {
        var data = data.toString('ascii');
        allData += data;
    });

    var onExitClose = once(function (code) {
        delete pidsToProcess[parentPid];

        var pids = [];

        // Note: Darwin and SunOS always return 0, but the result is always something
        // we can safely parse in here. In Linux, we can get back 1 because we explicitly
        // ask for a given ppid child process listing, where an empty list returns code 1.
        if (code === 0) {
            if (isDarwin || isSunOS) {
                // A header, followed by lines containing two columns: parentPid, pid.
                pids = allData
                    .split('\n')
                    // skip the header that ps draws
                    .filter(function (line, i) { return i !== 0; })
                    // trim line and pair into parent, child pairs
                    .map(function (line) {
                        // Example line output:
                        // ' 1826  1829'
                        var tokens = line.trim().split(' ');
                        return [parseInt(tokens[0], 0), parseInt(tokens.pop(), 10)];
                    })
                    .filter(function (pids) {
                        // match the children that belong to parentPid
                        return pids[0] === parseInt(parentPid, 10);
                    })
                    .map(function (pids) {
                        // map to a list of child pids
                        return pids[1];
                    });
            } else {
                // No header, and one column of pids only (belonging to parentPid).
                // Note: if if we have code 0, then we have children to iterate through.
                pids = allData.split('\n').map(function (pid) {
                    return parseInt(pid.trim(), 10);
                });
            }
        }

        if (pids.length > 0) {
            pids.forEach(function (pid) {
                tree[parentPid].push(pid)
                tree[pid] = [];
                pidsToProcess[pid] = 1;
                buildProcessTree(pid, tree, pidsToProcess, cb);
            });
        } else {
            // no more parent processes
            if (Object.keys(pidsToProcess).length == 0) {
                cb();
            }
        }
    });

    ps.on('exit', onExitClose);
    ps.on('close', onExitClose);
}
