exports.getHomePage = function (req, res, next) {
	console.log(req.query)
  	res.render('home', { title: 'What is PetCare?' })
}
