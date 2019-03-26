exports.getHomePage = function (req, res, next) {
  res.render('home', { title: 'What is PetCare?' })
}
