yui-io-mock
===========

>Fake http backend for YUI IO.

## Getting started
To include mock for YUI IO service, first load the YUI seed file if you haven't already loaded it.

`<script src="http://yui.yahooapis.com/3.17.2/build/yui/yui-min.js"></script>`

Next, create a new YUI instance for your application and populate it with the modules you need by specifying them as
arguments to the YUI().use() method. YUI will automatically load any dependencies required by the modules you specify.

```js
    YUI().use('io-base', 'io-mock', function (Y) {
            Y.IOMock
                    .when('test', 'GET')
                    .respond(function (req, res) {
                        res.status = 200;
                        res.data = '{"foo": "bar"}';
                        console.log('invoke result factory', arguments);
                    });
            Y.IOMock
                    .when('iuyo', 'GET')
                    .passThrough();
            Y.io('http://localhost:8000/test', {
                on: {
                    start: function () {console.log('start', arguments);},
                    success: function () {console.log('ok', arguments);},
                    failure: function () {console.error('ups', arguments);},
                    complete: function () {console.log('complete', arguments);},
                    end: function () {console.log('end', arguments);}
                }
            });
            Y.io('http://localhost:8000/iuyo', {
                on: {
                    success: function () {console.log('ok ieoru', arguments);},
                    failure: function () {console.error('ups iweur', arguments);}
                }
            });
        });
```
