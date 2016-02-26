var express = require('express');
var formidable = require('formidable');

var group = require('../controllers/group');

var router = express.Router();

router.get('/', function (req, res, next) {
    group.index(function (error, results) {
        if (error) {
            next(error);
        } else {
            results.title = '分组列表';
            results.poster = '/img/FloatingMarket_ZH-CN9326364399_1366x768.jpg';
            res.render('group-home', {
                data: results
            });
        }
    });
});

router.get('/:id', function (req, res, next) {
    group.get(function (error, results) {
        if (error) {
            next(error);
        } else {
            results.title = '分组详细';
            // results.poster = results.thing.poster;
            // results.content = results.thing.content;
            res.render('group-detail', {
                data: results
            });
        }
    }, { g: req.params.id });
});

router.get('/:id/indexvalue', function (req, res, next) {
    group.getIndexValue(function (error, results) {
        if (error) {
            next(error);
        } else {
            res.format({
                json: function () {
                    res.status(res.status).json(results);
                }
            });
        }
    }, { g: req.params.id });
});

module.exports = router;