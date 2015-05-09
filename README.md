Tree Kill
=========

Kill all processes in the process tree, including the root process.

Example
=======

Kill all the children processes of the process with pid `1`, including the process with pid `1` itself:
```js
var kill = require('tree-kill');
kill(1, 'SIGKILL');
```

Supports callbacks with error handling:
```js
var kill = require('tree-kill');
kill(1, 'SIGKILL', function(err) {
    // Do things
});
```


Methods
=======

## require('tree-kill')(pid, [signal], [callback]);

Sends signal `signal` to all children processes of the process with pid `pid`, including `pid`. Signal defaults to `SIGTERM`.

For Linux, this uses `ps -o pid --no-headers --ppid PID` to find the parent pids of `PID`.

For Windows, this uses `'taskkill /pid PID /T /F'` to kill the process tree.

Install
=======

With [npm](https://npmjs.org) do:

```
npm install tree-kill
```

License
=======

MIT
