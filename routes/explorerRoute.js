const router = require('express').Router()

const {
    explorerGetController, 
    singlePostGetController
} = require('../controllers/explorerController')

const {isAuthenticated} = require('../middleware/authMiddleware')

router.get('/', explorerGetController)
router.get('/:postId', singlePostGetController)


module.exports = router