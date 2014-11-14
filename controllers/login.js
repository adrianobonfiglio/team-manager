module.exports = function(app) {
	var LoginController = {
		index : function(req, res) {
			res.render('login/index');
		},

		entrar : function(req, res) {
			var usuario = req.body.usuario;
			req.session.usuario = usuario;
			res.redirect('/consulta');
		}
	}

	return LoginController;
}