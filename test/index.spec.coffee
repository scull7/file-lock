
fs        = require 'fs'
assert    = require 'assert'
{ spawn } = require 'child_process'
Lock      = require '../index'

_ts       = -> (new Date()).getTime()
_getPath  = (name) -> "/tmp/#{name}-#{_ts()}"

describe "File Lock Module", ->

  it "should allow the current process to lock a file", ->

    pid       = process.pid
    path      = _getPath('test-lock')
    expected  =
      ok      : true
      msg     : ''


    Lock.obtain(path, pid)

    .then (actual) -> assert.deepEqual actual, expected

    .then -> fs.unlink path, (err) ->
      if err then throw err else return true

  it 'should allow the lock owner to release a lock', ->

    pid       = process.pid
    path      = _getPath('test-lock')
    expected  =
      ok      : true
      msg     : ''

    Lock.obtain(path, pid)

    .then (actual) -> assert.deepEqual actual, expected

    .then -> Lock.release(path, pid)

    .then (actual) -> assert.deepEqual actual, expected

    .then -> fs.access path, fs.R_OK, (err) ->
      if not err then throw new Error('File not cleaned up') else return true

  it 'should not allow a process to release a lock it does not own.', ->

    grep      = spawn 'grep', ['ssh']
    path      = _getPath('test-lock')
    pid       = process.pid
    expected  =
      ok      : false
      msg     : "Lock is held by PID: #{grep.pid}"

    Lock.obtain(path, grep.pid)

    .then -> Lock.obtain(path, pid)

    .then (actual) -> assert.deepEqual actual, expected

    .then -> Lock.release(path, grep.pid)


  it 'should allow a process to lock a stale lock it does not own.', ->

    stalePid  = 99999
    pid       = process.pid
    path      = _getPath('test-lock')
    expected  =
      ok      : true
      msg     : ''

    hasLockExpected =
      ok      : false
      msg     : ''

    Lock.obtain(path, stalePid)

    .then -> Lock.hasLock(path, pid)

    .then (hasLock) -> assert.deepEqual hasLock, hasLockExpected

    .then -> Lock.obtain(path, pid)

    .then (actual) -> assert.deepEqual actual, expected

    .then -> Lock.release(path, pid)
