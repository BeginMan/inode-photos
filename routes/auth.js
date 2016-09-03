/**
 * Created by fangpeng on 16/9/3.
 */
var express = require('express');
var router = express.Router();
var User = require('../lib/user');
var validate = require('../lib/middleware/valid');

router.get('/register', function (req, res, next) {
    res.render('auth/register', {title:'Resigter'})
});

router.post('/register',
    validate.required(['user_name', 'user_pass']),
    validate.lengthAbove('user_pass', 4),
    function (req, res, next) {
    var data = req.body;

    User.getByName(data.user_name, function (err, user) {
        if (err) return next(err);
        if (user.id) {
            res.error('Username already taken!');
            res.redirect('back');
        } else {
            user = new User({
                name: data.user_name,
                pass: data.user_pass
            });
            user.save(function (err) {
                if (err) return next(err);
                req.session.uid = user.id;
                res.redirect('/auth/login');
            })
        }
    })
});


router.get('/login', function (req, res, next) {
    var msg = '';
    if (req.session.user) {
        msg = 'You are already logged in.'
    }
    res.render('auth/login', {title:'Login', msg: msg})
});

router.post('/login', function (req, res, next) {
    var data = req.body;
    User.authenticate(data.user_name, data.user_pass, function (err, user) {
        if (err) return next(err);
        if (user) {
            req.session.uid = user.id;
            res.redirect('/')
        } else {
            res.error('Sorry! invalid credentials.');
            res.redirect('back');   // back login page.
        }
    })
});

router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) throw err;
        res.redirect('/');
    })
});

module.exports = router;
