"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
;
var Category = /** @class */ (function () {
    function Category(dbCollectionName) {
        var schema = new mongoose_1.Schema({
            _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            desc: { type: Number, required: true },
            icon: { type: String, required: true },
            parent_id: { type: String, ref: 'Category' },
            children: { type: Array, ref: 'Category' },
            date_added: { type: Date, default: Date.now() },
            date_modified: { type: Date },
            status: { type: String, default: 'active' },
            recyclebin: { type: Boolean, default: false },
        });
        this._model = mongoose_1.model(dbCollectionName, schema, dbCollectionName);
    }
    Object.defineProperty(Category.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    return Category;
}());
exports.Category = Category;
