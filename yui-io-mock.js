YUI.add('io-mock', function (Y, NAME) {
    Y.IOMock = {
        _callbacks: [],

        when: function (url, method) {
            if (!url || typeof url !== 'string' || !(url.multiline && url.ignoreCase && url.global)) {
                throw new Error('URL is required and should be a string or regexp');
            }
            var callbackItem = {
                method: method || 'GET',
                url: typeof url === 'string' ? new RegExp(url) : url,
                passedThrough: false,
                respond: function (resultFactory) {
                    if (this.passedThrough) {
                        throw new Error('');
                    }
                    this.resultFactory = resultFactory
                },
                passThrough: function () {
                    this.passedThrough = true;
                }
            };

            this._callbacks.push(callbackItem);

            return callbackItem;
        },

        findCallbacks: function (method, url) {
            var i,
                length = this._callbacks.length,
                callbacks = [];

            for (i = 0; i < length; i++) {
                var c = this._callbacks[i];
                if (c.method === method && c.url.test(url)) {
                    callbacks.push(c);
                }
            }

            return callbacks;
        },

        mockOriginalXHR: function () {
            var self = this,
                originalTransport = Y.io,
                p;
            self._originalXhrTransport = Y.IO.transports.xhr;
            Y.io = function (uri, config) {
                var isPassedThrough = self.findCallbacks(config.method || 'GET', uri).pop().passedThrough;
                if (!isPassedThrough) {
                    Y.IO.transports.xhr = function () {
                        return new XMLHttpRequestMock();
                    };
                } else {
                    Y.IO.transports.xhr = self._originalXhrTransport;
                }
                for (p in originalTransport) {
                    if (originalTransport.hasOwnProperty(p) && !Y.io[p]) {
                        Y.io[p] = originalTransport[p];
                    }
                }
                originalTransport(uri, config);
            };
        }
    };

    Y.IOMock.mockOriginalXHR();

    var ReadyStates = {
        UNSET: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    };

    function XMLHttpRequestMock () {
        var self = this;
        
        self.onabort = null;
        self.onerror = null;
        self.onload = null;
        self.onloadend = null;
        self.onloadstart = null;
        self.onprogress = null;
        self.onreadystatechange = null;
        self.ontimeout = null;
        self.readyState = ReadyStates.UNSET;
        self.response = "";
        self.responseText = "";
        self.responseType = "";
        self.responseXML = null;
        self.status = 0;
        self.statusText = "";
        self.timeout = 0;

        self._responseHeaders = {};
        self._requestHeaders = {};
        self._request = null;
        self._response = null;
    }

    XMLHttpRequestMock.prototype._invokeOnreadystatechange = function () {
        if (typeof this.onreadystatechange === 'function') {
            this.onreadystatechange();
        }
    };

    XMLHttpRequestMock.prototype.abort = function () {

    };

    XMLHttpRequestMock.prototype.getAllResponseHeaders = function () {
        return this._response.headers;
    };

    XMLHttpRequestMock.prototype.getResponseHeader = function (header) {
        return this._request.headers[header];
    };

    XMLHttpRequestMock.prototype.open = function (method, url, async, user, password) {
        // url regexp source http://regexlib.com/REDetails.aspx?regexp_id=96
        var urlRegExp = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
            self = this;
        if (!method || !url) {
            throw new Error('Both parameters "method" and "url" are required');
        }

        // NOTE: Ignored for non-HTTP(S) URLs
        if (!urlRegExp.test(url)) {
            throw new Error('URL should has HTTP(S) format');
        }

        self._request = {};
        var req = self._request;

        req.method = method.toUpperCase();
        req.url = url;
        req.async = async || true;
        req.user = user || '';
        req.password = password || '';

        // ready state 1
        self.readyState = ReadyStates.OPENED;
        self._invokeOnreadystatechange();
    };

    XMLHttpRequestMock.prototype.overrideMimeType = function (mimetype) {
        // TODO
    };

    XMLHttpRequestMock.prototype.send = function (data) {
        var self = this;
        if (!self._request) {
            return;
        }
        if (typeof data !== 'string') {
            throw new Error('Data should be a string');
        }
        self._request.data = data;
        var lastCallback = Y.IOMock.findCallbacks(self._request.method, self._request.url).pop();
        if (!lastCallback) {
            throw new Error('There are no callbacks matching the request');
        }
        if (self._request.async) {
            setTimeout(function () {
                self._result = {};
                lastCallback.resultFactory(self._request, self._result);
                responseProcessor(self._result);
            }, 0);
        } else {
            self._result = {};
            lastCallback.resultFactory(self._request, self._result);
            responseProcessor(self._result);
        }

        function responseProcessor (result) {
            result.headers = result.headers || {};

            // ready HEADERS_RECEIVED
            var responseHeaders = result.headers,
                h;

            responseHeaders['Content-Type'] = 'application/json';
            for (h in result.headers) {
                if (result.headers.hasOwnProperty(h)) {
                    responseHeaders[h] = result.headers[h];
                }
            }
            self.readyState = ReadyStates.HEADERS_RECEIVED;
            self._invokeOnreadystatechange();

            // ready LOADING
            self.readyState = ReadyStates.LOADING;
            if (self.onloadstart) {
                self.onloadstart();
            }
            if (self.onloadend) {
                self.onloadend();
            }
            if (self.onload) {
                self.onload();
            }
            self._invokeOnreadystatechange();

            // state DONE
            self._response = result;

            self.status = result.status || 200;
            self.responseType = result.type || 'text';
            self.responseText = result.data || '';

            // parse a response data according to its type
//        switch (result.type) {
//            case 'text':
//                self.response = result.data || '';
//                break;
//            case 'blob':
//                // TODO:
//                break;
//            case 'document':
//                // TODO:
//                break;
//            case 'json':
//                self.response = JSON.parse(self.response || '');
//                break;
//            default:
//                self.response = result.data || '';
//        }
            self.readyState = result.readyState || ReadyStates.DONE;
            self._invokeOnreadystatechange();
        }
    };

    XMLHttpRequestMock.prototype.setRequestHeader = function (header, value) {
        var self = this;
        self._request.headers = self._request.headers || {};
        self._request.headers[header] = value;
    };
}, "0.0.0", {"requires": ["io", "log"]});