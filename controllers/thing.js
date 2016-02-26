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

var loader = require('./partial/loader');

var USER_SYSTEM = require('../helpers/global').USER_SYSTEM;
var DICT_CODE = require('../helpers/global').DICT_CODE;

var recordIndexValue = function (callback, params) {
    loader.get(function (error, results) {
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
        loader.get(function (error, results) {
            if (error) {
                next(error);
            } else {
                next(null);
            }
        }, item);
    }, function (error) {
        if (error) {
            callback(error);
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
            callback(collector.error(error), { code: DICT_CODE['300'] });
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
        }, function (error) {
            if (error) {
                next(error);
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
                }), function (error2) {
                    if (error2) {
                        next(error2);
                    } else {
                        var indexs = arguments[1];
                        Group.create({
                            title: thing.title,
                            tags: thing.tags,
                            indexs: _.map(indexs, function(dataitem, index) {
                                return dataitem._id;
                            }),
                            creator: USER_SYSTEM
                        }, function(error3) {
                            if (error3) {
                                next(error3);
                            } else {
                                next(null);
                            }
                        });
                    }
                });
            }
        });
    }, function (error) {
        if (error) {
            callback(collector.error(error));
        } else {
            callback(null, { code: DICT_CODE['200'] });
        }
    });
};

module.exports.tracking = function (callback, params) {
    Index.findAll(function (error, results) {
        if (error) {
            callback(collector.error(error));
        } else {
            async.each(results, function (item, next) {
                recordIndexValue(function (error2, results) {
                    if (error2) {
                        next(error2);
                    } else {
                        next(null);
                    }
                }, item);
            }, function (error2, results) {
                if (error2) {
                    callback(collector.error(error2));
                } else {
                    callback(null, null);
                }
            });
        }
    });
};