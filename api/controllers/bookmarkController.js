const Profile = require('../../models/Profile')
const Post = require('../../models/Post')

exports.bookmarksGetController = async (req, res, next) => {
    let {postId} = req.params 
    let bookmark = null

    if(!req.user) {
        return res.status(403).json({
            error: 'You are not an authenticated user'
        })
    }

    let userId = req.user._id

    try {
        let profile = await Profile.findOne({user: userId})

        if(profile.bookmarks.includes(postId)) {
            await Profile.findOneAndUpdate(
                {user: userId},
                {$pull: {bookmarks: postId}}
            )
            bookmark = false
        } else {
            await Profile.findOneAndUpdate(
                {user: userId},
                {$push: {bookmarks: postId}}
            )
            bookmark = true
        }

        res.status(200).json({
            bookmark
        })

    } catch(e) {
        console.log(e)
        res.status(500).json({
            error: 'Server Error Occurred'
        })
    }
}