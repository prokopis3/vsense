"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var global_1 = require("../global");
// import { mainRouter } from './'
var auth_1 = require("./auth");
var net_1 = require("../db/net");
var mongoose_1 = require("mongoose");
var device = require('express-device');
var gbr = new global_1.GBRoutines();
/*
    Most Important Tasks, Main Tasks
*/
var Tasks = /** @class */ (function () {
    function Tasks() {
        this.tk103 = { oldpass: '' };
        this.router = express_1.default.Router();
        this.router.use(device.capture());
        this.httpRoutesGets();
        this.httpRoutesPosts();
    }
    // Node JS Routes
    /**
     * https Router Gets
     */
    Tasks.prototype.httpRoutesGets = function () {
        this.router.get('/', function (req, res) {
            var d = { tasks: 'Task 1!' };
            console.log(d.tasks);
            res.send(d);
        });
        this.router.get('/categories', this.getasks); // Get All Tasks
        this.router.get('/categories/search', this.searchtasks); // Search All Categories
        this.router.get('/:id', this.singletask); // Get Single task
        // this.router.get('/init/:id', auth, this.initializeUnit); // Send Begin SMS to the device
    };
    /**
     * https Router Posts
     */
    Tasks.prototype.httpRoutesPosts = function () {
        // this.router.post('/emails', this.sendEmail) // send email
        // this.router.post('/subscribers', this.sub) // subscribe
        this.router.post('/save', this.savetask); // Save task
        this.router.post('/del', this.deletetask); // Update/Delete Tasks
    };
    /**
     * https Router Delete
     */
    Tasks.prototype.httpRoutesDelete = function () {
        // this.router.delete('/:id', this.deletetask); // Delete task
    };
    /**
     * https Router Put - update
     */
    Tasks.prototype.httpRoutesPut = function () {
        this.router.put('/:id', auth_1.authfun, this.updatetask); // Update task
        // this.router.put('/resetpass/:id', auth, this.resetpassword); // update password of the device
    };
    /**
     * Router Functions
     */
    // if the user is authenticated redirect to home
    // ---------- https Functions ToDo ----------
    Tasks.prototype.getasks = function (req, res, next) {
        net_1.DB.Models['Category'].find({ recyclebin: false }, function (err, tasks) {
            if (err)
                res.status(500).json(err);
            res.status(200).json(gbr.getNestedChildren(tasks));
        }).limit(1000);
    };
    Tasks.prototype.searchtasks = function (req, res, next) {
        var sterm = req.query;
        var regex = new RegExp(gbr.escapeRegex(sterm.q), 'gi');
        net_1.DB.Models['Category']
            .find({ "name": { $regex: regex }, recyclebin: false }, function (err, searchRes) {
            // callback
            if (err) {
                console.error(err);
                return next(err);
            }
            // console.log(searchRes)
            res.status(200).json(searchRes);
        })
            .sort({ desc: 1 }).limit(10);
    };
    Tasks.prototype.singletask = function (req, res, next) {
        net_1.DB.Models['Category'].findOne({ _id: new mongoose_1.Mongoose().Types.ObjectId(req.params.id), recyclebin: false }, function (err, results) {
            if (err) {
                return next(err);
            }
            res.status(200).json({ results: results });
        });
    };
    Tasks.prototype.savetask = function (req, res, next) {
        var json_obj = req.body, top = json_obj.parent_id.length > 0 ? false : true, newobj = {
            _id: new mongoose_1.Mongoose().Types.ObjectId().toHexString(),
            name: json_obj.name,
            desc: 1,
            icon: json_obj.icon,
            parent_id: json_obj.parent_id,
            status: true,
            top: top,
            date_added: new Date()
        }, 
        // within some class, this is called..
        obj = new net_1.DB.Models['Category'](newobj);
        obj.save(function (err) {
            if (err) {
                res.status(500).json({ error: err });
            }
            res.status(200).json({ code: 200, status: "success" });
        });
    };
    Tasks.prototype.deletetask = function (req, res, next) {
        var sterm = req.body, arr = sterm.q ? sterm.q : [];
        if (arr.length > 0) {
            console.log(arr);
            net_1.DB.Models['Category'].updateMany({ '_id': { '$in': arr } }, { $set: { recyclebin: true } }, function (err) {
                if (err) {
                    res.status(500).json({ error: err });
                }
                res.status(200).json({ code: 200, status: "success" });
            });
        }
        else {
            res.status(500).json({ code: 500, status: "failed" });
        }
    };
    Tasks.prototype.updatetask = function (req, res, next) {
        var task = req.body, updTask = { isDone: true, title: '' };
        // const mycollection = client.db(dbname).collection('product')
        if (task.isDone)
            updTask.isDone = task.isDone;
        if (task.title)
            updTask.title = task.title;
        if (!updTask) {
            res.status(400);
            res.json({ "error": "Bad data" });
        }
        else {
            console.log(req.params.id);
            net_1.DB.Models['Product'].update({ _id: new mongoose_1.Mongoose().Types.ObjectId(req.params.id) }, updTask, {}, function (err, tasks) {
                if (err)
                    res.send(err);
                res.json(tasks);
            });
        }
    };
    return Tasks;
}());
exports.Tasks = Tasks;
