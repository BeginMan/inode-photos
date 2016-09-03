exports.notfound = function (req, res) {
    res.status(404).format({
        html: function () {
            res.render('404');
        },
        json: function () {
            res.send({msg: '404 not found.', code: 404})
        },
        text: function () {
            res.send('404 not found.')
        }
    })
};

