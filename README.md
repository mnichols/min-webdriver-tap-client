# min-webdriver-tap-client

The client found in [min-webdriver](https://github.com/mantoni/min-webdriver) is only included when using 
it as a browserify plugin. Furthermore, tests will hang if you are using TAP output.
This client can be thrown at the top of your tests bundle which is piped into `min-wb`.

## Install

`npm install min-webdriver-tap-client`

## Usage


```js
//spec-support.js

const mwtc = require('min-webdriver-tap-client')
const tape = require('blue-tape')
mwtc(tape) // returns {brout,tape }
```



