const express = require('express');
const router = express.Router();
const Idea = require("../models/Ideas");
const flash = require('connect-flash');
const session = require('express-session');
const {
    ensureAuthenticated
} = require('../helper/auth');


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

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findById({
        _id: req.params.id,
    }).then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });
});

router.post('/', ensureAuthenticated, (req, res) => {
    let newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.body.id
        }
        // console.log(req.body.id);

    new Idea(newUser).save().then(() => {
        req.flash('success_msg', 'Video Idea Added');

        res.redirect('/ideas')
    });
});

router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({
        user: req.params.id
    }).sort({
        date: 'desc'
    }).then(ideas => {
        res.render('ideas/index', {
            ideas: ideas,
            // message: ''
        });
    });
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    // res.send('put');
    Idea.findOne({
        _id: req.user.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save().then(idea => {
            res.redirect('/ideas');
        })
    })


});

router.delete("/:id", ensureAuthenticated, (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'video idea removed');
        res.redirect('/ideas');
    });
});


module.exports = router;