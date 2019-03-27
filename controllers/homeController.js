exports.getHomePage = function (req, res, next) {
	console.log(req.session)
  	res.render('home', { title: 'What is PetCare?' })
}
