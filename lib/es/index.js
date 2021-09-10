var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { createPublication as pusuCreatePublication, publish as pusuPublish, subscribe as pusuSubscribe, } from 'pusu';
export var createPublication = pusuCreatePublication;
export var publish = pusuPublish;
export var subscribe = pusuSubscribe;
export var withSubscribe = function (Component) {
    return /** @class */ (function (_super) {
        __extends(Subscribe, _super);
        function Subscribe() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.subscriptions = [];
            _this.rpSubscribe = function (publication, subscriber) {
                var unsubscribe = pusuSubscribe(publication, subscriber);
                _this.subscriptions.push(unsubscribe);
                return unsubscribe;
            };
            _this.unsubscribeAll = function () {
                _this.subscriptions.forEach(function (it) { return it(); });
            };
            return _this;
        }
        Subscribe.prototype.componentWillUnmount = function () {
            this.unsubscribeAll();
        };
        Subscribe.prototype.render = function () {
            return React.createElement(Component, __assign({}, this.props, { subscribe: this.rpSubscribe }));
        };
        return Subscribe;
    }(React.Component));
};
//# sourceMappingURL=index.js.map