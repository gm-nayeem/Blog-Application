const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Flash = require('../utils/Flash')

const User = require('../models/User');
const errorFormatter = require('../utils/validationErrorFormatter');


exports.signupGetController = async (req, res, next) => {
    res.render('pages/auth/signup.ejs', 
        {
            title: "Create A New Account", 
            error: {}, 
            value: {},
            flashMessage: Flash.getMessage(req)
        })
}

exports.signupPostController = async (req, res, next) => {

    const {username, email, password} = req.body;

    let errors = validationResult(req).formatWith(errorFormatter);
    if(!errors.isEmpty()){
        req.flash('fail', 'Please Check Your Form');
        return res.render('pages/auth/signup.ejs', 
            {
                title: "Create A New Account", 
                error: errors.mapped(),
                value: {
                    username, email, password
                },
                flashMessage: Flash.getMessage(req)
            })
    }

    try{
        let hashPassword = await bcrypt.hash(password, 12);

        let user = new User({
            username,
            email, 
            password: hashPassword
        })

        await user.save();
        req.flash('success', 'User Created Successful')
        res.redirect('/auth/login');
    } catch(e){
        next(e);
    }
}

exports.loginGetController = async (req, res, next) => {
    
    res.render('pages/auth/login.ejs', 
        {
            title: "Login To Your Account", 
            error: {},
            flashMessage: Flash.getMessage(req)
        });
}

exports.loginPostController = async (req, res, next) => {
    const {email, password} = req.body;

    let errors = validationResult(req).formatWith(errorFormatter);
    if(!errors.isEmpty()){
        req.flash('fail', 'Please Check Your Form')
        return res.render('pages/auth/login.ejs', 
            {
                title: "Login To Your Account", 
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req)
            })
    }

    try{
        let user = await User.findOne({email});
        if(!user){
            req.flash('fail', 'Please Provide Valid Credential')
            return res.render('pages/auth/login.ejs', 
            {
                title: "Login To Your Account", 
                error: {},
                flashMessage: Flash.getMessage(req)
            })
        }

        let matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword){
            req.flash('fail', 'Please Provide Valid Credential')
            return res.render('pages/auth/login.ejs', 
            {
                title: "Login To Your Account", 
                error: {},
                flashMessage: Flash.getMessage(req)
            })
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
            if(err){
                return next(e);
            }
            req.flash('success', 'Successfully Logged In')
            res.redirect('/dashboard');
        })
    } catch(e) {
        next(e);
    }
}

exports.logoutController = async (req, res, next) => {
    req.session.destroy(err => {
        if(err){
            return next(err)
        }
        return res.redirect('/auth/login');
    })
}

exports.changePasswordGetController = async (req, res, next) => {
    res.render('pages/auth/changePassword', {
        title: 'Change Password',
        flashMessage: Flash.getMessage(req)
    })
}

exports.changePasswordPostController = async (req, res, next) => {
    let {oldPassword, newPassword, confirmPassword} = req.body
    
    if(newPassword !== confirmPassword) {
        req.flash('fail', 'Password Does Not Match')
        return res.redirect('/auth/change-password')

    } else if(newPassword === confirmPassword === '' || newPassword === confirmPassword === null) {
        req.flash('fail', 'Password Can Not Be Empty')
        return res.redirect('/auth/change-password')
    }

    try {
        let match = await bcrypt.compare(oldPassword, req.user.password)
        if(!match) {
            req.flash('fail', 'Invalid Old Password')
            return res.redirect('/auth/change-password')
        }

        let hash = await bcrypt.hash(newPassword, 12)
        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {password: hash}}
        )

        req.flash('success', 'Password Updated Successfully')
        return res.redirect('/auth/change-password')

     } catch(e) {
        next(e)
    }
}