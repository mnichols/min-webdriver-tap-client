/*
 * min-webdriver-tap-client
 * Original Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 * Copyright (c) 2016 Mike Nichols <nichols.mike.s@gmail.com>
 *
 * @license MIT
 **/

var brout   = require('brout');
module.exports = function create(tape,opts) {

/*global window*/
'use strict';
if(!tape) {
    throw new Error('provide your tape impl')
}
if(!tape.onFinish) {
    throw new Error('`onFinish` callback is required on tape impl')
}
opts = (opts || {});

var logs    = [];
var pending = null;
var failure = false;
var failRE = /^#\sfail\s.(\d)/


function flush() {
  pending(logs.join(''));
  logs.length = 0;
  pending = null;
}

function err(err) {
  logs.push(err);
  failure = true;
  if (pending) {
    flush();
  }
}
function push(str) {
  logs.push(str);
  //detect first `fail` so we can report exit code of 1
  failure = (failure || failRE.test(str))
  if (pending) {
    flush();
  }
}

window._webdriver_poll = function (callback) {
  pending = callback;
  if (logs.length) {
    flush();
  }
};

window._webdriver_manualPoll = function () {
  var str = logs.join('');
  logs = [];
  return str;
};

brout.on('out', push);
//brout.on('err', err);
brout.on('exit', function (code) {
  push('\nWEBDRIVER_EXIT(' + code + ')\n');
});

tape.onFinish(function(results){
    brout.emit('exit',failure ? 1 : 0)
})

return {
    brout: brout
    , tape: tape
}

};
