var util = require('util');
var request = require('request');
// var cheerio = require('cheerio');
// var iconv = require('iconv-lite');

var logger = require('../../helpers/logging').getLogger('weather-china');

// http://www.weather.com.cn/weather1d/101010100.shtml
module.exports.get = function (callback, params) {
    request({
        uri: util.format('http://d1.weather.com.cn/sk_2d/%s.html', params.sourcekey.place),
        headers: {
            'referer': util.format('http://www.weather.com.cn/weather1d/%s.shtml', params.sourcekey.place)
        },
        method: 'GET',
        // encoding: null,
        time: true,
        timeout: 1000 * 5,
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {
        if (error) {
            callback(new Error(error));
        } else if (response.statusCode != 200) {
            callback(new Error(util.format('[price-jd]response.statusCode: %d', response.statusCode)));
        } else {
            var data = JSON.parse(body.replace('var dataSK =', ''));
            var weather = {
                temperature: data.temp,
                api: data.aqi,
                wind: data.WD,
                weather: data.weather,
                humidity: data.sd
            };

            logger.debug('get china weather, %j, %j', params, weather);
            callback(null, {
                datetime: new Date(),
                value: weather,
                elapsed: response.elapsedTime
            });
        }
    });
}