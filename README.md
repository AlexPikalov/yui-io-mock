yui-io-mock
===========

>Fake http backend for YUI IO.

## Getting started
To include mock for YUI IO service, first load the YUI seed file if you haven't already loaded it.

`<script src="http://yui.yahooapis.com/3.17.2/build/yui/yui-min.js"></script>`

Next, create a new YUI instance for your application and populate it with the modules you need by specifying them as
arguments to the YUI().use() method. YUI will automatically load any dependencies required by the modules you specify.

```js
    mockProcessor
            .when('backend', 'GET')
            .respond(function (req, res) {
                res.status = 200;
                res.data = '{"foo": "bar"}';
            });
    XHR.ajax({
        method: 'GET',
        url: 'http://backend',
        data: {foo: 'bar'},
        success: function () {
            console.log('ok!', arguments);
        },
        fail: function () {
            console.log('fail!', arguments);
        }
    });

```
