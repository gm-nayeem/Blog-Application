const moment = require('moment')
const Flash = require('../utils/Flash')
const Post = require('../models/Post')
const Profile = require('../models/Profile')

const genDate = (days) => {
    let date = moment().subtract(days, 'days')
    return date.toDate()
}

const generateFilterObject = (filter) => {  // filtering post 
    let filterObject = {}
    let order = 1   //for latest (descending)

    switch(filter) {
        case 'week': {
            filterObject = {
                createdAt: {
                    $gt: genDate(7)
                }
            }
            order = -1
            break
        }
        case 'month': {
            filterObject = {
                createdAt: {
                    $gt: genDate(30)
                }
            }
            order = -1
            break
        }
        case 'all': {
            order = -1
        }
    }

    return {filterObject, order}
}


exports.explorerGetController = async (req, res, next) => {

    let filter = req.query.filter || 'latest'   // for button that active or not

    let currentPage = parseInt(req.query.page) || 1   
    let itemPerPage = 2

    let {filterObject, order} = generateFilterObject(filter.toLowerCase())

    try {
        let posts = await Post.find(filterObject)
            .populate('author', 'username') // for showing who posted (author.username)
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip( (currentPage * itemPerPage) - itemPerPage )
            .limit(itemPerPage)

        let totalPost = await Post.countDocuments()
        let totalPage = Math.ceil(totalPost / itemPerPage)

        let bookmarks = []
        if(req.user) {
            let profile = await Profile.findOne({user: req.user._id})
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer', {
            title: 'Explore All Posts', 
            flashMessage: Flash.getMessage(req),
            filter,
            posts,
            currentPage,       
            totalPage,
            bookmarks
        })

    } catch(e) {
        next(e)
    }

}


exports.singlePostGetController = async (req, res, next) => {
    console.log('I am comming to single post controller');
    let {postId} = req.params

    try {
        let post = await Post.findById(postId)
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'username profilePics'
                }
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies.user',
                    select: 'username profilePics'
                }
            })

        if(!post) {
            let error = new Error('404 Page Not  Found')
            error.status = 404
            throw error
        }

        let bookmarks = []
        if(req.user) {
            let profile = await Profile.findOne({user: req.user._id})
            if(profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/singlePostPage', {
            title: post.title,
            flashMessage: Flash.getMessage(req),
            post,
            bookmarks
        })

        console.log("end page controller")

    } catch(e) {
        next(e)
    }
}