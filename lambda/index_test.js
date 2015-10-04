var assert = require('assert');
var index = require('./index');

process.on('exit', function(code) {
  console.log(code == 0 ? 'OK' : 'FAILED');
});

var assertResult = function(result) {
  process.exitCode = 0;
  assert(result);
  assert.equal(result.request_id, '<requestid>');
  var env = result.stdout.split('\n');
  assert(env.indexOf('TMPDIR=/tmp/<requestid>/tmp') >= 0);
  assert(env.indexOf('HOME=/tmp/<requestid>/home') >= 0);
  assert(env.indexOf('REQUEST_ID=<requestid>') >= 0);
};
process.exitCode = 1; // fails if not called

var event = {
  'command': 'env'
};

var context = {
  awsRequestId: '<requestid>',
  invokeid: '<invokeid>',
  succeed: assertResult,
  fail: function(err) {
    throw err;
  },
  done: function(err, result) {
    assert.ifError(err);
    assertResult(result);
  }
};

index.handler(event, context);
