var express = require('express');
var router = express.Router();
var Photo = require('../models/Photo');
var node_upload = require('../lib/upload');
var mime = require('mime');
var fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res, next) {
    Photo.find({}, function (err, photos) {
        if (err) return next(err);
        res.render('photos/photos', {
            title: 'Mongo Photo',
            photos: photos
        })
    });
});


router.get('/upload', function (req, res, next) {
    var res_data = {
        title: 'Upload your picture.'
    };
    res.render('photos/upload', res_data);
});

// upload
router.post('/upload', function (req, res, next) {
    node_upload(req, function (err, fields) {
        if (err) return next(err);

        //console.log(fields);

        for (var item in fields) {
            if (item.indexOf('name_') == 0) {
                var i = item.split('_')[1];
                if (fields['photo_'+i]) {
                    fields['photo_'+i].oriName = fields[item] || fields['photo_'+i].name;
                    // mongodb save
                    Photo.create(fields['photo_'+i])
                }
            }
        }

        res.redirect('/');
    });

});

// view
router.get('/view/:id', function (req, res, next) {
    var id = req.params.id;

    Photo.findById(id, function (err, photo) {
        if (err) return next(err);
        res.sendfile(photo.path, function () {
            console.log('view....');
        });
    })
});

// download
router.get('/download/:id', function (req, res, next) {
    var id = req.params.id;

    Photo.findById(id, function (err, photo) {
        if (err) return next(err);
        var fileName = photo.oriName + '.' + photo.extName;
        var mimetype = mime.lookup(photo.path);
        res.setHeader('Content-type', mimetype);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);

        var filestream = fs.createReadStream(photo.path);
        filestream.pipe(res);
    })
});


module.exports = router;
