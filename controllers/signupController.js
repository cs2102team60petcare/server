exports.signUpCareTaker = function (req, res, next) {
  res.render('signupCareTaker', { title: 'Sign up for PetCare as a CareTaker' })
}

exports.signUpOwner = function (req ,res, next) {
  res.render('signupOwner', { title : 'Sign up for Percare as an Owner' })
}