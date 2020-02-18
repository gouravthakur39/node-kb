
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const session = require('express-session')
const flash = require('connect-flash')

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

// express sessions middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

// express messages middleware
  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

// express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
   
     while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
     }
     return {
      param : formParam,
      msg   : msg,
      value : value
     };
    }
   }));
   

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
            req.flash('success', 'Article updated');
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
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Get errors
    let errors = req.validationErrors();

    if(errors) {
        res.render('add_article', {
            title:'Add Article',
            errors:errors
        });
    } else {
        let article = new Article();
    
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;
    
        article.save(err => {
            if(err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article added');
                res.redirect('/');
            }
        });
    }
  
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
