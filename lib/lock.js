
var File      = require('./file');
var Result    = require('./result');
var isRunning = require('./is-running');

// isOwner :: String -> Int -> Result(Bool, String)
function isOwner(path, pid) {
  return File.pid(path)

  .then(function(result) {
    if (result.ok) {
      return Result(pid === result.msg, '');
    }

    return result;
  });
}

// isStale :: String -> Result(Bool, String)
function isStale(path) {
  return File.pid(path)

  .then(function(result) {
    if (!result.ok) {
      return Result(true, '');
    }

    if (isRunning(result.msg)) {
      return Result(false, 'Lock is held by PID: ' + result.msg);
    }

    return Result(true, '');
  });
}

// canAccess :: String -> Int -> Result(Bool, String)
function canAccess(path, pid) {
  return File.exists(path)

  .then(function(existsResult) {
    if (existsResult.ok) {
      return isOwner(path, pid)

      .then(function(ownerResult) {
        if (ownerResult.ok) {
          return ownerResult;
        }

        return isStale(path);
      });
    }

    return Result(true, '');
  });
}

// hasLock :: String -> Int -> Result(Bool, String)
function hasLock(path, pid) {
  return File.exists(path)

  .then(function(existsResult) {
    if (existsResult) {
      return isOwner(path, pid);
    }

    return existsResult;
  });
}

// lock :: String -> Int -> Result(Bool, String)
function lock(path, pid) {
  return canAccess(path, pid)

  .then(function(accessResult) {
    if (accessResult.ok) {
      return File.writeLock(path, pid);
    }

    return accessResult;
  });
}

// unlock :: String -> Int -> Result(Bool, String)
function unlock(path, pid) {
  return canAccess(path, pid)

  .then(function(accessResult) {
    if (accessResult.ok) {
      return File.deleteLock(path, pid);
    }

    return accessResult;
  });
}

module.exports  = {
  lock:         lock,
  unlock:       unlock,
  hasLock:      hasLock,
  canAccess:    canAccess,
  isOwner:      isOwner,
  isStale:      isStale,
};
