const Post = require('../models/Post')
const Flash = require('../utils/Flash')

exports.searchResultGetController = async (req, res, next) => {
    let term = req.query.term
    let currentPage = parseInt(req.query.page) || 1
    let itemPage = 2

    try {
        let posts = await Post.find({
            $text: {
                $search: term
            }
        })
        .skip( (currentPage * itemPage) - itemPage )
        .limit(itemPage)

        let totalPost = await Post.countDocuments({
            $text: {
                $search: term
            }
        })

        let totalPage = Math.ceil(totalPost / itemPage)

        res.render('pages/explorer/search', {
            title: `Result For ${term}`,
            flashMessage: Flash.getMessage(req),
            searchTerm: term,
            posts,
            currentPage,
            totalPage,
            itemPage
        })

    } catch(e) {
        next(e)
    }

}