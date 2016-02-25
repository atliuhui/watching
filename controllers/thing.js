var _ = require('underscore')._;
var async = require('async');

var logger = require('../helpers/logging').getLogger('thing');

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

var loadIndexValue = function (callback, params) {
    switch (params.category) {
        case 'price':
            loadIndexPrice(callback, params);
            break;
        default:
            callback(new Error('thing category is null'));
            break;
    }
};

var loadIndexPrice = function (callback, params) {
    switch (params.source) {
        case 'jd':
            price_jd.get(callback, params);
            break;
        case 'tmall':
            price_tmall.get(callback, params);
            break;
        case 'amazon':
            price_amazon.get(callback, params);
            break;
        default:
            callback(new Error('thing source is null'));
            break;
    }
};

var recordIndexValue = function (callback, params) {
    loadIndexValue(function (error, results) {
        if (error) {
            callback(error);
        } else {
            IndexValue.create({
                iid: params._id,
                category: params.category,
                source: params.source,
                sourcekey: params.sourcekey,
                datetime: results.datetime,
                value: results.value,
                elapsed: results.elapsed,
                creator: USER_SYSTEM
            }, function (error2) {
                if (error2) {
                    callback(error2);
                } else {
                    callback(null, results);
                }
            });
        }
    }, params);
};

var testIndex = function (callback, params) {
    async.each(params.index, function (item, next) {
        loadIndexValue(function (error, results) {
            if (error) {
                next(error);
            } else {
                next(null);
            }
        }, item);
    }, function (error) {
        if (error) {
            // logger.error('[CODE]314: ', error);
            callback(new Error('333'));
        } else {
            callback(null, null);
        }
    });
};

module.exports.testing = function (callback, params) {
    async.each(params, function (item, next) {
        testIndex(function (error, results) {
            if (error) {
                next(error);
            } else {
                next(null);
            }
        }, item);
    }, function (error) {
        if (error) {
            // logger.error('[CODE]314: ', error);
            callback(new Error('324'), { code: DICT_CODE['300'] });
        } else {
            callback(null, { code: DICT_CODE['200'] });
        }
    });
};

module.exports.importing = function (callback, params) {
    async.eachSeries(params, function (item, next) {
        Thing.create({
            title: item.title,
            tags: item.tags,
            poster: item.poster,
            content: item.content,
            creator: USER_SYSTEM
        }, function (error2) {
            if (error2) {
                next(new Error('326'));
            } else {
                var thing = arguments[1];
                Index.create(_.map(item.index, function (value, index) {
                    return {
                        tid: thing.id,
                        category: value.category,
                        source: value.source,
                        sourcekey: value.sourcekey,
                        creator: USER_SYSTEM
                    };
                }), function (error3) {
                    if (error3) {
                        next(new Error('327'));
                    } else {
                        var indexs = arguments[1];
                        Group.create({
                            title: thing.title,
                            tags: thing.tags,
                            indexs: _.map(indexs, function(dataitem, index) {
                                return dataitem._id;
                            }),
                            creator: USER_SYSTEM
                        }, function(error4) {
                            if (error4) {
                                next(new Error('327'));
                            } else {
                                next(null);
                            }
                        });
                    }
                });
            }
        });
    }, function (error2) {
        if (error2) {
            // logger.error('[CODE]313: ', error);
            callback(new Error('329'));
        } else {
            callback(null, { code: DICT_CODE['200'] });
        }
    });
};

module.exports.tracking = function (callback, params) {
    Index.findAll(function (error, results) {
        if (error) {
            // logger.error('[CODE]380: ', error);
            callback(new Error('330'));
        } else {
            async.each(results, function (item, next) {
                recordIndexValue(function (error2, results) {
                    if (error2) {
                        next(new Error('331'));
                    } else {
                        next(null);
                    }
                }, item);
            }, function (error2, results) {
                if (error2) {
                    // logger.error('[CODE]381: ', error);
                    callback(new Error('332'));
                } else {
                    callback(null, null);
                }
            });
        }
    });
};
