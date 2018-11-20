const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const session = require('express-session');
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.use(passport.initialize());
router.use(passport.session());

router.use(session({
    secret: 'secret',
    resave: 'true',
    saveUninitialized: true
}));
router.use(flash());
router.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// console.log(req.locals.user);


router.get("/login", (req, res) => {
    res.render('user/login', {
        errors: [],

    })


});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/user/login',
        failureFlash: true

    })(req, res, next);

});
router.get("/register", (req, res) => {
    res.render('user/register', { errors: [], name: '', email: '', password: '', password2: '' });
});


router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Password do not match' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be of 4 characters' });
    }
    if (errors.length > 0) {
        res.render('user/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2

        });
        // console.log(errors);

    } else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    console.log(err);

                };
                newUser.password = hash;
                newUser.save().then(user => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/user/login');
                }).catch(err => {
                    console.log(err);
                    return

                });
            });
        });
        // res.send('pass');
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success-msg', 'You are logged out');
    res.redirect('/user/login');
    // res.send('ok');
});

module.exports = router;