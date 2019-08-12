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
/* import { Mongoose, mongo } from 'mongoose'; */
var bson_1 = require("bson");
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
        this.router.get('/categories', this.getTasks); // Get All Tasks
        this.router.get('/categories/search', this.SearchTasks); // Search All Categories
        this.router.get('/:id', this.OneTask); // Get Single task
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
    Tasks.prototype.getTasks = function (req, res, next) {
        var dbCollection = net_1.DB.getCollection('category');
        dbCollection.find({ recyclebin: false }).limit(100).toArray(function (err, categories) {
            if (err)
                res.status(500).json(err);
            if (global_1.debug.explain)
                console.log(categories);
            res.status(200).json(gbr.getNestedChildren(categories));
        });
    };
    Tasks.prototype.SearchTasks = function (req, res, next) {
        var sterm = req.query;
        var regex = new RegExp(gbr.escapeRegex(sterm.q), 'gi');
        var dbCollection = net_1.DB.getCollection('category');
        dbCollection.find({ "name": { $regex: regex }, recyclebin: false }).limit(10).toArray(function (err, searchRes) {
            // callback
            if (err) {
                console.error(err);
                return next(err);
            }
            if (global_1.debug.explain)
                console.log(searchRes);
            res.status(200).json(searchRes);
        });
    };
    Tasks.prototype.OneTask = function (req, res, next) {
        var dbCollection = net_1.DB.getCollection('category');
        dbCollection.findOne({ _id: new bson_1.ObjectId(req.params.id), recyclebin: false }, function (err, results) {
            if (err) {
                return next(err);
            }
            res.status(200).json({ results: results });
        });
    };
    Tasks.prototype.savetask = function (req, res, next) {
        var json_obj = req.body, top = json_obj.parent_id.length > 0 ? false : true, newobj = {
            _id: new bson_1.ObjectId().toHexString(),
            name: json_obj.name,
            desc: 1,
            icon: json_obj.icon,
            parent_id: json_obj.parent_id,
            status: true,
            top: top,
            date_added: new Date()
        }, dbCollection = net_1.DB.getCollection('category');
        dbCollection.save(newobj, function (err) {
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
            var dbCollection = net_1.DB.getCollection('Category');
            dbCollection.updateMany({ '_id': { '$in': arr } }, { $set: { recyclebin: true } }, function (err) {
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
            var dbCollection = net_1.DB.getCollection('product');
            dbCollection.update({ _id: new bson_1.ObjectId(req.params.id) }, updTask, {}, function (err, tasks) {
                if (err)
                    res.send(err);
                res.json(tasks);
            });
        }
    };
    return Tasks;
}());
exports.Tasks = Tasks;
