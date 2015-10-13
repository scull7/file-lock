[![Build Status](https://travis-ci.org/scull7/file-lock.svg)](https://travis-ci.org/scull7/file-lock)

# file-lock
A file based locking mechanism for node processes

## Usage

```javascript
var Lock  = require('file-lock');
var lockFilePath  = '/tmp/my-lock'

Lock.obtain(lockFilePath, process.pid)

// All calls to lock functions return a Result( ok:<bool>, msg:<string> )
// object.
.then(function(result) {
  if (result.ok) {
    // ... do stuff with synchronized resources.
  } else {
    throw new Error(result.msg);
  }

  return Lock.release(lockFilePath, process.pid);
})
.then(function(result) {
  if (!result.ok) {
    throw new Error(result.msg);
  }
  else {
    // ... do non-synchronized stuff here.
  }
});
```

### API

#### Lock.obtain :: String -> Int -> Promise Result (Bool, String)

#### Lock.release :: String -> Int -> Promise Result (Bool, String)

#### Lock.hasLock :: String -> Int -> Promise Result (Bool, String)
