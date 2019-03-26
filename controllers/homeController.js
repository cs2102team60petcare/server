exports.getHomePage =  function (req, res, next) {
    res.render('home', { title: 'Welcome to PetCare Home' })
}
 
