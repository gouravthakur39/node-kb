
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

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

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// set static or public folder
app.use(express.static(path.join(__dirname, 'public')));



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

// get single article
app.get('/article/:id', (req, res) => 
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
        article: article
    });
  })
);

// Load edit form
app.get('/article/edit/:id', (req, res) => 
  Article.findById(req.params.id, (err, article) => {
    res.render('edit_article', {
        title:'Edit Article',
        article: article
    });
  })
);

// update post submit route
app.post('/articles/edit/:id', (req, res) => {
    let article = {};

    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}

    Article.update(query, article, (err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// add route
app.get('/articles/add', (req, res) => 
    res.render('add_article', {
        title: 'Add Article'
    })
);

// add post submit route
app.post('/articles/add', (req, res) => {
    let article = new Article();

    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(err => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// Delete Article
app.delete('/article/:id', function(req, res){
    let query = {_id:req.params.id}
    Article.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});



//start server
app.listen(port, () => 
    console.log(`Example app listening on port ${port}!`)
);
