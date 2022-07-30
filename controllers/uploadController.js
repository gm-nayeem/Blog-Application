const fs = require('fs')
const Profile = require('../models/Profile')
const User = require('../models/User')


exports.uploadProfilePics = async (req, res, next) => {
    if(req.file){
        try{
            let oldProfilePics = req.user.profilePics
            let profile = await Profile.findOne({user: req.user._id})
            let profilePics = `/uploads/${req.file.filename}`
            
            if(profile){
                await Profile.findOneAndUpdate(
                    {user: req.user._id},
                    {$set: {profilePics}}
                )
            }

            await User.findOneAndUpdate(        //always update user
                {_id: req.user._id},
                {$set: {profilePics}}
            )

            if(oldProfilePics !== '/uploads/default.png') {
                fs.unlink(`public${oldProfilePics}`, err => {
                    if(err) console.log(err);
                })
            }

            res.status(200).json({
                message: "successful",
                profilePics
            })
            
        } catch(e) {
            res.status(500).json({
                profilePics: req.user.profilePics,
                message: 'try catch error'
            })
        }
    } else {
        res.status(500).json({
            profilePics: req.user.profilePics,
            message: "conditional error"
        })
    }
}

exports.removeProfilePics = (req, res, next) => {
    try{
        let defaultProfile = '/uploads/default.png'
        let currentProfilePics = req.user.profilePics        

        fs.unlink(`public${currentProfilePics}`, async (err) => {
            let profile = await Profile.findOne({user: req.user._id})
            if(profile){
                await Profile.findOneAndUpdate(
                    {user: req.user._id}, 
                    {$set: {profilePics: defaultProfile}}
                )
            }

            await User.findOneAndUpdate(
                {id: req.user._id}, 
                {$set: {profilePics: defaultProfile}}
            )

            res.status(200).json({
                profilePics: defaultProfile
            })

            console.log('Profile Pic Deleted Successfully')
        })
    } catch(e) {
        res.status(500).json({
            message: 'Can not Remove Profile Pics'
        })
    }
}

exports.postImageUploadController = async (req, res, next) => {
    if(req.file) {
        return res.status(200).json({
            imgUrl: `/uploads/${req.file.filename}`
        })
    }

    return res.status(500).json({
        message: 'Server Error'
    })
}
