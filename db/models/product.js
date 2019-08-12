"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
;
var Product = /** @class */ (function () {
    function Product(dbCollectionName) {
        var schema = new mongoose_1.Schema({
            _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
            brandName: { type: String, required: true },
            productName: { type: String, required: true },
            Desc: { type: String, reqired: true },
            price: { type: Number, required: true },
            stock_id: { type: String, required: true },
            rating: { type: Number, required: true },
            created: { type: Date, default: Date.now() },
            modified: { type: Date }
        });
        this._model = mongoose_1.model(dbCollectionName, schema, dbCollectionName);
    }
    Object.defineProperty(Product.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    return Product;
}());
exports.Product = Product;
