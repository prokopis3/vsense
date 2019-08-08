"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
;
var Cate_prod = /** @class */ (function () {
    function Cate_prod(dbCollectionName) {
        var schema = new mongoose_1.Schema({
            product_id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Product' },
            category_id: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Category' },
        });
        this._model = mongoose_1.model(dbCollectionName, schema, dbCollectionName);
    }
    Object.defineProperty(Cate_prod.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    return Cate_prod;
}());
exports.Cate_prod = Cate_prod;
