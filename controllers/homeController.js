exports.getHomePage = function (req, res, next) {
	console.log(req.user)
  	res.render('home', { title: 'What is PetCare?' })
}
