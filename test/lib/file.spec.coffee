
fs        = require 'fs'
assert    = require 'assert'
File      = require '../../lib/file.js'

_ts       = -> (new Date()).getTime()
_getPath  = (name) -> "/tmp/#{name}-#{_ts()}"

notFoundRegExp  = (path) -> new RegExp("ENOENT.*access\\s'#{path}'")

describe 'File Interface', ->

  describe '::exists', ->

    it 'should respond with a Result(false, String) when a file is not found',
    ->

      dnePath   = _getPath 'does-not-exist'

      File.exists(dnePath).then (actual) ->
        assert.equal actual.ok, false
        assert.equal notFoundRegExp(dnePath).test(actual.msg), true

    it 'should respond with a Result(true, \'\') when a file exists', ->

      path      = _getPath 'does-exist'
      expected  =
        ok      : true
        msg     : ''

      File.writeLock path, 1234
      .then -> File.exists(path)
      .then (actual) -> assert.deepEqual actual, expected
      .then -> File.deleteLock path

  describe '::pid', ->

    it 'should return a Result(true, Int) for a valid lock file.', ->

      path      = _getPath 'test-get-pid'
      expected  =
        ok      : true
        msg     : 1234

      File.writeLock path, 1234
      .then -> File.pid(path)
      .then (actual) -> assert.deepEqual actual, expected
      .then -> File.deleteLock path

  describe '::deleteLock', ->

    it 'should remove (unlink) the lock file at the given path', ->

      path      = _getPath 'test-delete'
      expected  =
        ok      : true
        msg     : ''

      File.writeLock path, 1234
      .then -> File.deleteLock path
      .then (actual) -> assert.deepEqual actual, expected
      .then -> File.exists(path)
      .then (actual2) ->
        assert.equal actual2.ok, false
        assert.equal notFoundRegExp(path).test(actual2.msg), true
