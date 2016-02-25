var moment = require('moment');

module.exports.json = function (context) {
    return JSON.stringify(context);
};

module.exports.format = function (context, format) {
    return moment(context).format(format);
};

module.exports.icon = function (category, source) {
    switch (category) {
        case 'price':
            switch (source) {
                case 'jd':
                    return '<img class="favicon grayscale" src="http://www.jd.com/favicon.ico" />';
                case 'tmall':
                    return '<img class="favicon grayscale" src="https://www.tmall.com/favicon.ico" />';
                case 'amazon':
                    return '<img class="favicon grayscale" src="http://www.amazon.cn/favicon.ico" />';
                default:
                    return '';
            }
        default:
            return '';
    }
};