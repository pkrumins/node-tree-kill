// examples of valid usage
// importing just the type definitions, not the actual code
import * as kill from '../index.d';


kill(1);
kill(1, 9);
kill(1, 'SIGKILL');
kill(1, 'SIGKILL', () => {
    console.log('done');
});
kill(1, 'SIGKILL', (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('done');
});
