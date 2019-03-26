exports.getMainPage = function (req, res, next) {
    res.render('index', { title: 'PetCare Main Page' })
}
  
  