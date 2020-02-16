
const express = require('express')
const path = require('path')

// init app
const app = express()

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const port = 3000

// home route
app.get('/', (req, res) => {
    let articles = [
        {
            id: 1,
            title: "Article one",
            author: "Gourav Thakur",
            body: "This is article one"
        },
        {
            id: 2,
            title: "Article two",
            author: "John Doe",
            body: "This is article two"
        },
        {
            id: 3,
            title: "Article three",
            author: "Gourav Thakur",
            body: "This is article three"
        },
    ];
    

    res.render('index', {
        title: 'Articles',
        articles: articles
    })
}
);

// add route
app.get('/articles/add', (req, res) => 
    res.render('add_article', {
        title: 'Add Article'
    }))

//start server
app.listen(port, () => 
    console.log(`Example app listening on port ${port}!`)
);
