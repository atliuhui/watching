var logger = require('./helpers/logging').getLogger('tracker');

var moment = require('moment');
var stopwatch = require('./helpers/stopwatch').stopwatch;

var thing = require('./controllers/thing');

function Timer () {
    this.now = moment();
	this.next = moment(this.now);
    
    // this.next.year().month().date().hour(0).minute(this.now.minute() + 1).second(0).millisecond(0);
    this.next.minute(this.now.minute() + 1).second(0).millisecond(0);
    
	// // this.next.setDate(this.now.getDate() + 1);
    // // this.next.setHours(this.now.getHours() + 1);
    // // this.next.setMinutes(0);
	// this.next.setMinutes(this.now.getMinutes() + 1);
    // this.next.setSeconds(0);
	// this.next.setMilliseconds(0);
    
    this.delay = this.next - this.now;
};

var scheduler = function (params) {
	var timer = new Timer();
	var delay = params.delay || timer.delay;
    
    logger.info('Next: %s, Now: %s', timer.next.toString(), timer.now.toString());
    
	setTimeout(processer, delay, scheduler, params);
};
var processer = function (callback, params) {
    stopwatch.reset();
    stopwatch.start();
	
    logger.info('Start: %s', stopwatch.startMark.toString());
    
    thing.tracking(function (error, results) {
        stopwatch.stop();
        
        logger.info('Finish: %s, Elapsed: %d', stopwatch.stopMark.toString(), stopwatch.elapsedTicks);
        
        callback({ delay: null });
    });
};

scheduler({ delay: null });
