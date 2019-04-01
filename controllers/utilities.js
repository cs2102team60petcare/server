exports.loggedInOnly = function(req, res, next) {
		  if (req.isAuthenticated()) next();
		  else res.redirect("/login");
	}