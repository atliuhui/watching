var weather_china = require('./controllers/partial/weather-china');

weather_china.get(function (error, results) {
    if (error) {
    } else {
    }
}, { place: '101010100' });

// var aaa = function() {};
// try {
//     var a;
//     a.setSeconds(0);
//     console.log('%s', a);
// } catch (error) {
//     console.log('%s', '2');
// }
// console.log('%s', '3');
