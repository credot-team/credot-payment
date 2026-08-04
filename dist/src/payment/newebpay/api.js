"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const AgreementOrder_1 = require("./agreement/AgreementOrder");
const AgreementP1_1 = require("./agreement/AgreementP1");
const AgreementPn_1 = require("./agreement/AgreementPn");
const TokenQuery_1 = require("./agreement/TokenQuery");
const TokenUnbind_1 = require("./agreement/TokenUnbind");
var api;
(function (api) {
    /**
     * 4.1 首次約定付款(P1) - 幕前情境 [NPA-F011]
     */
    function createAgreementOrder(...args) {
        return new AgreementOrder_1.AgreementOrder(...args);
    }
    api.createAgreementOrder = createAgreementOrder;
    /**
     * 4.2 首次約定付款(P1) - 幕後情境 [NPA-B101]
     */
    function agreementP1(...args) {
        return new AgreementP1_1.AgreementP1(...args);
    }
    api.agreementP1 = agreementP1;
    /**
     * 4.3 後續約定付款(Pn) - 幕後情境 [NPA-B102]
     */
    function agreementPn(...args) {
        return new AgreementPn_1.AgreementPn(...args);
    }
    api.agreementPn = agreementPn;
    /**
     * 4.4 查詢約定付款綁定狀態 [NPA-B103]
     */
    function queryTokenStatus(...args) {
        return new TokenQuery_1.TokenQuery(...args);
    }
    api.queryTokenStatus = queryTokenStatus;
    /**
     * 4.5 解除約定付款綁定 [NPA-B104]
     */
    function unbindToken(...args) {
        return new TokenUnbind_1.TokenUnbind(...args);
    }
    api.unbindToken = unbindToken;
})(api = exports.api || (exports.api = {}));
