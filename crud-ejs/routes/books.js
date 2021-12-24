var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM books ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('books',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('books',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('books/add', {
        name: '',
        author: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let author = req.body.author;
    let errors = false;

    if(name.length === 0 || author.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('books/add', {
            name: name,
            author: author
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            author: author
        }
        
        // insert query
        dbConn.query('INSERT INTO books SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('books/add', {
                    name: form_data.name,
                    author: form_data.author                    
                })
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/books');
            }
        })
    }
})
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM books WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/books')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/books')
        }
    })
})


module.exports = router;