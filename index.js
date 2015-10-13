
var lockFile    = require('./lib/lock-file');

function _pFactory(fn, path, pid) {
    
    return function(cb) {
        return fn(path, pid)
        
        .then(function(result) {
            if (typeof cb === 'function') {
                return cb(result.msg, result.ok);
            }
            
            if (!result.ok) throw new Error(result.msg);
            
            return result;
        });
    };
}

module.exports  = function LockFileFactory (path, pid) {
    
    return {
        obtain  : _pFactory(lockFile.lock, path, pid)
    ,   release : _pFactory(lockFile.unlock, path, pid)
    };
}