
var Result        = require('./result');
var PID_DNE_CODE  = 'EPERM';

// tryKill :: Int -> Bool
function tryKill(pid) {
  try {
    process.kill(pid, 0);
    return true;

  } catch (e) {
    return false;
  }
}

// isRunning :: Int -> Bool
function isRunning(pid) {
  if (typeof pid !== 'number') {
    throw new Error('Invalid PID');
  }

  return tryKill(pid);
}

module.exports  = isRunning;
