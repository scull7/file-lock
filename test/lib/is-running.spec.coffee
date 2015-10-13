
assert    = require 'assert'
isRunning = require '../../lib/is-running'
PID_MAX   = 99999

describe 'isRunning Function', ->

  it 'should return true when the given PID represents a running process', ->

    # we should always be running, at least I think so.
    pid = process.pid

    assert.equal isRunning(pid), true

  it 'should return false when the given PID is not found', ->

    pid = PID_MAX

    assert.equal isRunning(pid), false
