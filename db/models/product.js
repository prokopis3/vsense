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
            desc: { type: String, required: true },
            price: { type: Number, required: true },
            stock_id: { type: String, required: true },
            Rating: { type: Number, required: true },
            date_added: { type: Date, default: Date.now() },
            date_modified: { type: Date }
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
