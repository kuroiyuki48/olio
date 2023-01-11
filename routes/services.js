var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
* INDEX SERVICES
*/

//! Routes start
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM services ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('services', {
                data: ''
            });
        } else {
            //render ke view services index
            res.render('services/index', {
                data: rows // <-- data services
            });
        }
    });
});

/**
* CREATE SERVICES
*/
router.get('/create', function (req, res, next) {
    res.render('services/create', {
        title: '',
        description: '',
        icon: '',
    })
})

/**
* STORE SERVICES
*/
router.post('/store', function(req, res, next) {
    
    let title   = req.body.title;
    let description = req.body.description;
    let icon = req.body.icon;
    let errors  = false;
    
    if(title.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', "Silahkan Masukkan Title");
        // render to add.ejs with flash message
        res.render('services/create', {
            title: title,
            description: description,
            icon: icon,
        })
    }
    
    if(description.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to add.ejs with flash message
        res.render('services/create', {
            title: title,
            description: description,
            icon: icon,
        })
    }
    
    if(icon.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to add.ejs with flash message
        res.render('services/create', {
            title: title,
            description: description,
            icon: icon,
        })
    }
    
    // if no error
    if(!errors) {
        
        let formData = {
            title: title,
            description: description,
            icon: icon,
        }
        
        // insert query
        connection.query('INSERT INTO services SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                
                // render to add.ejs
                res.render('services/create', {
                    title: formData.title,
                    description: formData.description,               
                    icon: formData.icon,            
                })
            } else {                
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/services');
            }
        })
    }
    
});

/**
* EDIT SERVICES
*/
router.get('/edit/(:id)', function(req, res, next) {
    
    let id = req.params.id;
    
    connection.query('SELECT * FROM services WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan")
            res.redirect('/services')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('services/edit', {
                id:      rows[0].id,
                title:   rows[0].title,
                description: rows[0].description,
                icon: rows[0].icon,
            })
        }
    })
})

/**
* UPDATE SERVICES
*/
router.post('/update/:id', function(req, res, next) {
    
    let id      = req.params.id;
    let title   = req.body.title;
    let description = req.body.description;
    let icon = req.body.icon;
    let errors  = false;
    
    if(title.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Silahkan Masukkan Title");
        // render to edit.ejs with flash message
        res.render('services/edit', {
            id:         req.params.id,
            title:      title,
            description:    description,
            icon:    icon,
        })
    }
    
    if(description.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to edit.ejs with flash message
        res.render('services/edit', {
            id:         req.params.id,
            title:      title,
            description:    description,
            icon:    icon,
        })
    }
    
    if(icon.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to edit.ejs with flash message
        res.render('services/edit', {
            id:         req.params.id,
            title:      title,
            description:    description,
            icon:    icon,
        })
    }
    
    // if no error
    if( !errors ) {   
        
        let formData = {
            title: title,
            description: description,
            icon: icon,
        }
        
        // update query
        connection.query('UPDATE services SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('services/edit', {
                    id:     req.params.id,
                    title:   formData.title,
                    description: formData.description,
                    icon: formData.icon,
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/services');
            }
        })
    }
})

/**
* DELETE SERVICES
*/
router.get('/delete/(:id)', function(req, res, next) {
    
    let id = req.params.id;
    
    connection.query('DELETE FROM services WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to services page
            res.redirect('/services')
        } else {
            // set flash message
            req.flash('success', 'Data Berhasil Dihapus!')
            // redirect to services page
            res.redirect('/services')
        }
    })
})

module.exports = router;