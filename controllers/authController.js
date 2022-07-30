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