const express = require('express')
const morgan = require('morgan')
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const config = require('config')
const path = require('path')
//const upload = require('./uploadMiddleware')

const { bindUserdWithRequest } = require('./authMiddleware');
const setLocals = require('./setLocals');

// session connect with mongodb
const store = new MongoDBStore({
    uri: config.get('mongodb-uri'),
    collection: 'sessions'
})

const middleware = [
    morgan('dev'),
    express.static(path.join(__dirname, 'public')),
    express.urlencoded({extended: true}),
    express.json(),
    session({
        secret: config.get('secret'),
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        },
        store: store,

    }),
    flash(),
    bindUserdWithRequest(),
    setLocals(),
]

module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}