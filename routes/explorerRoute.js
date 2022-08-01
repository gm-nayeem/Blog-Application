const router = require('express').Router()

const {
    explorerGetController, 
    singlePostGetController
} = require('../controllers/explorerController')

const {isAuthenticated} = require('../middleware/authMiddleware')

router.get('/:postId', isAuthenticated, singlePostGetController)
router.get('/', isAuthenticated, explorerGetController)


module.exports = router