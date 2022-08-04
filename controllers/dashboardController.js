const Flash = require("../utils/Flash")
const User = require('../models/User')
const Profile = require('../models/Profile')
const errorFormater = require('../utils/validationErrorFormatter')
const { validationResult } = require("express-validator")

exports.dashboardGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
        if (profile) {
            return res.render('pages/dashboard/dashboard', {
                title: 'My Dashboard',
                flashMessage: Flash.getMessage(req)
            })
        }

        res.redirect('/dashboard/create-profile')
    } catch (e) {
        next(e)
    }

    res.render('pages/dashboard/dashboard',
        {
            title: 'My Dashboard',
            flashMessage: Flash.getMessage(req)
        })
}


exports.createProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
        if (profile) {
            return res.redirect('/dashboard/edit-profile')
        }

        res.render('pages/dashboard/create-profile', {
            title: 'Create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: {}
        })
    } catch (e) {
        next(e)
    }
}

exports.createProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormater)
    if(!errors.isEmpty()) {
        res.render('pages/dashboard/create-profile', {
            title: 'Create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped()
        })
    }

    const {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body

    try{
        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePics: req.user.profilePics,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            },
            posts: [],
            bookmarks: []
        })

        let createdProfile = await profile.save()
        await User.findOneAndUpdate(
            {_id: req.user.id},
            {$set: {profile: createdProfile._id}}
        )

        req.flash('success', 'Profile Created Successfully')
        res.redirect('/dashboard')
       
    } catch(e){
        next(e)
    }

    
}

exports.editProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
        if (!profile) {
            return res.redirect('/dashboard/create-profile')
        }

        res.render('pages/dashboard/edit-profile', {
            title: 'Edit Your Profile',
            flashMessage: Flash.getMessage(req),
            error: {},
            profile
        })
    } catch (e) {
        next(e)
    }

    console.log("edit profile successfully");
}

exports.editProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormater)
    
    const {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
    } = req.body

    if(!errors.isEmpty()) {
        res.render('pages/dashboard/edit-profile', {
            title: 'Create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            profile: {
                name,
                title,
                bio,
                links: {
                    website,
                    facebook,
                    twitter,
                    github
                }
            }
        })
    }

    try{
        let profile = {
            name,
            title,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            },
        }

        let updateProfile = await Profile.findOneAndUpdate(
            {user: req.user._id},
            {$set: profile},
            {new: true}
        )

        req.flash('success', 'Profile Updated Successfully')
        res.render('pages/dashboard/edit-profile', {
            title: 'Edit Your Profile',
            flashMessage: Flash.getMessage(req),
            error: {},
            profile: updateProfile
        })

    } catch(e){
        next(e)
    }

}

exports.bookmarksGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({user: req.user._id})
            .populate({
                path: 'bookmarks',
                model: 'Post',
                select: 'title thumbnail'
            })

        res.render('pages/dashboard/bookmarks', {
            title: 'My Bookmarks',
            flashMessage: Flash.getMessage(req),
            posts: profile.bookmarks
        })
    } catch(e) {
        next(e)
    }
}
