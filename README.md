yui-io-mock
===========

>Fake http backend for YUI IO.
>It mocks XHR transport in current version.

## Install
To install just run in a terminal
```
$ bower install yui-io-mock
```

## Getting started
To include mock for YUI IO service, first load the YUI and yui-io-mock seed files if you haven't already loaded it.

```html
<script src="http://yui.yahooapis.com/3.17.2/build/yui/yui-min.js"></script>
<script src="path/to/yui-io-mock.js"></script>
```

Next, create a new YUI instance for your application and populate it with the modules you need by specifying them as
arguments to the YUI().use() method.

```js
    YUI().use('io-base', 'io-mock', function (Y) {
            Y.IOMock
                    .when('test', 'GET')
                    .respond(function (req, res) {
                        res.status = 200;
                        res.data = '{"foo": "bar"}';
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

## API
* __when(url, method)__ defines conditions for a mocking. `url` - url-string (can has RegExp format) or RegExp url pattern; `method` - HTTP request method, if not defined GET is default. Returns `object`:
    * `respond(resultFactory)` - defines a fake backend response for requests matching `when` conditions. `resultFactory` take two parameters:
        - `req` - request object which contains original request parameters;
        - `res` - response object. Here you can setup response parameters such as `status`, `data`, `headers` etc.
    * `pathThrough()` - call this method to pass through the original request. In this case original XHR transport will be used.

## Other
Pull requests are welcome.