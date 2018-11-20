const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const Idea = require("./models/Ideas");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


const app = express();
mongoose.connect('mongodb://localhost:27017/vidjot', {
        useNewUrlParser: true
    }).then(() => {
        console.log("Mongodb connected")
    })
    .catch(err => {
        console.log(err);

    });
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'))










const port = 3000;
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const title = "Welcome";
    res.render('index', {
        title: title
    });
});

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

app.get('/ideas/edit/:id', (req, res) => {
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

app.post('/ideas', (req, res) => {
    let newUser = {
        title: req.body.title,
        details: req.body.details
    }
    new Idea(newUser).save().then(() => {
        res.redirect('/ideas')
    });
});

app.get('/ideas', (req, res) => {
    Idea.find({}).sort({ date: 'desc' }).then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    });
});

app.put('/ideas/:id', (req, res) => {
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

app.delete("/ideas/:id", (req, res) => {
    res.send("delete");
});
app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`Server has started on ${port}`);
});