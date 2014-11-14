module.exports = function(app) {
	var login = app.controllers.login;

  var router = app.get('router');

	app.get('/', login.index);
	app.get('/login', login.index);
	app.post('/login/entrar', login.entrar);
}