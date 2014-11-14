module.exports = function(app) {
	var dashboard = app.controllers.dashboard;

  var router = app.get('router');

  router.post('/dashboard', dashboard.index);
  router.get('/dashboard/:id', dashboard.index);
}