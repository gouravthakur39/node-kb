
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// check connection
db.once('open', () => {
    console.log('connected to mongoDB');
});

// check for db errors
db.on('error', err => {
    console.log(err);
});  


// init app
const app = express()

// bring in model
let Article = require('./models/article');

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const port = 3000

// home route
app.get('/', (req, res) => {
    Article.find({} , (err, articles) => {
        if (err){
            console.log(err)
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
        
    }); 
});

// add route
app.get('/articles/add', (req, res) => 
    res.render('add_article', {
        title: 'Add Article'
    }))

//start server
app.listen(port, () => 
    console.log(`Example app listening on port ${port}!`)
);
