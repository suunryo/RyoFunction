function Promise2(fn) {
    if (typeof fn !== "function") {
        throw new Error("not function");
    }
    
    this._state = "pending";
    this._result = null;

    this.onFulfilled = [];
    this.onRejected = undefined;
    this.onFinished = undefined;

    var _this = this;

    function _resolve(result) {
        if (_this._state === "pending") {
            _this._state = "fulfiled";
        }
        
        _this._result = result;

        var cb = _this.onFulfilled.shift();

        if (!cb) {
            if (_this.onFinished) {
                _this.onFinished();
            }
            return;
        }
        setTimeout(function() {
            var newResult = cb(result);

            if (_this.onFulfilled.length > 0) {
                _resolve(newResult);
            }
            
            if (_this.onFinished && _this.onFulfilled.length <= 0) {
                _this.onFinished(err);
            }
        })
    }

    function _reject(err) {
        if (_this._state === "pending") {
            _this._state = "rejected";
        }
        this._result = err;
        
        if (_this.onRejected) {
            _this.onRejected(err);
        }
        if (_this.onFinished) {
            _this.onFinished(err);
        }
    }

    try {
        fn(_resolve, _reject);
    } catch (err) {
        this._result = err;
        _reject(err);
    }
   
}

Promise2.prototype.then = function(callback) {
    if (this._state === "fulfilled) {
        callback(this._result);
        return;
    }
    
    this.onFulfilled.push(callback);
    return this;
}

Promise2.prototype.catch = function(callback) {
    if (this._state === "rejected) {
        callback(this._result);
        return;
    }

    this.onRejected = callback;
    return this;
}

Promise2.prototype.finally = function(callback) {
    this.onFinished = callback;
    return this;
}
