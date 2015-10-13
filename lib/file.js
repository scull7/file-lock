/**
 * File access interface.
 */
var fs          = require('fs');
var Result      = require('./result');

var FILE_OPTS   = {
  encoding: 'utf8',
};

function _handlerFactory(resolve) {
  return function(err) {
    if (err) {
      resolve(Result(false, err.message));
    } else {
      resolve(Result(true, ''));
    }
  };
}

function fPid(path) {
  return new Promise(function(resolve) {
    fs.readFile(path, FILE_OPTS, function(err, data) {
      var result;

      if (err) {
        result   = Result(false, err.message);
      } else {
        result   = Result(true, parseInt(data, 10));
      }

      resolve(result);
    });
  });
}

function fExists(path) {
  return new Promise(function(resolve) {
    fs.access(path, fs.R_OK, _handlerFactory(resolve));
  });
}

function fWriteLock(path, pid) {
  return new Promise(function(resolve) {
    fs.writeFile(path, pid, FILE_OPTS, _handlerFactory(resolve));
  });
}

function fDeleteLock(path) {
  return new Promise(function(resolve) {
    fs.unlink(path, _handlerFactory(resolve));
  });
}

module.exports  = {
  exists:         fExists,
  pid:            fPid,
  writeLock:      fWriteLock,
  deleteLock:     fDeleteLock,
};
