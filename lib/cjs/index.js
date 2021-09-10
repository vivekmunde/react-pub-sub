"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSubscribe = exports.subscribe = exports.publish = exports.createPublication = void 0;
var react_1 = __importDefault(require("react"));
var pusu_1 = require("pusu");
exports.createPublication = pusu_1.createPublication;
exports.publish = pusu_1.publish;
exports.subscribe = pusu_1.subscribe;
var withSubscribe = function (Component) {
    return /** @class */ (function (_super) {
        __extends(Subscribe, _super);
        function Subscribe() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.subscriptions = [];
            _this.rpSubscribe = function (publication, subscriber) {
                var unsubscribe = (0, pusu_1.subscribe)(publication, subscriber);
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
            return react_1.default.createElement(Component, __assign({}, this.props, { subscribe: this.rpSubscribe }));
        };
        return Subscribe;
    }(react_1.default.Component));
};
exports.withSubscribe = withSubscribe;
//# sourceMappingURL=index.js.map