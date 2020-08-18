"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.RegistrationError = exports.LoginError = exports.SyntaxError = void 0;
var apollo_server_1 = require("apollo-server");
var SyntaxError = /** @class */ (function (_super) {
    __extends(SyntaxError, _super);
    function SyntaxError(message) {
        var _this = _super.call(this, message, 'GRAPHQL_PARSE_FAILED') || this;
        Object.defineProperty(_this, 'name', { value: 'SyntaxError' });
        return _this;
    }
    return SyntaxError;
}(apollo_server_1.ApolloError));
exports.SyntaxError = SyntaxError;
var LoginError = /** @class */ (function (_super) {
    __extends(LoginError, _super);
    function LoginError(message) {
        var _this = _super.call(this, message, 'LOGIN FAILED') || this;
        Object.defineProperty(_this, 'name', { value: 'LoginError' });
        return _this;
    }
    return LoginError;
}(apollo_server_1.ApolloError));
exports.LoginError = LoginError;
var RegistrationError = /** @class */ (function (_super) {
    __extends(RegistrationError, _super);
    function RegistrationError(message) {
        var _this = _super.call(this, message, 'REGISTRATION FAILED') || this;
        Object.defineProperty(_this, 'name', { value: 'RegistrationError' });
        return _this;
    }
    return RegistrationError;
}(apollo_server_1.ApolloError));
exports.RegistrationError = RegistrationError;
