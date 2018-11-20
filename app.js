const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require("path");
const ideas = require('./routes/ideas');
const passport = require('passport');
const user = require('./routes/user');

require('./config/passport')(passport);


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
app.use(methodOverride('_method'));
app.use('/ideas', ideas);
app.use('/user', user);

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: 'true',
    saveUninitialized: true
}));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

const port = 3000;
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const title = "Welcome";
    res.render('index', {
        title: title
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`Server has started on ${port}`);
});