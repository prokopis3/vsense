"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
;
var Device = /** @class */ (function () {
    function Device(dbCollectionName) {
        var schema = new mongoose_1.Schema({
            _id: { type: mongoose_1.Schema.Types.ObjectId },
            name: { type: String, required: true },
            imei: { type: String, required: true },
            created: { type: Date, default: Date.now() }
        });
        this._model = mongoose_1.model(dbCollectionName, schema, dbCollectionName);
    }
    Object.defineProperty(Device.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    return Device;
}());
exports.Device = Device;
