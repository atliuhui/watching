var logger = require('./helpers/logging').getLogger('dbclean');

var Thing = require('./models/thing').Thing;
var Index = require('./models/thing').Index;
var IndexValue = require('./models/thing').IndexValue;
var Group = require('./models/thing').Group;

logger.info('clean ready');

IndexValue.remove({}, function (error) {
    logger.info('clean Thing Index Value success');
});
Index.remove({}, function (error) {
    logger.info('clean Thing Index success');
});
Group.remove({}, function (error) {
    logger.info('clean Thing Group success');
});
Thing.remove({}, function (error) {
    logger.info('clean Thing success');
});
