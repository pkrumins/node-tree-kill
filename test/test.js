var assert = require('assert');
var fork = require('child_process').fork;
var kill = require('tree-kill');

describe('kill()', function(){
    it('should kill a process', function(done){ 
        var p = fork('./test/spin')
        assert.ok(p.pid)

        p.on('exit', function(code, signal){
            assert.ok(code || signal, 'should return an exit code')
            return done()
        });
        kill(p.pid)
    })

    it('should call a callback', function(done){ 
        var p = fork('./test/spin')
        assert.ok(p.pid)

        kill(p.pid, null, function() {
            return done()
        })
    })
})
