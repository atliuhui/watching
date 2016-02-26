var price_jd = require('./price-jd');
var price_tmall = require('./price-tmall');
var price_amazon = require('./price-amazon');
var weather_china = require('./weather-china');

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
var loadIndexWeather = function (callback, params) {
    switch (params.source) {
        case 'cw':
            weather_china.get(callback, params);
            break;
        default:
            callback(new Error('thing source is null'));
            break;
    }
};

module.exports.get = function (callback, params) {
    switch (params.category) {
        case 'price':
            loadIndexPrice(callback, params);
            break;
        case 'weather':
            loadIndexWeather(callback, params);
            break;
        default:
            callback(new Error('thing category is null'));
            break;
    }
};