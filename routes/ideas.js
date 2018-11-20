const express = require('express');
const router = express.Router();
const Idea = require("../models/Ideas");
const flash = require('connect-flash');
const session = require('express-session');


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

router.get('/add', (req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', (req, res) => {
    Idea.findById({
        _id: req.params.id,
        // title: req.params.title,
        // details: req.params.title
    }).then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });
    // console.log();

});

router.post('/', (req, res) => {
    let newUser = {
        title: req.body.title,
        details: req.body.details
    }
    new Idea(newUser).save().then(() => {
        req.flash('success_msg', 'Video Idea Added');

        res.redirect('/ideas')
    });
});

router.get('/', (req, res) => {
    Idea.find({}).sort({
        date: 'desc'
    }).then(ideas => {
        res.render('ideas/index', {
            ideas: ideas,
            // message: ''
        });
    });
});

router.put('/:id', (req, res) => {
    // res.send('put');
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save().then(idea => {
            res.redirect('/ideas');
        })
    })


});

router.delete("/:id", (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'video idea removed');
        res.redirect('/ideas');
    });
});


module.exports = router;