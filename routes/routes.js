const authRoutes = require('./authRoute');
const dashboardRoutes = require('./dashboardRoutes');
const uploadRoute = require('./uploadRoutes')
const postRoutes = require('./postRoute')

const apiRoutes = require('../api/routes/apiRoutes')

const routes = [
    {
        path: '/auth',
        handler: authRoutes
    },
    {
        path: '/dashboard',
        handler: dashboardRoutes
    },
    {
        path: '/uploads',
        handler: uploadRoute
    },
    {
        path: '/posts',
        handler: postRoutes
    },
    {
        path: '/api',
        handler: apiRoutes
    },
    {
        path: '/',
        handler: (req, res)=> {
            res.json({
                message: "Welcome To Our Blog Application"
            })
        }
    }
]

module.exports = app => {
    routes.forEach(r => {
        if(r.path === '/'){
            app.get(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        } 
    })
}