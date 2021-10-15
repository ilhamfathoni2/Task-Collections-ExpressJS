const dbConnection = require("../connection/db");
const router = require("express").Router();

router.get('/task/:id', (req, res) => {
    if(!req.session.user){
        res.redirect("/login");
    } else {
        let collectionsID = req.params.id;

        const query = "SELECT * FROM collections_tb LEFT JOIN users_tb ON collections_tb.user_id = users_tb.id LEFT JOIN task_tb ON task_tb.collections_id = collections_tb.id_collect WHERE user_id= ? AND collections_id = ?";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, [req.session.user, collectionsID], (err, results) => {
                if (err) throw err;
                    
                    res.render('add-data/task', { 
                        title: 'Task',
                        isLogin: req.session.isLogin,
                        task: results,
                    });
                
            });
            conn.release();
        });
    }
});


router.get('/update-task/:id', (req, res) => {
    if(!req.session.user){
        res.redirect("/login");
    } else {
        let idTask = req.params.id;

        const query = "SELECT * FROM `task_tb` WHERE id_task = ?";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, [idTask], (err, results) => {
                if (err) throw err;
                    
                res.render('add-data/update-task', { 
                    title: 'Update Task',
                    isLogin: req.session.isLogin,
                    tasks: results,
                });
            });
            conn.release();
        });
    }
    
});


router.post('/updates-task/:id', (req, res) => {
    if(!req.session.user){
        res.redirect("/login");
    } else {

        const {task, is_done} = req.body;
        let idTask = req.params.id;

        const query = "UPDATE `task_tb` SET `name`= ?, `is_done`= ? WHERE id_task = ?";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, [task, is_done, idTask], (err, results) => {
                if (err) throw err;
                    
                req.session.message = {
                    type: "success",
                    message: "Update task success",
                  };
                res.redirect("/");
            });
            conn.release();
        });
    }
    
});


router.get('/add-task', (req, res) => {
    if(!req.session.user){
        res.redirect("/login");
    } else {

        const query = "SELECT * FROM `collections_tb`";

        dbConnection.getConnection((err, conn) => {
            if (err) throw err;

            conn.query(query, (err, results) => {
                if (err) throw err;
                    
                res.render('add-data/add-task', { 
                    title: 'Add Task',
                    isLogin: req.session.isLogin,
                    tasks: results,
                });
            });
            conn.release();
        });
    }
    
});


router.post('/addnew-tasks', (req, res) => {

    const {task, is_done, collections} = req.body;

    const query = "INSERT INTO `task_tb` (`name`, `is_done`, `collections_id`) VALUES (?,?,?)";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [task, is_done, collections], (err, results) => {
            if (err) throw err;
            
            req.session.message = {
                type: "success",
                message: "Add task success",
              };
            res.redirect("/");
        });
        conn.release();
    });
});


router.post('/edit-task/:id', (req, res) => {

    let idTask = req.params.id;
    const {task, is_done, collections} = req.body;

    const query = "UPDATE `task_tb` SET `name`= ? ,`is_done`= ? ,`collections_id`= ? WHERE id_task = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [task, is_done, collections, idTask], (err, results) => {
            if (err) throw err;
            
            req.session.message = {
                type: "success",
                message: "Edit task success",
              };
            res.redirect("/");
        });
        conn.release();
    });
});


router.get('/delete-task/:id', (req, res) => {

    let idTask = req.params.id;

    const query = "DELETE FROM `task_tb` WHERE id_task = ?";

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [idTask], (err, results) => {
            if (err) throw err;
            
            req.session.message = {
                type: "success",
                message: "Delete task success",
              };
            res.redirect("/");
        });
        conn.release();
    });
});


module.exports = router;