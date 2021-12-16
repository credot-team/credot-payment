"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UNDEFINED = Symbol.for('UNDEFINED');
function lazyValue(initializer) {
    let value = UNDEFINED;
    const f = () => (value === UNDEFINED ? (value = initializer()) : value);
    f.drop = () => {
        value = UNDEFINED;
    };
    return f;
}
exports.default = lazyValue;
