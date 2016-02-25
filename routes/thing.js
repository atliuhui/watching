var express = require('express');
var formidable = require('formidable');

var thing = require('../controllers/thing.js');

var router = express.Router();

router.get('/import', function (req, res, next) {
    res.render('thing-import', {
        data: {
            title: '产品导入',
            poster: '/img/FloatingMarket_ZH-CN9326364399_1366x768.jpg'
        }
    });
});
router.post('/import', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (error, fields, files) {
        if (error) {
            next(error);
        } else {
            thing.importing(function (error2, results) {
                if (error2) {
                    next(error2);
                } else {
                    res.render('thing-import', {
                        data: {
                            title: '产品导入',
                            poster: '/img/FloatingMarket_ZH-CN9326364399_1366x768.jpg',
                            message: results.code.msg
                        }
                    });
                }
            }, JSON.parse(fields.data));
        }
    });
});

router.post('/test', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (error, fields, files) {
        if (error) {
            next(error);
        } else {
            thing.testing(function (error2, results) {
                res.format({
                    json: function () {
                        // res.json(res.status, results.code);
                        res.status(res.status).json(results.code);
                    }
                });
            }, JSON.parse(fields.data));
        }
    });
});

// router.get('/', function (req, res, next) {
//     thing.index(function (error, results) {
//         if (error) {
//             next(error);
//         } else {
//             results.title = '产品列表';
//             results.poster = '/img/FloatingMarket_ZH-CN9326364399_1366x768.jpg';
//             res.render('thing-home', {
//                 data: results
//             });
//         }
//     });
// });

// router.get('/:code', function (req, res, next) {
//     thing.get(function (error, results) {
//         if (error) {
//             next(error);
//         } else {
//             results.title = '产品详细';
//             results.poster = results.thing.poster;
//             results.content = results.thing.content;
//             res.render('thing-detail', {
//                 data: results
//             });
//         }
//     }, { pid: req.param('code') });
// });
// router.get('/:code/index/:id', function (req, res, next) {
//     thing.getPrice(function (error, results) {
//         if (error) {
//             next(error);
//         } else {
//             res.format({
//                 json: function () {
//                     // res.json(res.status, results);
//                     res.status(res.status).json(results);
//                 }
//             });
//         }
//     }, { pid: req.param('code') });
// });

module.exports = router;
