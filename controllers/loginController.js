exports.getLoginPage = function (req, res, next) {
    console.log(req.body)
    res.render('login', { title: 'Login to Petcare' })
}
  
