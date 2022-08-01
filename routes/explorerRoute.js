const router = require('express').Router()

const {explorerGetController} = require('../controllers/explorerController')

const {isAuthenticated} = require('../middleware/authMiddleware')

router.get('/', isAuthenticated, explorerGetController)


module.exports = router