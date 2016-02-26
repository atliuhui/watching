var moment = require('moment');
// var expresshandlebars = require('express-handlebars');

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
        case 'weather':
            switch (source) {
                case 'cw':
                    return '<img class="favicon grayscale" src="http://www.weather.com.cn/favicon.ico" />';
                default:
                    return '';
            }
        default:
            return '';
    }
};
var rendercardPrice = function (context) {
    var html = '<div class="col-md-4">' +
        '    <div class="card">' +
        '        <div class="property">' +
        '            <div class="icon">{icon}</div>' +
        '            <div class="text" style="text-transform: uppercase;">{source}</div>' +
        '        </div>' +
        '        <div class="property">' +
        '            <div class="icon"><i class="fa fa-cny"></i></div>' +
        '            <div class="text">{value}</div>' +
        '        </div>' +
        '        <div class="property">' +
        '            <div class="icon"><i class="fa fa-calendar"></i></div>' +
        '            <div class="text">{datetime}</div>' +
        '        </div>' +
        '    </div>' +
        '</div>';
    html = html.replace('{icon}', module.exports.icon(context.category, context.source))
        .replace('{source}', context.source)
        .replace('{value}', context.value)
        .replace('{datetime}', '{MMMMDD}&nbsp;|&nbsp;{dddd}'.replace('{MMMMDD}', module.exports.format(context.datetime, 'MMMM DD')).replace('{dddd}', module.exports.format(context.datetime, 'dddd')));
    return html;
};
var rendercardWeather = function (context) {
    var html = '<div class="col-md-4">' +
        '    <div class="card">' +
        '        <div class="property">' +
        '            <div class="icon">{icon}</div>' +
        '            <div class="text" style="text-transform: uppercase;">{source}</div>' +
        '        </div>' +
        '        <div class="property">' +
        '            <div class="icon"><i class="fa fa-cloud"></i></div>' +
        '            <div class="text">{value}℃ - {time}</div>' +
        '        </div>' +
        '        <div class="property">' +
        '            <div class="icon"><i class="fa fa-calendar"></i></div>' +
        '            <div class="text">{datetime}</div>' +
        '        </div>' +
        '    </div>' +
        '</div>';
    html = html.replace('{icon}', module.exports.icon(context.category, context.source))
        .replace('{source}', context.source)
        .replace('{value}', context.value.temperature)
        .replace('{time}', module.exports.format(context.datetime, 'hh:mm A'))
        .replace('{datetime}', '{MMMMDD}&nbsp;|&nbsp;{dddd}'.replace('{MMMMDD}', module.exports.format(context.datetime, 'MMMM DD')).replace('{dddd}', module.exports.format(context.datetime, 'dddd')));
    return html;
};
module.exports.rendercard = function (context) {
    switch (context.category) {
        case 'price':
            return rendercardPrice(context);
        case 'weather':
            return rendercardWeather(context);
        default:
            return '';
    }
};