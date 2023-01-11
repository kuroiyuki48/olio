var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');
const bodyparser = require('body-parser');
const multer = require('multer');
const path = require('path');

//use express static folder
router.use(express.static("./public"))
// body-parser middleware use
router.use(bodyparser.json())
router.use(bodyparser.urlencoded({
    extended: true
}))

/**
* INDEX PORTOFOLIO
*/

//! Routes start
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM portofolio ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('portofolio', {
                data: ''
            });
        } else {
            //render ke view portofolio index
            res.render('portofolio/index', {
                data: rows // <-- data portofolio
            });
        }
    });
});

/**
* CREATE PORTOFOLIO
*/
router.get('/create', function (req, res, next) {
    res.render('portofolio/create', {
        title: '',
        description: '',
        kategori: '',
        gambar: '',
    })
})

/**
* STORE PORTOFOLIO
*/

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/assets/img/portofolio/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
});
router.post('/store', upload.single('gambar'), (req, res, next) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        let title   = req.body.title;
        let description = req.body.description;
        let kategori = req.body.kategori;
        let gambar = req.file.filename;
        let errors  = false;
        
        if(title.length === 0) {
            errors = true;
            // set flash message
            req.flash('error', "Silahkan Masukkan Title");
            // render to add.ejs with flash message
            res.render('portofolio/create', {
                title: title,
                description: description,
                kategori: kategori,
                gambar: gambar
            })
        }
        
        if(description.length === 0) {
            errors = true;
            
            // set flash message
            req.flash('error', "Silahkan Masukkan Konten");
            // render to add.ejs with flash message
            res.render('portofolio/create', {
                title: title,
                description: description,
                kategori: kategori,
                gambar: gambar
            })
        }
        
        if(kategori.length === 0) {
            errors = true;
            
            // set flash message
            req.flash('error', "Silahkan Masukkan Konten");
            // render to add.ejs with flash message
            res.render('portofolio/create', {
                title: title,
                description: description,
                kategori: kategori,
                gambar: gambar
            })
        }
        
        // if no error
        if(!errors) {
            
            let formData = {
                title: title,
                description: description,
                kategori: kategori,
                gambar: gambar
            }
            
            // insert query
            connection.query('INSERT INTO portofolio SET ?', formData, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to add.ejs
                    res.render('portofolio/create', {
                        title: formData.title,
                        description: formData.description,               
                        kategori: formData.kategori,              
                        gambar: formData.gambar,              
                    })
                } else {                
                    req.flash('success', 'Data Berhasil Disimpan!');
                    res.redirect('/portofolio');
                }
            })
        }
    }
    
});

/**
* EDIT PORTOFOLIO
*/
router.get('/edit/(:id)', function(req, res, next) {
    
    let id = req.params.id;
    
    connection.query('SELECT * FROM portofolio WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
        
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan")
            res.redirect('/portofolio')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('portofolio/edit', {
                id:      rows[0].id,
                title:   rows[0].title,
                description: rows[0].description,
                kategori: rows[0].kategori,
                gambar: rows[0].gambar,
            })
        }
    })
})

/**
* UPDATE PORTOFOLIO
*/
router.post('/update/:id', upload.single('gambar'), (req, res, next) => {
    let id      = req.params.id;
    let title   = req.body.title;
    let description = req.body.description;
    let kategori = req.body.kategori;
    let errors  = false;

    if (!req.file) {
    
        let id      = req.params.id;
            
        let formData = {
            title: title,
            description: description,
            kategori: kategori,
        }
        connection.query('UPDATE portofolio SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('portofolio/edit', {
                    id:     req.params.id,
                    title:   formData.title,
                    description: formData.description,
                    kategori: formData.kategori,
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/portofolio');
            }
        })
    } else {
        let gambar = req.file.filename;
        
        if(title.length === 0) {
            errors = true;
            
            // set flash message
            req.flash('error', "Silahkan Masukkan Title");
            // render to edit.ejs with flash message
            res.render('portofolio/edit', {
                id:         req.params.id,
                title:      title,
                description:    description,
                kategori:    kategori,
                gambar:    gambar
            })
        }
        
        if(description.length === 0) {
            errors = true;
            
            // set flash message
            req.flash('error', "Silahkan Masukkan Konten");
            // render to edit.ejs with flash message
            res.render('portofolio/edit', {
                id:         req.params.id,
                title:      title,
                description:    description,
                kategori:    kategori,
                gambar:    gambar,
            })
        }
        
        if(kategori.length === 0) {
            errors = true;
            
            // set flash message
            req.flash('error', "Silahkan Masukkan Konten");
            // render to edit.ejs with flash message
            res.render('portofolio/edit', {
                id:         req.params.id,
                title:      title,
                description:    description,
                kategori:    kategori,
                gambar:    gambar,
            })
        }
        
        // if no error
        if( !errors ) {   
            
            let formData = {
                title: title,
                description: description,
                kategori: kategori,
                gambar: gambar,
            }
            
            // update query
            connection.query('UPDATE portofolio SET ? WHERE id = ' + id, formData, function(err, result) {
                //if(err) throw err
                if (err) {
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('portofolio/edit', {
                        id:     req.params.id,
                        title:   formData.title,
                        description: formData.description,
                        kategori: formData.kategori,
                        gambar: formData.gambar,
                    })
                } else {
                    req.flash('success', 'Data Berhasil Diupdate!');
                    res.redirect('/portofolio');
                }
            })
        }
    }
})

/**
* DELETE PORTOFOLIO
*/
router.get('/delete/(:id)', function(req, res, next) {
    
    let id = req.params.id;
    
    connection.query('DELETE FROM portofolio WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to portofolio page
            res.redirect('/portofolio')
        } else {
            // set flash message
            req.flash('success', 'Data Berhasil Dihapus!')
            // redirect to portofolio page
            res.redirect('/portofolio')
        }
    })
})

module.exports = router;