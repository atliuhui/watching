var util = require('util');
var _ = require('underscore')._;

var logger = require('./helpers/logging').getLogger('dbseed');

var USER_SYSTEM = require('./helpers/global').USER_SYSTEM;

var Thing = require('./models/thing').Thing;
var Index = require('./models/thing').Index;
var IndexValue = require('./models/thing').IndexValue;
var Group = require('./models/thing').Group;

logger.info('seed ready');

// var c1 = '<article>' +
//     '<section class="index">' +
//     '<cite>羽绒服外套</cite>' +
//     '<ul class="tag">' +
//     '<li>JEEP</li>' +
//     '<li>吉普</li>' +
//     '<li>男装</li>' +
//     '<li>秋冬</li>' +
//     '<li>商务休闲</li>' +
//     '<li>大码</li>' +
//     '<li>立领</li>' +
//     '<li>GW15WJ801</li>' +
//     '<li>K4</li>' +
//     '<li>180/96B(54)</li>' +
//     '</ul>' +
//     '</section>' +
//     '<section class="content">' +
//     '<cite>简介</cite>' +
//     '<p>京东平台卖家销售并发货的商品，由平台卖家提供发票和相应的售后服务。请您放心购买！注：因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不能确保客户收到的货物与商城图片、产地、附件说明完全一致。只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若本商城没有及时更新，请大家谅解！</p>' +
//     '<figure>' +
//     '<figcaption>整体效果</figcaption>' +
//     '<img src="http://img12.360buyimg.com/cms/jfs/t2218/35/1720027991/223041/6e651f91/56710d9dN710d8017.jpg" />' +
//     '</figure>' +
//     '</section>' +
//     '<section class="content">' +
//     '<cite>正面</cite>' +
//     '<p>京东平台卖家销售并发货的商品，由平台卖家提供发票和相应的售后服务。请您放心购买！注：因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不能确保客户收到的货物与商城图片、产地、附件说明完全一致。只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若本商城没有及时更新，请大家谅解！</p>' +
//     '<figure>' +
//     '<figcaption>整体效果</figcaption>' +
//     '<img src="http://img30.360buyimg.com/popWaterMark/jfs/t2371/252/444019340/26712/e0bc1cd1/560b4c8cN44ce3fb4.jpg" />' +
//     '</figure>' +
//     '</section>' +
//     '<section class="content">' +
//     '<cite>引用自</cite>' +
//     '<blockquote cite="http://item.jd.com/1765466541.html">' +
//     '<p>http://item.jd.com/1765466541.html</p>' +
//     '<p>http://item.jd.com/1765466541.html</p>' +
//     '</blockquote>' +
//     '</section>' +
//     '</article>';

// Thing.create([{
//     title: '【示例】贝尔金车载充电器2.1A',
//     tags: ['BELKIN', '2.1A'],
//     poster: '/img/FloatingMarket_ZH-CN9326364399_1366x768.jpg',
//     content: c1,
//     creator: USER_SYSTEM
// }], function (error) {
//     if (error) {
//         logger.error('create Thing, error: ', error);
//     } else {
//         logger.info('create Thing success');

//         var t1 = arguments[1][0];
//         Index.create([
//             {
//                 tid: t1.id,
//                 categories: ['price'],
//                 source: 'jd',
//                 sourcekey: {
//                     url: 'http://item.jd.com/1492748.html',
//                     code: '1492748'
//                 },
//                 creator: USER_SYSTEM
//             }, {
//                 pid: t1.id,
//                 categories: ['price'],
//                 source: 'tmall',
//                 sourcekey: {
//                     url: 'https://detail.tmall.com/item.htm?spm=a220m.1000858.0.0.veyBqP&id=22575428503&skuId=76280448023&is_b=1&cat_id=2&q=%B1%B4%B6%FB%BD%F0+2.1+a',
//                     code: '22575428503',
//                     skuId: '76280448023'
//                 },
//                 creator: USER_SYSTEM
//             }, {
//                 pid: t1.id,
//                 categories: ['price'],
//                 source: 'amazon',
//                 sourcekey: {
//                     url: 'http://www.amazon.cn/Belkin-%E8%B4%9D%E5%B0%94%E9%87%91-iphone5%E8%BD%A6%E5%85%85-ipad-mini%E8%BD%A6%E8%BD%BD%E5%85%85%E7%94%B5%E5%99%A8-2-1A-F8J051-%E7%99%BD%E8%89%B2/dp/B00BONRSEI/ref=sr_1_7?ie=UTF8&qid=1452065963&sr=8-7&keywords=BELKIN+2.1A#nav-belt',
//                     code: '1452065963'
//                 },
//                 creator: USER_SYSTEM
//             }
//         ], function (error) {
//             if (error) {
//                 logger.error('create Thing Index, error: ', error);
//             } else {
//                 logger.info('create Thing Index success');
//             }
//         });
//     }
// });

Thing.create({
    title: '天气',
    tags: ['weather'],
    poster: 'http://2.im.guokr.com/O5eHPszembBPwk2ZvD6c8wGyG-rw4wGCX5JKlZAUyMKgAAAAoAAAAEpQ.jpg',
    content: '',
    creator: USER_SYSTEM
}, function (error) {
    var thing = arguments[1];
    Index.create([
        {
            tid: thing.id,
            category: 'weather',
            source: 'cw',
            sourcekey: {
                name: 'Beijing',
                place: '101010100'
            },
            creator: USER_SYSTEM
        }
    ], function (error2) {
        var indexs = arguments[1];
        Group.create({
            title: thing.title,
            tags: thing.tags,
            indexs: _.map(indexs, function (item, index) {
                return item._id;
            }),
            creator: USER_SYSTEM
        }, function (error3) {
        });
    });
});