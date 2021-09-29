const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");

/* GET users listing. */
router.get('/',(req, res, next)=> {
  db.User.findAll().then(usrs => {
    var data = {
      title: 'Users/Index',
      content: usrs
    };
    // console.log("user一覧読込"+data.length);
    res.render('users/index', data);
  });
});


// add
router.get('/add',(req, res, next)=> {
  var data = {
    title: 'Users/Add',
    form: new db.User(),
    err:null
  };
  res.render('users/add', data);
});

router.post('/add',(req, res, next)=> {
  const form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  };
  db.sequelize.sync()
    .then(() => db.User.create(form)
    .then(usr=> {
      res.redirect('/users');
    })
    .catch(err=> {
      var data = {
        title: 'Users/Add',
        form: form,
        err: err
      };
      res.render('users/add', data);
    })
    );
});


// edit
router.get('/edit',(req, res, next)=> {
  db.User.findByPk(req.query.id)
  .then(usr => {
    var data = {
      title: 'Users/Edit',
      form: usr
    }
    res.render('users/edit', data);
  });
});

router.post('/edit',(req, res, next)=> {
  db.sequelize.sync()
  .then(() => db.User.update({
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  },
  {
    where:{id:req.body.id}
  }))
  .then(usr => {
    res.redirect('/users');
  });
});

// delete
router.get('/delete',(req, res, next)=> {
  db.User.findByPk(req.query.id)
  .then(usr => {
    var data = {
      title: 'Users/Delete',
      form: usr
    }
    res.render('users/delete', data);
  });
});

router.post('/delete',(req, res, next)=> {
  db.sequelize.sync()
  .then(() => db.User.destroy({
    where:{id:req.body.id}
  }))
  .then(usr => {
    res.redirect('/users');
  });
});

// login
router.get('/login', (req, res, next) => {
  var data = {
     title:'Users/Login',
     content:'名前とパスワードを入力下さい。'
  };
  res.render('users/login', data);
});

router.post('/login', (req, res, next) => {
  db.User.findOne({
    where:{
      name:req.body.name,
      pass:req.body.pass,
    }
  }).then(usr=>{
    if (usr != null) {
      req.session.login = usr;
      let back = req.session.back;
      if (back == null){
        back = '/';
      }
      console.log("login");
      res.redirect(back);
    } else {
      var data = {
        title:'Users/Login',
        content:'名前かパスワードに問題があります。再度入力下さい。'
      };
      res.render('users/login', data);
    }
  });
});


module.exports = router;
