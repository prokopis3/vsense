"use strict";
// Clever-Cloud Mongo DB
// technicaldb: mongodb://ucrabeksjkigvz9:lijaIRixg4xgEZrBMPKj@brghyzdzarocacc-mongodb.services.clever-cloud.com:27017/brghyzdzarocacc
// dbsense: mongodb://ubzlzzwppunqupgw7dom:mu3QZXHCkgGAT2pdK8ip@b2h3trm37hg6zta-mongodb.services.clever-cloud.com:27017/b2h3trm37hg6zta
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var product_1 = require("./models/product");
var connect_json_1 = __importDefault(require("./netconfig/connect.json"));
exports.jdb = connect_json_1.default;
var models_1 = require("./models");
var dbArray = ['Atlas', 'mLab', 'Clever', 'Azure'];
// db Name, and index
var dbjsonIndex = dbArray.indexOf('Atlas'), dbname = connect_json_1.default[dbjsonIndex].dbname;
var mongoUri = connect_json_1.default[dbjsonIndex].mongoUri + '/' + dbname, mongoCFG = connect_json_1.default[dbjsonIndex].mongoCFG;
console.log(dbname);
var DB = /** @class */ (function () {
    function DB() {
        mongoose_1.connect(mongoUri, mongoCFG);
        this._db = mongoose_1.connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);
        this._db.on('close', this.disconnect);
        this._models = {
            Category: new models_1.Category('category').model,
            Cate_prod: new models_1.Cate_prod('cate_prod').model,
            Product: new product_1.Product('product').model,
            Device: new models_1.Device('device').model
            // this is where we initialise all models
        };
    }
    Object.defineProperty(DB, "Models", {
        get: function () {
            if (!DB.instance) {
                DB.instance = new DB();
            }
            return DB.instance._models;
        },
        enumerable: true,
        configurable: true
    });
    DB.prototype.connected = function () {
        console.log("Mongoose has connected to " + dbname);
    };
    DB.prototype.disconnect = function () {
        console.log("Mongoose has disconnected from " + dbname);
    };
    DB.prototype.error = function (error) {
        console.log('Mongoose has errored', error);
    };
    return DB;
}());
exports.DB = DB;
