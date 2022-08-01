const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
// const chalk = require('chalk')

// import Routes and Middlewares
const setRoutes = require('./routes/routes');
const setMiddlewares = require('./middleware/middlewares');

const app = express();

// setup view engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// mongoose connection
mongoose.connect(config.get('mongodb-uri')) 
.then(() => console.log('mongoose connection successful'))
.catch(err => console.log(err));

// using middlewares from middleware directory
setMiddlewares(app)

// using routes from routes directory
setRoutes(app)


app.use((req, res, next) => {
    let error = new Error('404 Page Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    console.log(error)
    if(res.headersSent){
        next('There was an header sent problem')
    } else {
        if(error.status === 404) {
            return res.render('pages/error/404', {flashMessage: {}})
        } 
        res.render('pages/error/500', {flashMessage: {}})
    }
    // console.log(chalk.red.inverse(error.message))
    //console.log(error)
    
})



module.exports = app;