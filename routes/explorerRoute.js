const router = require('express').Router()

const {
    explorerGetController, 
    singlePostGetController
} = require('../controllers/explorerController')

const {isAuthenticated} = require('../middleware/authMiddleware')

router.get('/', isAuthenticated, explorerGetController)
router.get('/:postId', isAuthenticated, singlePostGetController)


module.exports = router