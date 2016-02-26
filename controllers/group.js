var _ = require('underscore')._;
var async = require('async');

var logger = require('../helpers/logging').getLogger('thing');
var collector = require('../helpers/collecting').getCollector(logger);

var moment = require('moment');
var stopwatch = require('../helpers/stopwatch').stopwatch;

var Thing = require('../models/thing').Thing;
var Index = require('../models/thing').Index;
var IndexValue = require('../models/thing').IndexValue;
var Group = require('../models/thing').Group;

var price_jd = require('./partial/price-jd');
var price_tmall = require('./partial/price-tmall');
var price_amazon = require('./partial/price-amazon');

var USER_SYSTEM = require('../helpers/global').USER_SYSTEM;
var DICT_CODE = require('../helpers/global').DICT_CODE;

module.exports.index = function (callback, params) {
    Group.findAll(function (error, results) {
        if (error) {
            callback(collector.error(error));
        } else {
            callback(null, results);
        }
    });
};
module.exports.get = function (callback, params) {
    async.auto({
        group: function (next, context) {
            Group.findByG(params.g, function (error, results) {
                if (error) {
                    next(collector.error(error));
                } else {
                    next(null, results[0]);
                }
            });
        },
        indexvalue: ['group', function (next, context) {
            async.map(context.group.indexs, function (item, subnext) {
                IndexValue.findNewestByI(item, function (error, results) {
                    if (error) {
                        subnext(collector.error(error));
                    } else if (results.length !== 1) {
                        subnext(null, null);
                    } else {
                        subnext(null, results[0]);
                    }
                });
            }, function (error, results) {
                if (error) {
                    next(collector.error(error));
                } else {
                    next(null, results);
                }
            });
        }]
    }, function (error, results) {
        if (error) {
            callback(collector.error(error));
        } else {
            callback(null, results);
        }
    });
};

module.exports.getIndexValue = function (callback, params) {
    var beginTime = moment();
    var endTime = moment(beginTime);

    beginTime.date(endTime.date() - 7).hour(0).minute(0).second(0).millisecond(0);
    endTime.hour(23).minute(59).second(59).millisecond(999);

    async.auto({
        group: function (next, context) {
            Group.findByG(params.g, function (error, results) {
                if (error) {
                    next(collector.error(error));
                } else {
                    next(null, results[0]);
                }
            });
        },
        // index: ['group', function (next, context) {
        //     Index.findByIs(context.group.indexs, function (error, results) {
        //         if (error) {
        //             next(collector.error(error));
        //         } else {
        //             next(null, results);
        //         }
        //     });
        // }],
        indexvalue: ['group', function (next, context) {
            IndexValue.findByIsAndTimerange(context.group.indexs, beginTime, endTime, function (error, results) {
                if (error) {
                    next(collector.error(error));
                } else {
                    next(null, results);
                }
            });
        }]
    }, function (error, results) {
        if (error) {
            callback(collector.error(error));
        } else {
            callback(null, results);
        }
    });
};