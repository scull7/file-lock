
var lockFile    = require('./lib/lock');

// (String -> Int -> Result(Bool, String)) -> String -> Int ->
//    (Maybe (Error -> Bool -> undefined) -> Result(Bool, String))
function _pFactory(fn) {

  return function(path, pid, cb) {
    return fn(path, pid)

    .then(function(result) {
        if (typeof cb === 'function') {
          return cb(result.msg, result.ok);
        }

        return result;
      });
  };
}

// LockFileFactory :: String -> Int -> LockFile
module.exports  = {
  obtain:   _pFactory(lockFile.lock),
  release:  _pFactory(lockFile.unlock),
  hasLock:  _pFactory(lockFile.hasLock),
};
