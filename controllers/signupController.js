exports.signUp = function (req, res, next) {
  res.status(200).render('forms', { title: 'Sign up for PetCare' })
}
