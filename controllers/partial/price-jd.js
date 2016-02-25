var util = require('util');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var logger = require('../../helpers/logging').getLogger('price-jd');

module.exports.get = function (callback, params) {
    request({
        // uri: util.format('http://item.jd.com/%s.html', params.sourcekey.code),
        uri: util.format('http://p.3.cn/prices/get?skuid=J_%s', params.sourcekey.code),
        method: 'GET',
        // encoding: null,
        time: true,
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {
        if (error) {
            callback(new Error(error));
        } else if (response.statusCode != 200) {
            callback(new Error(util.format('[price-jd]response.statusCode: %d', response.statusCode)));
        } else {
            // var content = iconv.decode(body, 'UTF8');
            // var $ = cheerio.load(content);
            var price = JSON.parse(body)[0].p;

            logger.debug('get jd price, %j, %d', params, price);
            callback(null, {
                datetime: new Date(),
                value: price,
                elapsed: response.elapsedTime
            });
        }
    });
}