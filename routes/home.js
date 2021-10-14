const dbConnection = require("../connection/db");
const router = require("express").Router();

router.get('/', (req, res) => {
    const query = "SELECT * FROM `collections_tb` WHERE user_id = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [req.session.user], (err, results) => {
            if (err) throw err;
            
            res.render('home/index', { 
                title: 'Home',
                isLogin: req.session.isLogin,
                collections: results,
            });
        });
        conn.release();
    });
});


router.post('/', (req, res) => {

    let nameCollection = req.body.name_collection;

    const query = "INSERT INTO `collections_tb` (`name_collection`, `user_id`) VALUES (?,?)";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [nameCollection, req.session.user], (err, results) => {
            if (err) throw err;
            
            req.session.message = {
                type: "success",
                message: "Add new collection success",
              };
            res.redirect("/");
        });
        conn.release();
    });
});


router.get('/delete/:id', (req, res) => {

    if(!req.session.user){
        res.redirect("/login");
    } else {
        let idCollection = req.params.id;

        const query = "DELETE FROM `collections_tb` WHERE id_collect = ?";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, [idCollection], (err, results) => {
                if (err) throw err;
                
                req.session.message = {
                    type: "success",
                    message: "Delete collection success",
                };
                res.redirect("/");
            });
            conn.release();
        });
    }
});


router.get('/edit/:id', (req, res) => {
    if(!req.session.user){
        res.redirect("/login");
    } else {
        let idCollection = req.params.id;
    
        const query = "SELECT * FROM `collections_tb` WHERE id_collect = ?";
    
        dbConnection.getConnection((err, conn) => {
            if (err) throw err;
    
            conn.query(query, [idCollection], (err, results) => {
                if (err) throw err;
                
                res.render('edit-data/edit-collection', { 
                    title: 'Edit Collection',
                    isLogin: req.session.isLogin,
                    collections: results,
                });
            });
            conn.release();
        });
    }

});


router.post('/edit/:id', (req, res) => {

    let nameCollection = req.body.name_collection;
    let idCollection = req.params.id;

    const query = "UPDATE `collections_tb` SET name_collection = ? WHERE id_collect = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [nameCollection, idCollection], (err, results) => {
            if (err) throw err;
            
            req.session.message = {
                type: "success",
                message: "Edit collection success",
              };
            res.redirect("/");
        });
        conn.release();
    });
});


module.exports = router;