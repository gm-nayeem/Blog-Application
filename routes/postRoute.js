const router = require('express').Router()

const postValidator = require('../validator/dashboard/post/postValidator');
const {isAuthenticated} = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

const {
    createPostGetController, 
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostGetController,
    allPostsGetController
} = require('../controllers/postController');


router.get('/create-post', isAuthenticated, createPostGetController);

router.post('/create-post', 
    isAuthenticated, 
    upload.single('post-thumbnail'),
    postValidator, 
    createPostPostController
);

router.get('/edit-post/:postId', isAuthenticated, editPostGetController)

router.post('/edit-post/:postId', 
    isAuthenticated, 
    upload.single('post-thumbnail'),
    postValidator,
    editPostPostController
)

router.get('/delete-post/:postId', isAuthenticated, deletePostGetController)


router.get('/', isAuthenticated, allPostsGetController)


module.exports = router