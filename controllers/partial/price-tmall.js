var util = require('util');
var _ = require('underscore')._;

var request = require('request');
// var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var retry = require('retry');

var logger = require('../../helpers/logging').getLogger('price-tmall');

var trycatch = require('../../helpers/trycatch').trycatch;

module.exports.get = function (callback, params) {
    var operation = retry.operation();
    operation.attempt(function(currentAttempt) {
        request({
            uri: util.format('https://mdskip.taobao.com/core/initItemDetail.htm?itemId=%s', params.sourcekey.code),
            headers: {
                'referer': util.format('https://detail.tmall.com/item.htm?id=%s', params.sourcekey.code)
            },
            method: 'GET',
            encoding: null,
            time: true,
            timeout: 1000 * 5,
            followRedirect: true,
            maxRedirects: 10
        }, function (error, response, body) {
            if(operation.retry(error)) {
                logger.debug('get tmall price retry, %j', params);
                return;
            }
            if (error) {
                callback(operation.mainError());
            } else if (response.statusCode != 200) {
                callback(new Error(util.format('[price-tmall]response.statusCode: %d', response.statusCode)));
            } else {
                var content = iconv.decode(body, 'GBK');
                // var $ = cheerio.load(content);

                var price = 0;
                trycatch(function() {
                    var data = JSON.parse(content);
                    
                    if(params.sourcekey.skuid) {
                        price = data.defaultModel.itemPriceResultDO.priceInfo[params.sourcekey.skuid].price;
                    } else {
                        price = (_.values(data.defaultModel.itemPriceResultDO.priceInfo))[0].price;
                    }
                }, function() {
                    logger.debug('get tmall price, %j, %d', params, price);
                    callback(null, {
                        datetime: new Date(),
                        value: price,
                        elapsed: response.elapsedTime
                    });
                }, function(error2) {
                    callback(error2);
                });
            }
        });
    });
};