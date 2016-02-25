/* global __dirname */

var express = require('express');
var expresshandlebars = require('express-handlebars');
var path = require('path');

var helperException = require('./helpers/exception');
var helperHandlebars = require('./helpers/handlebars');

var routerHome = require('./routes/home');
var routerGroup = require('./routes/group');
var routerThing = require('./routes/thing');

var server = express();
var hbs = expresshandlebars.create({
    defaultLayout: 'main',
    extname: '.html',
    helpers: {
        json: helperHandlebars.json,
        format: helperHandlebars.format,
        icon: helperHandlebars.icon
    }
});

server.engine('html', hbs.engine);
server.set('view engine', 'html');

server.use(express.static(path.join(__dirname, 'public')));

server.use('/', routerHome);
server.use('/group', routerGroup);
server.use('/thing', routerThing);

server.use(helperException.notfound);
server.use(helperException.error);

server.listen(3000);
