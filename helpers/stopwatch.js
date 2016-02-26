
var Stopwatch = function() {
    this.reset();
};

Stopwatch.prototype.start = function (params) {
    this.startMark = new Date();
};

Stopwatch.prototype.stop = function (params) {
    this.stopMark = new Date();
    
    this.elapsedTicks = this.stopMark.getTime() - this.startMark.getTime();
};

Stopwatch.prototype.reset = function (params) {
    this.startMark = null;
    this.stopMark = null;
    
    this.elapsedTicks = 0;
};

// module.exports.Stopwatch = Stopwatch;
module.exports.stopwatch = new Stopwatch();