exports.getHomePage = function (req, res, next) {
  	res.render('home', { username : req.query.username })
}
