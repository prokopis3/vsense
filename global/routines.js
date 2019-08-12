"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_useragent_1 = __importDefault(require("express-useragent"));
var util_1 = require("util");
exports.debug = { explain: false };
/* import { compareSync, hashSync, genSaltSync } from 'bcrypt' */
var GBRoutines = /** @class */ (function () {
    function GBRoutines() {
        // private version: string
        var _this = this;
        this.getNestedChildren = function (arr, parent) {
            var out = [];
            var str;
            for (var i in arr) {
                str = arr[i] && arr[i].parent_id ? arr[i].parent_id : undefined;
                /* console.log( 'parent_id: ' + str  + `  ` + parent) */
                if (!str && str == parent || str && str.toString() == parent) {
                    var children = _this.getNestedChildren(arr, arr[i]._id);
                    if (children.length > 0)
                        arr[i].children = children;
                    out.push(arr[i]);
                }
            }
            return out;
        };
    }
    // constructor(version: string) {
    //     this.version = version
    // }
    // public GBRoutines(): void {}
    GBRoutines.prototype.generateUUID = function (version) {
        switch (version) {
            case 'timestamp':
                var uuidv1 = require('uuid/v1');
                return uuidv1();
                break;
            case 'random':
                var uuidv4 = require('uuid/v5');
                return uuidv4();
                break;
            default:
                var uuidv5 = require('uuid/v5');
                // ... using predefined URL namespace (for, well, URLs) 
                uuidv5('mail.technicalprb.com', uuidv5['URL']);
                return uuidv5['URL'];
                break;
        }
    };
    GBRoutines.prototype.getUserSession = function (res, machineId) {
        var source = res.header('user-agent').toString(), us = express_useragent_1.default.parse(source || '');
        return {
            agent: {
                isMobile: us ? us.isMobile : '',
                isBot: us ? us.isBot : '',
                browser: us ? us.browser : '',
                version: us ? us.version : '',
                os: us ? us.os : '',
                platform: us ? us.platform : '',
                source: source || '',
            },
            referrer: res.header('referrer') || '',
            ip: res.header('x-forwarded-for') || res.connection.remoteAddress,
            device: {
                OsUUID: machineId,
                type: '' // res.device.type.toUpperCase()
            }
        };
    };
    /* -------------------------- passport Strategy -------------------------- */
    // Compares hashed passwords using bCrypt
    GBRoutines.prototype.isValidPassword = function (user, password) {
        return /* compareSync(password, user.password) */ '';
    };
    // Generates hash using bCrypt
    GBRoutines.prototype.createHash = function (password) {
        return /* hashSync(password, genSaltSync(10)) */ '';
    };
    GBRoutines.prototype.Variablevalid = function (s) {
        return s && (util_1.isString(s) || util_1.isArray(s)) && s.length > 0 ? s : null;
    };
    GBRoutines.prototype.escapeRegex = function (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    return GBRoutines;
}());
exports.GBRoutines = GBRoutines;
