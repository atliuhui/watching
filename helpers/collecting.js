var Collector = function (logger) {
    this.logger = logger;
};

Collector.prototype.error = function (error, code) {
    if (code) {
        this.logger.error('[CODE]{code}:'.replace('{code}', code), error);
        return new Error(code);
    } else {
        this.logger.error('[CODE]:', error);
        return new Error('300');
    }
};

module.exports.getCollector = function (logger) {
    return new Collector(logger);
};