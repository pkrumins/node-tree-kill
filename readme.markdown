Tree Kill
=========

Kill all processes in the process tree, including the root process.

Example
=======

```js
var kill = require('tree-kill');
kill(1, 'SIGKILL');
```

In this example we kill all the children processes of the process with pid `1`, including the process with pid `1` itself.

Methods
=======

## require('tree-kill')(pid, [signal]);

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
